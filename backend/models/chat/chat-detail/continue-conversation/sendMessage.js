import logger from '../../../../services/logger.js';
import { insertChatMessage } from '../shared/database/chatCreateMessage.js';
import { updateChatMessage } from '../shared/database/chatUpdateMessage.js';
import { formatUserMessage } from '../shared/utils/messageFormatters.js';
import { generateMessageId } from '../shared/utils/responseBuilders.js';
import Chat from '../../chat-list/chat.js';

/**
 * Send a follow-up message in an existing conversation
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @param {string} messageText - Message content
 * @param {string} [parentMessageId] - Parent message ID for threading
 * @returns {Promise<Object>} - Created message
 */
export const sendFollowUpMessage = async (conversationId, userId, messageText, parentMessageId = null) => {
  try {
    // Verify conversation ownership
    const isOwner = await Chat.isOwner(conversationId, userId);
    if (!isOwner) {
      throw new Error('User does not own this conversation');
    }

    // Generate message ID and format message
    const messageId = generateMessageId();
    const formattedMessage = formatUserMessage(messageText, userId);
    
    // Create message data
    const messageData = {
      id: messageId,
      role: 'user',
      content: messageText,
      user_id: userId,
      parent_message_id: parentMessageId,
      created_at: new Date().toISOString()
    };

    // Insert message into database
    await insertChatMessage(conversationId, messageData);

    // Update conversation timestamp
    await Chat.update(conversationId, {
      updated_at: new Date().toISOString()
    });

    logger.info(`Follow-up message sent in conversation ${conversationId}`);
    
    return {
      id: messageId,
      conversationId,
      role: 'user',
      content: messageText,
      user_id: userId,
      parent_message_id: parentMessageId,
      created_at: messageData.created_at
    };

  } catch (error) {
    logger.error('Error sending follow-up message:', error);
    throw error;
  }
};

/**
 * Edit an existing message and handle thread updates
 * @param {string} conversationId - Conversation ID
 * @param {string} messageId - Message ID to edit
 * @param {string} userId - User ID
 * @param {string} newContent - New message content
 * @returns {Promise<Object>} - Updated message
 */
export const editMessage = async (conversationId, messageId, userId, newContent) => {
  try {
    // Verify conversation ownership
    const isOwner = await Chat.isOwner(conversationId, userId);
    if (!isOwner) {
      throw new Error('User does not own this conversation');
    }

    // Update the message and handle thread cleanup
    const updatedMessage = await updateChatMessage(conversationId, messageId, {
      content: newContent,
      edited_at: new Date().toISOString()
    });

    // Update conversation timestamp
    await Chat.update(conversationId, {
      updated_at: new Date().toISOString()
    });

    logger.info(`Message ${messageId} edited in conversation ${conversationId}`);
    return updatedMessage;

  } catch (error) {
    logger.error('Error editing message:', error);
    throw error;
  }
};

/**
 * Send a quick reply message
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @param {string} quickReply - Quick reply text
 * @returns {Promise<Object>} - Created message
 */
export const sendQuickReply = async (conversationId, userId, quickReply) => {
  return await sendFollowUpMessage(conversationId, userId, quickReply);
};

/**
 * Continue conversation with context from previous messages
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @param {string} messageText - Message content
 * @param {Object} [context] - Additional context
 * @returns {Promise<Object>} - Created message with context
 */
export const continueWithContext = async (conversationId, userId, messageText, context = {}) => {
  try {
    const message = await sendFollowUpMessage(conversationId, userId, messageText);
    
    return {
      ...message,
      context
    };
  } catch (error) {
    logger.error('Error continuing conversation with context:', error);
    throw error;
  }
}; 