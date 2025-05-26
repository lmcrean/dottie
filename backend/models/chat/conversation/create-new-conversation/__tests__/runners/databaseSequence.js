import { describe, it, expect } from 'vitest';
import { createAssessmentConversation } from '../../createFlow.js';

/**
 * Tests for database operations sequence validation
 */
export const runDatabaseSequenceTests = (mockData) => {
  const { mockUserId, mockAssessmentId, mockConversationId, mockInitialMessage } = mockData;

  describe('Database operations sequence', () => {
    it('should execute operations in correct order', async () => {
      const callOrder = [];
      
      const { createConversation } = await import('../../../database/chatCreate.js');
      createConversation.mockImplementation(async (userId, assessmentId) => {
        callOrder.push('createConversation');
        return mockConversationId;
      });
      
      const { createInitialMessage } = await import('../../../../message/user-message/add-message/create-initial-message/createInitialMessage.js');
      createInitialMessage.mockImplementation(async (conversationId, userId) => {
        callOrder.push('createInitialMessage');
        return mockInitialMessage;
      });
      
      await createAssessmentConversation(mockUserId, mockAssessmentId);
      
      // Verify correct execution order
      expect(callOrder).toEqual(['createConversation', 'createInitialMessage']);
    });

    it('should pass correct parameters between operations', async () => {
      const { createConversation } = await import('../../../database/chatCreate.js');
      createConversation.mockResolvedValue(mockConversationId);
      
      const { createInitialMessage } = await import('../../../../message/user-message/add-message/create-initial-message/createInitialMessage.js');
      createInitialMessage.mockResolvedValue(mockInitialMessage);
      
      await createAssessmentConversation(mockUserId, mockAssessmentId);
      
      // Verify conversation creation parameters
      expect(createConversation).toHaveBeenCalledWith(mockUserId, mockAssessmentId);
      
      // Verify message creation uses the returned conversation ID
      expect(createInitialMessage).toHaveBeenCalledWith(mockConversationId, mockUserId);
    });

    it('should stop execution if conversation creation fails', async () => {
      const error = new Error('Conversation creation failed');
      
      const { createConversation } = await import('../../../database/chatCreate.js');
      createConversation.mockRejectedValue(error);
      
      const { createInitialMessage } = await import('../../../../message/user-message/add-message/create-initial-message/createInitialMessage.js');
      createInitialMessage.mockResolvedValue(mockInitialMessage);
      
      await expect(createAssessmentConversation(mockUserId, mockAssessmentId))
        .rejects.toThrow('Conversation creation failed');
      
      // Verify message creation was never called
      expect(createInitialMessage).not.toHaveBeenCalled();
    });

    it('should handle async operation timing', async () => {
      let conversationCreated = false;
      let messageCreated = false;
      
      const { createConversation } = await import('../../../database/chatCreate.js');
      createConversation.mockImplementation(async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        conversationCreated = true;
        return mockConversationId;
      });
      
      const { createInitialMessage } = await import('../../../../message/user-message/add-message/create-initial-message/createInitialMessage.js');
      createInitialMessage.mockImplementation(async () => {
        expect(conversationCreated).toBe(true); // Should be created first
        messageCreated = true;
        return mockInitialMessage;
      });
      
      await createAssessmentConversation(mockUserId, mockAssessmentId);
      
      expect(conversationCreated).toBe(true);
      expect(messageCreated).toBe(true);
    });
  });
}; 