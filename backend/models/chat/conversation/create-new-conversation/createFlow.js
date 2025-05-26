import logger from '../../../../services/logger.js';
import { createConversation } from '../database/chatCreate.js';
import { setupAssessmentContext, validateAssessmentContext } from './assessment/assessmentSetupContext.js';
import { createInitialMessage } from '../../message/user-message/add-message/create-initial-message/createInitialMessage.js';

/**
 * Complete conversation creation flow
 * @param {string} userId - User ID
 * @param {Object} options - Creation options
 * @param {string} options.assessmentId - Assessment ID to link (required)
 * @param {boolean} [options.createInitialMessage=true] - Create automated initial message
 * @returns {Promise<Object>} - Created conversation with initial messages
 */
export const createCompleteConversation = async (userId, options = {}) => {
  const { 
    assessmentId, 
    createInitialMessage: shouldCreateInitialMessage = true 
  } = options;

  try {
    logger.info(`Starting conversation creation flow for user ${userId}`);

    // Step 1: Validate assessment ID is provided
    if (!assessmentId) {
      throw new Error('Assessment ID is required for chat conversations - system error if missing');
    }

    // Step 2: Setup assessment context and get full data 
    const assessmentContext = await setupAssessmentContext(userId, assessmentId);
    const assessmentData = assessmentContext.assessmentData;

    // Step 3: Create the conversation (still need pattern for database)
    const conversationId = await createConversation(userId, assessmentId, assessmentData?.pattern || null);

    // Step 4: Handle initial message
    let messages = null;
    if (shouldCreateInitialMessage) {
      messages = await createInitialMessage(conversationId, userId);
    }

    logger.info(`Conversation creation flow completed for conversation ${conversationId}`);

    return {
      conversationId,
      assessmentId,
      assessmentData,
      messages,
      created_at: new Date().toISOString()
    };

  } catch (error) {
    logger.error('Error in conversation creation flow:', error);
    throw error;
  }
};

/**
 * Create conversation with manual first message
 * @param {string} userId - User ID
 * @param {string} firstMessage - First message text
 * @param {string} assessmentId - Assessment ID (required)
 * @returns {Promise<Object>} - Created conversation
 */
export const createConversationWithMessage = async (userId, firstMessage, assessmentId) => {
  return await createCompleteConversation(userId, {
    assessmentId,
    createInitialMessage: true
  });
};

/**
 * Create empty conversation (no initial messages)
 * @param {string} userId - User ID
 * @param {string} assessmentId - Assessment ID (required)
 * @returns {Promise<Object>} - Created conversation
 */
export const createEmptyConversation = async (userId, assessmentId) => {
  return await createCompleteConversation(userId, {
    assessmentId,
    createInitialMessage: false
  });
};

/**
 * Quick conversation creation for assessment discussion
 * @param {string} userId - User ID
 * @param {string} assessmentId - Assessment ID
 * @returns {Promise<Object>} - Created conversation with automated initial message
 */
export const createAssessmentConversation = async (userId, assessmentId) => {
  return await createCompleteConversation(userId, {
    assessmentId,
    createInitialMessage: true
  });
}; 