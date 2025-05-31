import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createConversation } from '../database/conversationCreate.js';
import DbService from '../../../../../services/db-service/dbService.js';
import logger from '../../../../../services/logger.js';
import * as assessmentObjectLink from '../database/assessmentObjectLink.js';

// Mock dependencies
vi.mock('../../../../../services/db-service/dbService.js');
vi.mock('../../../../../services/logger.js');
vi.mock('uuid', () => ({
  v4: () => 'mock-conversation-id'
}));

// Mock the assessment object link module
vi.mock('../database/assessmentObjectLink.js', () => ({
  fetchAssessmentObject: vi.fn(),
  extractAssessmentPattern: vi.fn()
}));

describe('conversationCreate with assessment linking', () => {
  const mockUserId = 'user-123';
  const mockAssessmentId = 'assessment-456';
  const mockConversationId = 'mock-conversation-id';
  
  const mockAssessmentObject = {
    id: 'assessment-456',
    user_id: 'user-123',
    age: '20-24',
    pattern: 'irregular',
    cycle_length: 'irregular',
    period_duration: '4-5',
    flow_heaviness: 'medium',
    pain_level: 'moderate',
    physical_symptoms: ['bloating', 'fatigue'],
    emotional_symptoms: ['mood-swings'],
    other_symptoms: 'cramping',
    recommendations: [{ title: 'Exercise', description: 'Regular exercise' }],
    created_at: '2024-01-15T10:00:00.000Z',
    updated_at: '2024-01-15T10:00:00.000Z'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    logger.info = vi.fn();
    logger.warn = vi.fn();
    logger.error = vi.fn();
    DbService.create = vi.fn().mockResolvedValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('with assessment ID provided', () => {
    it('should store assessment object and pattern in conversation', async () => {
      assessmentObjectLink.fetchAssessmentObject.mockResolvedValue(mockAssessmentObject);
      assessmentObjectLink.extractAssessmentPattern.mockReturnValue('irregular');

      const conversationId = await createConversation(mockUserId, mockAssessmentId);

      // Verify assessment fetch was called
      expect(assessmentObjectLink.fetchAssessmentObject).toHaveBeenCalledWith(mockAssessmentId);
      expect(assessmentObjectLink.extractAssessmentPattern).toHaveBeenCalledWith(mockAssessmentObject);

      // Verify conversation was created with all assessment data
      expect(DbService.create).toHaveBeenCalledWith('conversations', {
        id: mockConversationId,
        user_id: mockUserId,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        assessment_id: mockAssessmentId,
        assessment_object: mockAssessmentObject,
        assessment_pattern: 'irregular'
      });

      expect(conversationId).toBe(mockConversationId);
      expect(logger.info).toHaveBeenCalledWith(
        `Linked assessment ${mockAssessmentId} to conversation`,
        { pattern: 'irregular', hasAssessmentObject: true }
      );
    });

    it('should handle assessment fetch failure gracefully', async () => {
      assessmentObjectLink.fetchAssessmentObject.mockRejectedValue(new Error('Fetch failed'));

      const conversationId = await createConversation(mockUserId, mockAssessmentId);

      // Conversation should still be created with assessment_id but no object
      expect(DbService.create).toHaveBeenCalledWith('conversations', {
        id: mockConversationId,
        user_id: mockUserId,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        assessment_id: mockAssessmentId
      });

      expect(conversationId).toBe(mockConversationId);
      expect(logger.warn).toHaveBeenCalledWith(
        `Could not fetch assessment data for ${mockAssessmentId}:`,
        expect.any(Error)
      );
    });

    it('should handle null assessment object', async () => {
      assessmentObjectLink.fetchAssessmentObject.mockResolvedValue(null);

      const conversationId = await createConversation(mockUserId, mockAssessmentId);

      // Conversation should be created with assessment_id only
      expect(DbService.create).toHaveBeenCalledWith('conversations', {
        id: mockConversationId,
        user_id: mockUserId,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        assessment_id: mockAssessmentId
      });

      expect(conversationId).toBe(mockConversationId);
      expect(assessmentObjectLink.extractAssessmentPattern).not.toHaveBeenCalled();
    });

    it('should handle assessment object without pattern', async () => {
      const assessmentWithoutPattern = { ...mockAssessmentObject };
      delete assessmentWithoutPattern.pattern;
      
      assessmentObjectLink.fetchAssessmentObject.mockResolvedValue(assessmentWithoutPattern);
      assessmentObjectLink.extractAssessmentPattern.mockReturnValue(null);

      const conversationId = await createConversation(mockUserId, mockAssessmentId);

      // Should store assessment object but no pattern
      expect(DbService.create).toHaveBeenCalledWith('conversations', {
        id: mockConversationId,
        user_id: mockUserId,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        assessment_id: mockAssessmentId,
        assessment_object: assessmentWithoutPattern
      });

      expect(conversationId).toBe(mockConversationId);
    });
  });

  describe('without assessment ID', () => {
    it('should create conversation without assessment data', async () => {
      const conversationId = await createConversation(mockUserId, null);

      expect(assessmentObjectLink.fetchAssessmentObject).not.toHaveBeenCalled();
      expect(DbService.create).toHaveBeenCalledWith('conversations', {
        id: mockConversationId,
        user_id: mockUserId,
        created_at: expect.any(String),
        updated_at: expect.any(String)
      });

      expect(conversationId).toBe(mockConversationId);
      expect(logger.info).toHaveBeenCalledWith(
        `Created conversation ${mockConversationId} for user ${mockUserId}`,
        { hasAssessment: false, assessmentPattern: null }
      );
    });

    it('should handle undefined assessment ID', async () => {
      const conversationId = await createConversation(mockUserId, undefined);

      expect(assessmentObjectLink.fetchAssessmentObject).not.toHaveBeenCalled();
      expect(conversationId).toBe(mockConversationId);
    });
  });

  describe('error handling', () => {
    it('should throw error for empty user ID', async () => {
      await expect(createConversation('', mockAssessmentId))
        .rejects.toThrow('User ID is required and cannot be empty');
      
      expect(DbService.create).not.toHaveBeenCalled();
    });

    it('should throw error for null user ID', async () => {
      await expect(createConversation(null, mockAssessmentId))
        .rejects.toThrow('User ID is required and cannot be empty');
    });

    it('should throw error when database create fails', async () => {
      DbService.create.mockRejectedValue(new Error('Database error'));
      assessmentObjectLink.fetchAssessmentObject.mockResolvedValue(mockAssessmentObject);
      assessmentObjectLink.extractAssessmentPattern.mockReturnValue('irregular');

      await expect(createConversation(mockUserId, mockAssessmentId))
        .rejects.toThrow('Database error');
      
      expect(logger.error).toHaveBeenCalledWith(
        'Error creating conversation:',
        expect.any(Error)
      );
    });
  });

  describe('logging', () => {
    it('should log appropriate info for successful creation with assessment', async () => {
      assessmentObjectLink.fetchAssessmentObject.mockResolvedValue(mockAssessmentObject);
      assessmentObjectLink.extractAssessmentPattern.mockReturnValue('irregular');

      await createConversation(mockUserId, mockAssessmentId);

      expect(logger.info).toHaveBeenCalledTimes(3);
      expect(logger.info).toHaveBeenCalledWith(
        `Linked assessment ${mockAssessmentId} to conversation`,
        { pattern: 'irregular', hasAssessmentObject: true }
      );
      expect(logger.info).toHaveBeenCalledWith(
        `Created conversation ${mockConversationId} for user ${mockUserId}`,
        { hasAssessment: true, assessmentPattern: 'irregular' }
      );
    });
  });
}); 