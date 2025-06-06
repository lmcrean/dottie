import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { createAssessmentConversation } from '../createFlow.js';
import { createConversation } from '../database/conversationCreate.js';
import DbService from '../../../../../services/db-service/dbService.js';
import logger from '../../../../../services/logger.js';

// Mock dependencies
vi.mock('../../../../../services/db-service/dbService.js');
vi.mock('../../../../../services/logger.js');
vi.mock('uuid', () => ({
  v4: () => 'test-conversation-id'
}));

describe('Conversation creation integration flow', () => {
  const mockUserId = 'user-789';
  const mockAssessmentId = 'assessment-123';
  const mockConversationId = 'test-conversation-id';
  
  const fullAssessmentData = {
    id: 'assessment-123',
    user_id: 'user-789',
    age: '16-20',
    pattern: 'irregular',
    cycle_length: 'varies',
    period_duration: '6-7',
    flow_heaviness: 'heavy',
    pain_level: 'severe',
    physical_symptoms: ['bloating', 'fatigue', 'headaches', 'acne'],
    emotional_symptoms: ['mood-swings', 'anxiety', 'irritability'],
    other_symptoms: 'severe cramping and back pain',
    recommendations: [
      { title: 'Track Patterns', description: 'Use a period tracking app' },
      { title: 'Pain Management', description: 'Try heat therapy and gentle exercise' },
      { title: 'Medical Consultation', description: 'Consider seeing a healthcare provider' }
    ],
    created_at: '2024-01-20T14:30:00.000Z',
    updated_at: '2024-01-20T14:30:00.000Z'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    logger.info = vi.fn();
    logger.warn = vi.fn();
    logger.error = vi.fn();
    logger.debug = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Full integration flow', () => {
    it('should create conversation with complete assessment data', async () => {
      // Mock database operations
      DbService.findById.mockResolvedValue(fullAssessmentData);
      DbService.create.mockResolvedValue(true);

      // Execute the flow
      const result = await createAssessmentConversation(mockUserId, mockAssessmentId);

      // Verify the result
      expect(result).toEqual({
        conversationId: mockConversationId,
        assessmentId: mockAssessmentId,
        created_at: expect.any(String)
      });

      // Verify assessment was fetched
      expect(DbService.findById).toHaveBeenCalledWith('assessments', mockAssessmentId);

      // Verify conversation was created with all data
      expect(DbService.create).toHaveBeenCalledWith('conversations', {
        id: mockConversationId,
        user_id: mockUserId,
        created_at: expect.any(String),
        updated_at: expect.any(String),
        assessment_id: mockAssessmentId,
        assessment_object: fullAssessmentData,
        assessment_pattern: 'irregular'
      });

      // Verify logging
      expect(logger.info).toHaveBeenCalledWith(
        `Creating conversation for user ${mockUserId} with assessment ${mockAssessmentId}`
      );
      expect(logger.info).toHaveBeenCalledWith(
        `Linked assessment ${mockAssessmentId} to conversation`,
        { pattern: 'irregular', hasAssessmentObject: true }
      );
    });

    it('should handle production-like scenario with real data', async () => {
      // Simulate production data structure
      const productionAssessment = {
        id: '6811f47a-a454-474f-b470-24c2a3223941',
        user_id: '6811f47a-a454-474f-b470-24c2a3223941',
        age: '25-34',
        pattern: 'regular',
        cycle_length: '28-30',
        period_duration: '4-5',
        flow_heaviness: 'medium',
        pain_level: 'mild',
        physical_symptoms: ['bloating'],
        emotional_symptoms: ['mood-swings'],
        other_symptoms: null,
        recommendations: [
          { title: 'Stay Hydrated', description: 'Drink plenty of water' }
        ],
        created_at: '2025-05-28T08:04:50.244+00:00',
        updated_at: '2025-05-28T08:04:50.244+00:00'
      };

      DbService.findById.mockResolvedValue(productionAssessment);
      DbService.create.mockResolvedValue(true);

      const result = await createAssessmentConversation(
        productionAssessment.user_id, 
        productionAssessment.id
      );

      // Verify conversation includes pattern at root level
      expect(DbService.create).toHaveBeenCalledWith('conversations', 
        expect.objectContaining({
          assessment_pattern: 'regular',
          assessment_object: productionAssessment
        })
      );
    });

    it('should create conversation even when assessment fetch fails', async () => {
      DbService.findById.mockRejectedValue(new Error('Database timeout'));
      DbService.create.mockResolvedValue(true);

      const result = await createAssessmentConversation(mockUserId, mockAssessmentId);

      // Should still create conversation
      expect(result.conversationId).toBe(mockConversationId);
      
      // But without assessment object
      expect(DbService.create).toHaveBeenCalledWith('conversations', 
        expect.objectContaining({
          assessment_id: mockAssessmentId,
          // No assessment_object or assessment_pattern
        })
      );
      
      expect(DbService.create.mock.calls[0][1]).not.toHaveProperty('assessment_object');
      expect(DbService.create.mock.calls[0][1]).not.toHaveProperty('assessment_pattern');
    });

    it('should handle missing assessment gracefully', async () => {
      DbService.findById.mockResolvedValue(null);
      DbService.create.mockResolvedValue(true);

      const result = await createAssessmentConversation(mockUserId, mockAssessmentId);

      expect(result.conversationId).toBe(mockConversationId);
      expect(logger.warn).toHaveBeenCalledWith(`Assessment ${mockAssessmentId} not found`);
    });
  });

  describe('Data validation in flow', () => {
    it('should validate assessment data structure', async () => {
      const invalidAssessment = {
        id: mockAssessmentId,
        // Missing required fields
        pattern: 'irregular'
      };

      DbService.findById.mockResolvedValue(invalidAssessment);
      DbService.create.mockResolvedValue(true);

      await createAssessmentConversation(mockUserId, mockAssessmentId);

      // Should still create with available data
      expect(DbService.create).toHaveBeenCalledWith('conversations', 
        expect.objectContaining({
          assessment_pattern: 'irregular',
          assessment_object: expect.objectContaining({
            pattern: 'irregular',
            physical_symptoms: [],
            emotional_symptoms: [],
            other_symptoms: null,
            recommendations: []
          })
        })
      );
    });
  });
}); 