import logger from '../../../../../services/logger.js';
import DbService from '../../../../../services/dbService.js';
import { generateMessageId } from '../../shared/utils/responseBuilders.js';
import { verifyParentMessageId } from '../../1-user-message/add-message/database/linkParentMessageId.js';
import { updateConversationPreview } from '../../../conversation/read-conversation/getPreviewHook.js';

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
    let messageData = {
      id: messageId,
      role: 'assistant',
      content: content,
      parent_message_id: parentMessageId,
      created_at: new Date().toISOString(),
      ...metadata
    };

    // Verify parent_message_id is properly set
    // This ensures that assistant messages have valid parent_message_id
    messageData = await verifyParentMessageId(conversationId, messageData);

    // Insert chatbot message into database
    const messageToInsert = {
      ...messageData,
      conversation_id: conversationId
    };

    await DbService.create('chat_messages', messageToInsert);
    logger.info(`Chatbot message ${messageId} inserted into conversation ${conversationId}`);

    // Update conversation preview with this assistant message
    await updateConversationPreview(DbService, conversationId, content);
    logger.info(`Conversation preview updated for ${conversationId}`);

    const chatbotMessage = {
      id: messageId,
      conversationId,
      role: 'assistant',
      content: content,
      parent_message_id: messageData.parent_message_id,
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