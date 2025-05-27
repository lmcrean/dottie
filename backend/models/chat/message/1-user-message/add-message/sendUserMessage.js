import logger from '../../../../../services/logger.js';
import { insertChatMessage } from './database/sendUserMessage.js';
import { formatUserMessage } from './validation/formatters/formatUserMessage.js';
import { generateMessageId } from '../../shared/utils/responseBuilders.js';
import Chat from '../../../list/chat.js';

/**
 * Add a user message to a conversation
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @param {string} messageText - Message content
 * @param {Object} [options] - Options for message sending
 * @param {string} [options.parentMessageId] - Parent message ID for threading
 * @param {Object} [options.context] - Additional context for the message
 * @returns {Promise<Object>} - User message result
 */
export const addUserMessage = async (conversationId, userId, messageText, options = {}) => {
  const { 
    parentMessageId = null, 
    context = {}
  } = options;

  try {
    logger.info(`Adding user message to conversation ${conversationId}`);

    // Verify conversation ownership
    const isOwner = await Chat.isOwner(conversationId, userId);
    if (!isOwner) {
      throw new Error('User does not own this conversation');
    }

    // Generate message ID and create message data
    const messageId = generateMessageId();
    const messageData = {
      id: messageId,
      role: 'user',
      content: messageText,
      parent_message_id: parentMessageId,
      created_at: new Date().toISOString()
    };

    // Insert user message into database
    await insertChatMessage(conversationId, messageData);

    const userMessage = {
      id: messageId,
      conversationId,
      role: 'user',
      content: messageText,
      parent_message_id: parentMessageId,
      created_at: messageData.created_at,
      ...context
    };

    logger.info(`User message added successfully to conversation ${conversationId}`);

    return {
      userMessage,
      conversationId,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    logger.error('Error adding user message:', error);
    throw error;
  }
};

// Keep legacy function name for backward compatibility
export const sendMessage = addUserMessage;