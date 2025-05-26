import logger from '../../../../../services/logger.js';
import { insertUserMessage } from './database/sendUserMessage.js';
import { formatUserMessage } from './validation/formatters/formatUserMessage.js';
import { generateMessageId } from '../../shared/utils/responseBuilders.js';
import { generateResponseToMessage } from '../../chatbot-message/generateResponse.js';
import Chat from '../../../list/chat.js';

/**
 * Send a message in a conversation
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @param {string} messageText - Message content
 * @param {Object} [options] - Options for message sending
 * @param {boolean} [options.autoResponse=true] - Auto-generate AI response
 * @param {string} [options.parentMessageId] - Parent message ID for threading
 * @param {Object} [options.context] - Additional context for the message
 * @returns {Promise<Object>} - Message result
 */
export const sendMessage = async (conversationId, userId, messageText, options = {}) => {
  const { 
    autoResponse = true, 
    parentMessageId = null, 
    context = {}
  } = options;

  try {
    logger.info(`Sending message in conversation ${conversationId}`);

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
      user_id: userId,
      parent_message_id: parentMessageId,
      created_at: new Date().toISOString()
    };

    // Insert user message into database
    await insertUserMessage(conversationId, messageData);

    const userMessage = {
      id: messageId,
      conversationId,
      role: 'user',
      content: messageText,
      user_id: userId,
      parent_message_id: parentMessageId,
      created_at: messageData.created_at,
      ...context
    };

    // Generate AI response if enabled
    let assistantMessage = null;
    if (autoResponse) {
              assistantMessage = await generateResponseToMessage(conversationId, messageId, messageText);
    }

    logger.info(`Message sent successfully in conversation ${conversationId}`);

    return {
      userMessage,
      assistantMessage,
      conversationId,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    logger.error('Error sending message:', error);
    throw error;
  }
};