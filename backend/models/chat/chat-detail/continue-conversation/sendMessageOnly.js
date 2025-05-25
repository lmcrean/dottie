import { sendMessageWithResponse } from './sendMessageWithResponse.js';

/**
 * Send message without automatic response
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @param {string} messageText - Message content
 * @returns {Promise<Object>} - User message only
 */
export const sendMessageOnly = async (conversationId, userId, messageText) => {
  return await sendMessageWithResponse(conversationId, userId, messageText, { autoResponse: false });
}; 