import { describe, it, expect, vi, beforeEach } from 'vitest';
import { deleteConversation } from '../chatDelete.js';

// Mock dependencies
vi.mock('../../../../../services/dbService.js', () => ({
  default: {
    findBy: vi.fn(),
    delete: vi.fn(),
  }
}));

vi.mock('../../../../../services/logger.js', () => ({
  default: {
    warn: vi.fn(),
    info: vi.fn(),
    error: vi.fn(),
  }
}));

import DbService from '../../../../../services/dbService.js';
import logger from '../../../../../services/logger.js';

describe('deleteConversation', () => {
  const mockConversationId = 'conv-123';
  const mockUserId = 'user-456';
  const mockOtherUserId = 'user-789';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('successful deletion', () => {
    it('should successfully delete conversation and its messages', async () => {
      // Arrange
      const mockConversation = {
        id: mockConversationId,
        user_id: mockUserId,
        title: 'Test Conversation'
      };

      DbService.findBy.mockResolvedValue([mockConversation]);
      DbService.delete.mockResolvedValueOnce(5); // 5 messages deleted
      DbService.delete.mockResolvedValueOnce(1); // 1 conversation deleted

      // Act
      const result = await deleteConversation(mockConversationId, mockUserId);

      // Assert
      expect(result).toBe(true);
      expect(DbService.findBy).toHaveBeenCalledWith('conversations', 'id', mockConversationId);
      expect(DbService.delete).toHaveBeenCalledWith('chat_messages', {
        conversation_id: mockConversationId
      });
      expect(DbService.delete).toHaveBeenCalledWith('conversations', {
        id: mockConversationId,
        user_id: mockUserId
      });
      expect(logger.info).toHaveBeenCalledWith(`Deleted 5 messages from conversation ${mockConversationId}`);
      expect(logger.info).toHaveBeenCalledWith(`Successfully deleted conversation ${mockConversationId}`);
    });

    it('should successfully delete conversation with zero messages', async () => {
      // Arrange
      const mockConversation = {
        id: mockConversationId,
        user_id: mockUserId,
        title: 'Empty Conversation'
      };

      DbService.findBy.mockResolvedValue([mockConversation]);
      DbService.delete.mockResolvedValueOnce(0); // 0 messages deleted
      DbService.delete.mockResolvedValueOnce(1); // 1 conversation deleted

      // Act
      const result = await deleteConversation(mockConversationId, mockUserId);

      // Assert
      expect(result).toBe(true);
      expect(logger.info).toHaveBeenCalledWith(`Deleted 0 messages from conversation ${mockConversationId}`);
      expect(logger.info).toHaveBeenCalledWith(`Successfully deleted conversation ${mockConversationId}`);
    });
  });

  describe('conversation not found', () => {
    it('should return false when conversation does not exist', async () => {
      // Arrange
      DbService.findBy.mockResolvedValue([]);

      // Act
      const result = await deleteConversation(mockConversationId, mockUserId);

      // Assert
      expect(result).toBe(false);
      expect(DbService.findBy).toHaveBeenCalledWith('conversations', 'id', mockConversationId);
      expect(logger.warn).toHaveBeenCalledWith(`Conversation ${mockConversationId} not found`);
      expect(DbService.delete).not.toHaveBeenCalled();
    });

    it('should return false when findBy returns null', async () => {
      // Arrange
      DbService.findBy.mockResolvedValue(null);

      // Act
      const result = await deleteConversation(mockConversationId, mockUserId);

      // Assert
      expect(result).toBe(false);
      expect(logger.warn).toHaveBeenCalledWith(`Conversation ${mockConversationId} not found`);
      expect(DbService.delete).not.toHaveBeenCalled();
    });
  });

  describe('authorization failures', () => {
    it('should return false when user is not authorized to delete conversation', async () => {
      // Arrange
      const mockConversation = {
        id: mockConversationId,
        user_id: mockOtherUserId, // Different user
        title: 'Someone else\'s conversation'
      };

      DbService.findBy.mockResolvedValue([mockConversation]);

      // Act
      const result = await deleteConversation(mockConversationId, mockUserId);

      // Assert
      expect(result).toBe(false);
      expect(DbService.findBy).toHaveBeenCalledWith('conversations', 'id', mockConversationId);
      expect(logger.warn).toHaveBeenCalledWith(`User ${mockUserId} not authorized to delete conversation ${mockConversationId}`);
      expect(DbService.delete).not.toHaveBeenCalled();
    });
  });

  describe('deletion failures', () => {
    it('should return false when conversation deletion fails', async () => {
      // Arrange
      const mockConversation = {
        id: mockConversationId,
        user_id: mockUserId,
        title: 'Test Conversation'
      };

      DbService.findBy.mockResolvedValue([mockConversation]);
      DbService.delete.mockResolvedValueOnce(3); // 3 messages deleted
      DbService.delete.mockResolvedValueOnce(0); // 0 conversations deleted (failure)

      // Act
      const result = await deleteConversation(mockConversationId, mockUserId);

      // Assert
      expect(result).toBe(false);
      expect(logger.info).toHaveBeenCalledWith(`Deleted 3 messages from conversation ${mockConversationId}`);
      expect(logger.error).toHaveBeenCalledWith(`Failed to delete conversation ${mockConversationId}`);
    });
  });

  describe('error handling', () => {
    it('should throw error when findBy fails', async () => {
      // Arrange
      const mockError = new Error('Database connection failed');
      DbService.findBy.mockRejectedValue(mockError);

      // Act & Assert
      await expect(deleteConversation(mockConversationId, mockUserId)).rejects.toThrow('Database connection failed');
      expect(logger.error).toHaveBeenCalledWith('Error deleting conversation:', mockError);
    });

    it('should throw error when message deletion fails', async () => {
      // Arrange
      const mockConversation = {
        id: mockConversationId,
        user_id: mockUserId,
        title: 'Test Conversation'
      };
      const mockError = new Error('Message deletion failed');

      DbService.findBy.mockResolvedValue([mockConversation]);
      DbService.delete.mockRejectedValue(mockError);

      // Act & Assert
      await expect(deleteConversation(mockConversationId, mockUserId)).rejects.toThrow('Message deletion failed');
      expect(logger.error).toHaveBeenCalledWith('Error deleting conversation:', mockError);
    });

    it('should throw error when conversation deletion fails with exception', async () => {
      // Arrange
      const mockConversation = {
        id: mockConversationId,
        user_id: mockUserId,
        title: 'Test Conversation'
      };
      const mockError = new Error('Conversation deletion failed');

      DbService.findBy.mockResolvedValue([mockConversation]);
      DbService.delete.mockResolvedValueOnce(2); // Messages deleted successfully
      DbService.delete.mockRejectedValue(mockError); // Conversation deletion fails

      // Act & Assert
      await expect(deleteConversation(mockConversationId, mockUserId)).rejects.toThrow('Conversation deletion failed');
      expect(logger.info).toHaveBeenCalledWith(`Deleted 2 messages from conversation ${mockConversationId}`);
      expect(logger.error).toHaveBeenCalledWith('Error deleting conversation:', mockError);
    });
  });

  describe('edge cases', () => {
    it('should handle empty string conversationId', async () => {
      // Arrange
      DbService.findBy.mockResolvedValue([]);

      // Act
      const result = await deleteConversation('', mockUserId);

      // Assert
      expect(result).toBe(false);
      expect(DbService.findBy).toHaveBeenCalledWith('conversations', 'id', '');
      expect(logger.warn).toHaveBeenCalledWith('Conversation  not found');
    });

    it('should handle empty string userId', async () => {
      // Arrange
      const mockConversation = {
        id: mockConversationId,
        user_id: mockUserId,
        title: 'Test Conversation'
      };

      DbService.findBy.mockResolvedValue([mockConversation]);

      // Act
      const result = await deleteConversation(mockConversationId, '');

      // Assert
      expect(result).toBe(false);
      expect(logger.warn).toHaveBeenCalledWith(`User  not authorized to delete conversation ${mockConversationId}`);
    });
  });
}); 