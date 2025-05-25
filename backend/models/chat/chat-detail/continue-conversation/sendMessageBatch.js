import logger from '../../../../services/logger.js';
import { sendMessageWithResponse } from './sendMessageWithResponse.js';

/**
 * Batch send multiple messages (useful for testing or bulk operations)
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @param {Array<string>} messages - Array of message texts
 * @param {Object} [options] - Batch options
 * @param {boolean} [options.autoResponse=false] - Auto-generate responses
 * @param {number} [options.delay=0] - Delay between messages (ms)
 * @returns {Promise<Array>} - Array of sent messages
 */
export const sendMessageBatch = async (conversationId, userId, messages, options = {}) => {
  const { autoResponse = false, delay = 0 } = options;
  const results = [];

  try {
    for (const messageText of messages) {
      const result = await sendMessageWithResponse(conversationId, userId, messageText, { autoResponse });
      results.push(result);
      
      if (delay > 0 && results.length < messages.length) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    logger.info(`Batch sent ${messages.length} messages to conversation ${conversationId}`);
    return results;

  } catch (error) {
    logger.error('Error in batch message sending:', error);
    throw error;
  }
}; 