import logger from '../../../../../services/logger.js';
import { createConversation } from './chatCreate.js';
import { setupAssessmentContext, validateAssessmentContext } from './assessmentSetup.js';
import { createInitialMessage, autoTriggerInitialConversation } from './initialMessage.js';

/**
 * Complete conversation creation flow
 * @param {string} userId - User ID
 * @param {Object} options - Creation options
 * @param {string} [options.assessmentId] - Assessment ID to link
 * @param {string} [options.initialMessage] - Custom initial message
 * @param {boolean} [options.autoTrigger=true] - Auto-trigger initial conversation
 * @returns {Promise<Object>} - Created conversation with initial messages
 */
export const createCompleteConversation = async (userId, options = {}) => {
  const { 
    assessmentId = null, 
    initialMessage = null, 
    autoTrigger = true 
  } = options;

  try {
    logger.info(`Starting conversation creation flow for user ${userId}`);

    // Step 1: Validate assessment context if provided
    if (assessmentId) {
      const isValidAssessment = await validateAssessmentContext(userId, assessmentId);
      if (!isValidAssessment) {
        throw new Error('Invalid assessment context');
      }
    }

    // Step 2: Setup assessment context and get pattern
    let assessmentPattern = null;
    if (assessmentId) {
      const assessmentContext = await setupAssessmentContext(userId, assessmentId);
      assessmentPattern = assessmentContext.assessmentPattern;
    }

    // Step 3: Create the conversation
    const conversationId = await createConversation(userId, assessmentId, assessmentPattern);

    // Step 4: Handle initial message
    let messages = null;
    if (autoTrigger) {
      if (initialMessage) {
        messages = await createInitialMessage(conversationId, userId, initialMessage, assessmentPattern);
      } else {
        messages = await autoTriggerInitialConversation(conversationId, userId, assessmentPattern);
      }
    }

    logger.info(`Conversation creation flow completed for conversation ${conversationId}`);

    return {
      conversationId,
      assessmentId,
      assessmentPattern,
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
 * @param {string} [assessmentId] - Assessment ID
 * @returns {Promise<Object>} - Created conversation
 */
export const createConversationWithMessage = async (userId, firstMessage, assessmentId = null) => {
  return await createCompleteConversation(userId, {
    assessmentId,
    initialMessage: firstMessage,
    autoTrigger: true
  });
};

/**
 * Create empty conversation (no initial messages)
 * @param {string} userId - User ID
 * @param {string} [assessmentId] - Assessment ID
 * @returns {Promise<Object>} - Created conversation
 */
export const createEmptyConversation = async (userId, assessmentId = null) => {
  return await createCompleteConversation(userId, {
    assessmentId,
    autoTrigger: false
  });
};

/**
 * Quick conversation creation for assessment discussion
 * @param {string} userId - User ID
 * @param {string} assessmentId - Assessment ID
 * @returns {Promise<Object>} - Created conversation with assessment context
 */
export const createAssessmentConversation = async (userId, assessmentId) => {
  return await createCompleteConversation(userId, {
    assessmentId,
    autoTrigger: true
  });
}; 