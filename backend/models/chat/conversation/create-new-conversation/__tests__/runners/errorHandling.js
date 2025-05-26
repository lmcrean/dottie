import { describe, it, expect } from 'vitest';
import { createAssessmentConversation } from '../../createFlow.js';
import logger from '@/services/logger.js';

/**
 * Tests for error handling scenarios
 */
export const runErrorHandlingTests = (mockData) => {
  const { mockUserId, mockAssessmentId, mockConversationId } = mockData;

  describe('Error handling', () => {
    it('should handle conversation creation failure', async () => {
      const error = new Error('Database connection failed');
      
      const { createConversation } = await import('../../../database/chatCreate.js');
      createConversation.mockRejectedValue(error);
      
      await expect(createAssessmentConversation(mockUserId, mockAssessmentId))
        .rejects.toThrow('Database connection failed');
      
      expect(logger.error).toHaveBeenCalledWith(
        'Error creating assessment conversation:',
        error
      );
    });

    it('should handle initial message creation failure', async () => {
      const error = new Error('Message creation failed');
      
      const { createConversation } = await import('../../../database/chatCreate.js');
      createConversation.mockResolvedValue(mockConversationId);
      
      const { createInitialMessage } = await import('../../../../message/user-message/add-message/create-initial-message/createInitialMessage.js');
      createInitialMessage.mockRejectedValue(error);
      
      await expect(createAssessmentConversation(mockUserId, mockAssessmentId))
        .rejects.toThrow('Message creation failed');
      
      expect(logger.error).toHaveBeenCalledWith(
        'Error creating assessment conversation:',
        error
      );
    });

    it('should handle missing user ID', async () => {
      await expect(createAssessmentConversation(null, mockAssessmentId))
        .rejects.toThrow();
    });

    it('should handle missing assessment ID', async () => {
      await expect(createAssessmentConversation(mockUserId, null))
        .rejects.toThrow();
    });

    it('should handle undefined parameters', async () => {
      await expect(createAssessmentConversation(undefined, undefined))
        .rejects.toThrow();
    });

    it('should handle empty string parameters', async () => {
      await expect(createAssessmentConversation('', ''))
        .rejects.toThrow();
    });

    it('should propagate unexpected errors', async () => {
      const unexpectedError = new Error('Unexpected system error');
      
      const { createConversation } = await import('../../../database/chatCreate.js');
      createConversation.mockRejectedValue(unexpectedError);
      
      await expect(createAssessmentConversation(mockUserId, mockAssessmentId))
        .rejects.toThrow('Unexpected system error');
    });
  });
}; 