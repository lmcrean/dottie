import logger from '../../../../services/logger.js';
import { sendMessage } from './sendMessage.js';

/**
 * Continue conversation with contextual awareness
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @param {string} messageText - Message content
 * @param {Object} [context] - Additional context
 * @returns {Promise<Object>} - Complete message exchange with context
 */
export const continueConversationWithContext = async (conversationId, userId, messageText, context = {}) => {
  try {
    const result = await sendMessage(conversationId, userId, messageText, { context });
    
    return result;
  } catch (error) {
    logger.error('Error continuing conversation with context:', error);
    throw error;
  }
}; 