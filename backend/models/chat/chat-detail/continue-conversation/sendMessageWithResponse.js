import logger from '../../../../services/logger.js';
import { sendFollowUpMessage } from './sendMessage.js';
import { generateResponseToMessage } from './generateResponse.js';

/**
 * Complete follow-up message flow (send message + generate response)
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @param {string} messageText - Message content
 * @param {Object} [options] - Flow options
 * @param {boolean} [options.autoResponse=true] - Auto-generate AI response
 * @param {string} [options.parentMessageId] - Parent message for threading
 * @returns {Promise<Object>} - Complete message exchange
 */
export const sendMessageWithResponse = async (conversationId, userId, messageText, options = {}) => {
  const { autoResponse = true, parentMessageId = null } = options;

  try {
    logger.info(`Starting follow-up message flow for conversation ${conversationId}`);

    // Step 1: Send user message
    const userMessage = await sendFollowUpMessage(conversationId, userId, messageText, parentMessageId);

    // Step 2: Generate AI response (if enabled)
    let assistantMessage = null;
    if (autoResponse) {
      assistantMessage = await generateResponseToMessage(conversationId, userMessage.id, messageText);
    }

    logger.info(`Follow-up message flow completed for conversation ${conversationId}`);

    return {
      userMessage,
      assistantMessage,
      conversationId,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    logger.error('Error in follow-up message flow:', error);
    throw error;
  }
}; 