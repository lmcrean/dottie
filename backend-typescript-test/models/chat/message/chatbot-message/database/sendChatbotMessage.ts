import logger from '';
import DbService from '';
import { generateMessageId } from '';

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
      parent_message_id: parentMessageId,
      created_at: new Date().toISOString(),
      ...metadata
    };

    // Insert chatbot message into database
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
      parent_message_id: parentMessageId,
      created_at: messageData.created_at,
      ...metadata
    };

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
