import { describe, it, expect, beforeEach } from 'vitest';
import { createAssessmentConversation } from '../../createFlow.ts';
import logger from '@/services/logger.ts';

/**
 * Tests for error handling and edge cases
 */
export const runErrorHandlingTests = (mockData) => {
  const { mockUserId, mockAssessmentId } = mockData;

  describe('Error handling and edge cases', () => {
    beforeEach(() => {
      // Reset mocks before each test
      logger.error.mockClear();
    });

    it('should handle conversation creation failure', async () => {
      const error = new Error('Database connection failed');
      
      const { createConversation } = await import('../../database/conversationCreate.js');
      createConversation.mockRejectedValue(error);
      
      await expect(createAssessmentConversation(mockUserId, mockAssessmentId))
        .rejects.toThrow('Database connection failed');
      
      expect(logger.error).toHaveBeenCalledWith('Error creating assessment conversation:', error);
    });

    it('should handle initial message creation failure', async () => {
      const conversationError = new Error('Message creation failed');
      
      const { createConversation } = await import('../../database/conversationCreate.js');
      createConversation.mockResolvedValue('test-conversation-id');
      
      const { createInitialMessage } = await import('../../../../message/user-message/add-message/create-initial-message/createInitialMessage.js');
      createInitialMessage.mockRejectedValue(conversationError);
      
      await expect(createAssessmentConversation(mockUserId, mockAssessmentId))
        .rejects.toThrow('Message creation failed');
      
      expect(logger.error).toHaveBeenCalledWith('Error creating assessment conversation:', conversationError);
    });

    it('should handle missing user ID', async () => {
      // Configure mock to reject for invalid user IDs
      const { createConversation } = await import('../../database/conversationCreate.js');
      createConversation.mockImplementation((userId, assessmentId) => {
        if (!userId || userId.trim() === '') {
          return Promise.reject(new Error('User ID is required and cannot be empty'));
        }
        return Promise.resolve('test-conversation-id');
      });
      
      await expect(createAssessmentConversation(null, mockAssessmentId))
        .rejects.toThrow('User ID is required and cannot be empty');
      
      await expect(createAssessmentConversation(undefined, mockAssessmentId))
        .rejects.toThrow('User ID is required and cannot be empty');
      
      await expect(createAssessmentConversation('', mockAssessmentId))
        .rejects.toThrow('User ID is required and cannot be empty');
    });

    it('should handle missing assessment ID', async () => {
      // Assessment ID can be optional, so this should not necessarily fail
      // But we test the behavior when it's explicitly null or undefined
      const { createConversation } = await import('../../database/conversationCreate.js');
      createConversation.mockResolvedValue('test-conversation-id');
      
      const { createInitialMessage } = await import('../../../../message/user-message/add-message/create-initial-message/createInitialMessage.js');
      createInitialMessage.mockResolvedValue({
        id: 'msg-123',
        role: 'user',
        content: 'Test message',
        created_at: new Date().toISOString()
      });
      
      // These should work - assessment can be optional
      const result1 = await createAssessmentConversation(mockUserId, null);
      expect(result1.conversationId).toBeDefined();
      
      const result2 = await createAssessmentConversation(mockUserId, undefined);
      expect(result2.conversationId).toBeDefined();
    });

    it('should handle network timeouts gracefully', async () => {
      const timeoutError = new Error('Request timeout');
      timeoutError.code = 'TIMEOUT';
      
      const { createConversation } = await import('../../database/conversationCreate.js');
      createConversation.mockRejectedValue(timeoutError);
      
      await expect(createAssessmentConversation(mockUserId, mockAssessmentId))
        .rejects.toThrow('Request timeout');
      
      expect(logger.error).toHaveBeenCalledWith('Error creating assessment conversation:', timeoutError);
    });
  });
}; 
