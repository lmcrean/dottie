import { describe, it, expect, beforeEach } from 'vitest';
import { createAssessmentConversation } from '../../createFlow.js';
import logger from '@/services/logger.js';

/**
 * Tests for successful conversation creation scenarios
 */
export const runSuccessfulCreationTests = (mockData) => {
  const { mockUserId, mockAssessmentId, mockConversationId } = mockData;

  describe('Successful conversation creation', () => {
    beforeEach(async () => {
      // Setup mocks for successful scenarios
      const { createConversation } = await import('../../database/conversationCreate.js');
      createConversation.mockResolvedValue(mockConversationId);
    });

    it('should create empty conversation with user_id', async () => {
      const result = await createAssessmentConversation(mockUserId, mockAssessmentId);
      
      // Verify conversation was created
      expect(result).toBeDefined();
      expect(result.conversationId).toBe(mockConversationId);
      
      // Verify conversation has user_id
      const { createConversation } = await import('../../database/conversationCreate.js');
      expect(createConversation).toHaveBeenCalledWith(mockUserId, mockAssessmentId);
    });

    it('should store entire assessment object', async () => {
      const result = await createAssessmentConversation(mockUserId, mockAssessmentId);
      
      // Verify assessment ID is linked to conversation
      expect(result.assessmentId).toBe(mockAssessmentId);
      
      // The conversation should reference the assessment
      const { createConversation } = await import('../../database/conversationCreate.js');
      expect(createConversation).toHaveBeenCalledWith(mockUserId, mockAssessmentId);
    });

    it('should create conversation ready for messages', async () => {
      const result = await createAssessmentConversation(mockUserId, mockAssessmentId);
      
      // Verify conversation was created successfully
      expect(result.conversationId).toBe(mockConversationId);
      expect(result.assessmentId).toBe(mockAssessmentId);
      
      // Verify conversation creation was called with correct parameters
      const { createConversation } = await import('../../database/conversationCreate.js');
      expect(createConversation).toHaveBeenCalledWith(mockUserId, mockAssessmentId);
    });

    it('should trigger conversation creation with logging', async () => {
      const result = await createAssessmentConversation(mockUserId, mockAssessmentId);
      
      // Verify the conversation creation completed
      expect(result.conversationId).toBe(mockConversationId);
      expect(result.assessmentId).toBe(mockAssessmentId);
      
      // Verify logging indicates successful creation
      expect(logger.info).toHaveBeenCalledWith(
        `Creating conversation for user ${mockUserId} with assessment ${mockAssessmentId}`
      );
      expect(logger.info).toHaveBeenCalledWith(
        `Conversation ${mockConversationId} created successfully`
      );
    });

    it('should return complete conversation object', async () => {
      const result = await createAssessmentConversation(mockUserId, mockAssessmentId);
      
      // Verify all required fields are present
      expect(result).toMatchObject({
        conversationId: mockConversationId,
        assessmentId: mockAssessmentId,
        created_at: expect.any(String)
      });
      
      // Verify created_at is a valid ISO date
      expect(() => new Date(result.created_at)).not.toThrow();
      expect(new Date(result.created_at).toISOString()).toBe(result.created_at);
    });
  });
}; 