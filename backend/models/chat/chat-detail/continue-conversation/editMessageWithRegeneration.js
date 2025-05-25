import logger from '../../../../services/logger.js';
import { editMessage } from './sendMessage.js';
import { generateResponseToMessage } from './generateResponse.js';

/**
 * Edit message and regenerate subsequent responses
 * @param {string} conversationId - Conversation ID
 * @param {string} messageId - Message ID to edit
 * @param {string} userId - User ID
 * @param {string} newContent - New message content
 * @param {Object} [options] - Edit options
 * @param {boolean} [options.regenerateResponse=true] - Regenerate AI response
 * @returns {Promise<Object>} - Updated message and new response
 */
export const editMessageWithRegeneration = async (conversationId, messageId, userId, newContent, options = {}) => {
  const { regenerateResponse = true } = options;

  try {
    logger.info(`Starting message edit flow for message ${messageId}`);

    // Step 1: Edit the message (this will handle thread cleanup)
    const updatedMessage = await editMessage(conversationId, messageId, userId, newContent);

    // Step 2: Generate new response if requested
    let newResponse = null;
    if (regenerateResponse) {
      newResponse = await generateResponseToMessage(conversationId, messageId, newContent);
    }

    logger.info(`Message edit flow completed for message ${messageId}`);

    return {
      updatedMessage,
      newResponse,
      conversationId,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    logger.error('Error in message edit flow:', error);
    throw error;
  }
}; 