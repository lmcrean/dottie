import logger from '';
import { createConversation } from '';
import { createInitialMessage } from '';

/**
 * Create conversation with assessment and initial message
 * @param {string} userId - User ID
 * @param {string} assessmentId - Assessment ID (stored as FK)
 * @returns {Promise<Object>} - Created conversation with initial message
 */
export const createAssessmentConversation = async (userId, assessmentId) => {
  try {
    logger.info(`Creating conversation for user ${userId} with assessment ${assessmentId}`);

    // Create conversation with assessment FK
    const conversationId = await createConversation(userId, assessmentId);

    // Create initial automated message
    const initialMessage = await createInitialMessage(conversationId, userId);

    logger.info(`Conversation ${conversationId} created successfully`);

    return {
      conversationId,
      assessmentId,
      initialMessage,
      created_at: new Date().toISOString()
    };

  } catch (error) {
    logger.error('Error creating assessment conversation:', error);
    throw error;
  }
}; 
