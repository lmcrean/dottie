import logger from '../../../../../services/logger.js';
import DbService from '../../../../../services/dbService.js';
import { generateMessageId } from '../../shared/utils/responseBuilders.js';

/**
 * Send a chatbot message and store it in the database
 * @param {string} conversationId - Conversation ID
 * @param {string} content - Message content
 * @param {Object} [options] - Options for message sending
 * @param {string} [options.parentMessageId] - Parent message ID for threading
 * @param {Object} [options.metadata] - Additional metadata for the message
 * @returns {Promise<Object>} - Chatbot message result
 */
export const sendChatbotMessage = async (conversationId, content, options = {}) => {
  const { 
    parentMessageId = null, 
    metadata = {}
  } = options;

  try {
    logger.info(`Sending chatbot message in conversation ${conversationId}`);

    // Generate message ID and create message data
    const messageId = generateMessageId();
    const messageData = {
      id: messageId,
      role: 'assistant',
      content: content,
      created_at: new Date().toISOString(),
      ...metadata
    };

    // Insert chatbot message into database (excluding parent_message_id since column doesn't exist)
    const messageToInsert = {
      ...messageData,
      conversation_id: conversationId
    };

    await DbService.create('chat_messages', messageToInsert);
    logger.info(`Chatbot message ${messageId} inserted into conversation ${conversationId}`);

    const chatbotMessage = {
      id: messageId,
      conversationId,
      role: 'assistant',
      content: content,
      created_at: messageData.created_at,
      ...metadata
    };

    // Add parent_message_id only if it exists (for API compatibility)
    if (parentMessageId) {
      chatbotMessage.parent_message_id = parentMessageId;
    }

    logger.info(`Chatbot message sent successfully in conversation ${conversationId}`);

    return {
      chatbotMessage,
      conversationId,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    logger.error('Error sending chatbot message:', error);
    throw error;
  }
};