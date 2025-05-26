import { describe, it, expect, beforeEach } from 'vitest';
import { createAssessmentConversation } from '../../createFlow.ts';
import logger from '@/services/logger.ts';

/**
 * Tests for database operation sequence and timing
 */
export const runDatabaseSequenceTests = (mockData) => {
  const { mockUserId, mockAssessmentId, mockConversationId, mockInitialMessage } = mockData;

  describe('Database sequence validation', () => {
    beforeEach(async () => {
      const { createConversation } = await import('../../database/conversationCreate.js');
      createConversation.mockResolvedValue(mockConversationId);
      
      const { createInitialMessage } = await import('../../../../message/user-message/add-message/create-initial-message/createInitialMessage.js');
      createInitialMessage.mockResolvedValue(mockInitialMessage);
    });

    it('should create conversation before creating initial message', async () => {
      await createAssessmentConversation(mockUserId, mockAssessmentId);
      
      // Verify conversation is created first
      const { createConversation } = await import('../../database/conversationCreate.js');
      const { createInitialMessage } = await import('../../../../message/user-message/add-message/create-initial-message/createInitialMessage.js');
      
      expect(createConversation).toHaveBeenCalledBefore(createInitialMessage);
      expect(createInitialMessage).toHaveBeenCalledWith(mockConversationId, mockUserId);
    });

    it('should pass conversation ID to initial message creation', async () => {
      await createAssessmentConversation(mockUserId, mockAssessmentId);
      
      // Verify the sequence and parameter passing
      const { createConversation } = await import('../../database/conversationCreate.js');
      const { createInitialMessage } = await import('../../../../message/user-message/add-message/create-initial-message/createInitialMessage.js');
      
      expect(createConversation).toHaveBeenCalledWith(mockUserId, mockAssessmentId);
      expect(createInitialMessage).toHaveBeenCalledWith(mockConversationId, mockUserId);
    });

    it('should handle database operation timing correctly', async () => {
      const startTime = Date.now();
      await createAssessmentConversation(mockUserId, mockAssessmentId);
      const endTime = Date.now();
      
      // Verify reasonable execution time (not stuck in infinite loops)
      expect(endTime - startTime).toBeLessThan(1000); // Should complete within 1 second
      
      // Verify all operations completed
      const { createConversation } = await import('../../database/conversationCreate.js');
      const { createInitialMessage } = await import('../../../../message/user-message/add-message/create-initial-message/createInitialMessage.js');
      
      expect(createConversation).toHaveBeenCalled();
      expect(createInitialMessage).toHaveBeenCalled();
    });

    it('should maintain referential integrity between operations', async () => {
      const result = await createAssessmentConversation(mockUserId, mockAssessmentId);
      
      // Verify the returned object maintains consistency
      const { createConversation } = await import('../../database/conversationCreate.js');
      const { createInitialMessage } = await import('../../../../message/user-message/add-message/create-initial-message/createInitialMessage.js');
      
      expect(result.conversationId).toBe(mockConversationId);
      expect(result.assessmentId).toBe(mockAssessmentId);
      expect(result.initialMessage).toBe(mockInitialMessage);
      
      // Verify that the conversation ID used for message creation matches returned ID
      expect(createInitialMessage).toHaveBeenCalledWith(mockConversationId, mockUserId);
      expect(createConversation).toHaveBeenCalledWith(mockUserId, mockAssessmentId);
    });

    it('should log operations in correct sequence', async () => {
      await createAssessmentConversation(mockUserId, mockAssessmentId);
      
      // Verify logging sequence indicates proper operation flow
      expect(logger.info).toHaveBeenCalledWith(
        `Creating conversation for user ${mockUserId} with assessment ${mockAssessmentId}`
      );
      expect(logger.info).toHaveBeenCalledWith(
        `Conversation ${mockConversationId} created successfully`
      );
    });
  });
}; 
