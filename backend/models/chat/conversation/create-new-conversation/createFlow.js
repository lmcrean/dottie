import logger from '../../../../services/logger.js';
import { createConversation } from './database/conversationCreate.js';

/**
 * Create conversation with assessment
 * @param {string} userId - User ID
 * @param {string} assessmentId - Assessment ID (stored as FK)
 * @returns {Promise<Object>} - Created conversation
 */
export const createAssessmentConversation = async (userId, assessmentId) => {
  try {
    logger.info(`Creating conversation for user ${userId} with assessment ${assessmentId}`);

    // Create conversation with assessment FK
    const conversationId = await createConversation(userId, assessmentId);

    logger.info(`Conversation ${conversationId} created successfully`);

    return {
      conversationId,
      assessmentId,
      created_at: new Date().toISOString()
    };

  } catch (error) {
    logger.error('Error creating assessment conversation:', error);
    throw error;
  }
}; 