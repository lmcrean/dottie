import { describe, beforeEach, afterEach, vi, it, expect } from 'vitest';
import { getUserConversations } from '../chatGetList.js';
import DbService from '@/services/dbService.js';
import logger from '@/services/logger.js';

// Mock all dependencies
vi.mock('@/services/dbService.js');
vi.mock('@/services/logger.js');

describe('getUserConversations', () => {
  const mockUserId = 'test-user-123';
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    logger.error = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Successful retrieval', () => {
    it('should return formatted conversations when conversations exist', async () => {
      // Arrange
      const mockDbConversations = [
        {
          id: 'conv-1',
          user_id: 'test-user-123',
          assessment_id: 'assessment-1',
          assessment_pattern: 'regular',
          last_message_date: '2024-01-15T10:00:00.000Z',
          preview: 'This is a test message that is longer than fifty characters',
          message_count: 3
        },
        {
          id: 'conv-2',
          user_id: 'test-user-123',
          assessment_id: null,
          assessment_pattern: 'irregular',
          last_message_date: '2024-01-14T09:00:00.000Z',
          preview: 'Short message',
          message_count: 1
        }
      ];

      DbService.getConversationsWithPreviews = vi.fn().mockResolvedValue(mockDbConversations);

      // Act
      const result = await getUserConversations(mockUserId);

      // Assert
      expect(DbService.getConversationsWithPreviews).toHaveBeenCalledWith(mockUserId);
      expect(result).toHaveLength(2);
      
      // Check first conversation formatting
      expect(result[0]).toEqual({
        id: 'conv-1',
        last_message_date: '2024-01-15T10:00:00.000Z',
        preview: 'This is a test message that is longer than fifty characters...',
        message_count: 3,
        assessment_id: 'assessment-1',
        assessment_pattern: 'regular',
        user_id: 'test-user-123'
      });

      // Check second conversation formatting
      expect(result[1]).toEqual({
        id: 'conv-2',
        last_message_date: '2024-01-14T09:00:00.000Z',
        preview: 'Short message',
        message_count: 1,
        assessment_id: null,
        assessment_pattern: 'irregular',
        user_id: 'test-user-123'
      });
    });

    it('should handle conversations with null/undefined preview', async () => {
      // Arrange
      const mockDbConversations = [
        {
          id: 'conv-1',
          user_id: 'test-user-123',
          assessment_id: 'assessment-1',
          assessment_pattern: 'regular',
          last_message_date: '2024-01-15T10:00:00.000Z',
          preview: null,
          message_count: 0
        },
        {
          id: 'conv-2',
          user_id: 'test-user-123',
          assessment_id: null,
          assessment_pattern: 'irregular',
          last_message_date: '2024-01-14T09:00:00.000Z',
          preview: undefined,
          message_count: undefined
        }
      ];

      DbService.getConversationsWithPreviews = vi.fn().mockResolvedValue(mockDbConversations);

      // Act
      const result = await getUserConversations(mockUserId);

      // Assert
      expect(result).toHaveLength(2);
      expect(result[0].preview).toBe('No messages yet');
      expect(result[0].message_count).toBe(0);
      expect(result[1].preview).toBe('No messages yet');
      expect(result[1].message_count).toBe(0);
    });

    it('should truncate preview messages longer than 50 characters', async () => {
      // Arrange
      const longMessage = 'This is a very long message that definitely exceeds fifty characters and should be truncated with ellipsis';
      const mockDbConversations = [
        {
          id: 'conv-1',
          user_id: 'test-user-123',
          assessment_id: 'assessment-1',
          assessment_pattern: 'regular',
          last_message_date: '2024-01-15T10:00:00.000Z',
          preview: longMessage,
          message_count: 1
        }
      ];

      DbService.getConversationsWithPreviews = vi.fn().mockResolvedValue(mockDbConversations);

      // Act
      const result = await getUserConversations(mockUserId);

      // Assert
      expect(result[0].preview).toBe(longMessage + '...');
      expect(result[0].preview.length).toBeGreaterThan(50);
    });
  });

  describe('Empty results', () => {
    it('should return empty array when no conversations exist', async () => {
      // Arrange
      DbService.getConversationsWithPreviews = vi.fn().mockResolvedValue([]);

      // Act
      const result = await getUserConversations(mockUserId);

      // Assert
      expect(DbService.getConversationsWithPreviews).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual([]);
    });

    it('should handle null result from database', async () => {
      // Arrange
      DbService.getConversationsWithPreviews = vi.fn().mockResolvedValue(null);

      // Act
      const result = await getUserConversations(mockUserId);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('Error handling', () => {
    it('should log error and re-throw when DbService fails', async () => {
      // Arrange
      const mockError = new Error('Database connection failed');
      DbService.getConversationsWithPreviews = vi.fn().mockRejectedValue(mockError);

      // Act & Assert
      await expect(getUserConversations(mockUserId)).rejects.toThrow('Database connection failed');
      
      expect(logger.error).toHaveBeenCalledWith('[getUserConversations] Error getting user conversations:', mockError);
    });

    it('should handle invalid user_id parameter', async () => {
      // Arrange
      const invalidUserId = null;
      DbService.getConversationsWithPreviews = vi.fn().mockRejectedValue(new Error('Invalid user ID'));

      // Act & Assert
      await expect(getUserConversations(invalidUserId)).rejects.toThrow('Invalid user ID');
      expect(DbService.getConversationsWithPreviews).toHaveBeenCalledWith(invalidUserId);
    });
  });

  describe('Data integrity', () => {
    it('should preserve all required conversation fields', async () => {
      // Arrange
      const mockDbConversations = [
        {
          id: 'conv-1',
          user_id: 'test-user-123',
          assessment_id: 'assessment-1',
          assessment_pattern: 'regular',
          last_message_date: '2024-01-15T10:00:00.000Z',
          preview: 'Test message',
          message_count: 5
        }
      ];

      DbService.getConversationsWithPreviews = vi.fn().mockResolvedValue(mockDbConversations);

      // Act
      const result = await getUserConversations(mockUserId);

      // Assert
      const conversation = result[0];
      expect(conversation).toHaveProperty('id');
      expect(conversation).toHaveProperty('user_id');
      expect(conversation).toHaveProperty('assessment_id');
      expect(conversation).toHaveProperty('assessment_pattern');
      expect(conversation).toHaveProperty('last_message_date');
      expect(conversation).toHaveProperty('preview');
      expect(conversation).toHaveProperty('message_count');
    });

    it('should maintain correct data types', async () => {
      // Arrange
      const mockDbConversations = [
        {
          id: 'conv-1',
          user_id: 'test-user-123',
          assessment_id: 'assessment-1',
          assessment_pattern: 'regular',
          last_message_date: '2024-01-15T10:00:00.000Z',
          preview: 'Test message',
          message_count: 5
        }
      ];

      DbService.getConversationsWithPreviews = vi.fn().mockResolvedValue(mockDbConversations);

      // Act
      const result = await getUserConversations(mockUserId);

      // Assert
      const conversation = result[0];
      expect(typeof conversation.id).toBe('string');
      expect(typeof conversation.user_id).toBe('string');
      expect(typeof conversation.preview).toBe('string');
      expect(typeof conversation.message_count).toBe('number');
    });
  });
}); 