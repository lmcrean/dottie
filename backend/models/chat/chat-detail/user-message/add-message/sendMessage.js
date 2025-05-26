import logger from '../../../../../services/logger.js';
import { ChatDatabaseOperations } from '../../shared/database/chatOperations.js';
import { formatUserMessage } from '../validation/messageFormatters.js';
import { generateMessageId } from '../../shared/utils/responseBuilders.js';
import { ResponseCoordinator } from '../../chatbot-message/ResponseCoordinator.js';
import Chat from '../../../read-chat-list/chat.js';

/**
 * Send a message in a conversation with flexible options
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @param {string|Array<string>} messageText - Message content or array for batch
 * @param {Object} [options] - Options for message sending
 * @param {boolean} [options.autoResponse=true] - Auto-generate AI response
 * @param {string} [options.parentMessageId] - Parent message ID for threading
 * @param {Object} [options.context] - Additional context for the message
 * @param {number} [options.batchDelay=0] - Delay between batch messages (ms)
 * @returns {Promise<Object>} - Message result(s)
 */
export const sendMessage = async (conversationId, userId, messageText, options = {}) => {
  const { 
    autoResponse = true, 
    parentMessageId = null, 
    context = {},
    batchDelay = 0 
  } = options;

  try {
    // Handle batch processing if array is provided
    if (Array.isArray(messageText)) {
      return await sendMessageBatch(conversationId, userId, messageText, options);
    }

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

    // Insert user message into database using consolidated operations
    await ChatDatabaseOperations.insertMessage(conversationId, messageData);

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
      assistantMessage = await ResponseCoordinator.generateResponseToMessage(conversationId, messageId, messageText);
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

/**
 * Send multiple messages in batch
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @param {Array<string>} messages - Array of message texts
 * @param {Object} [options] - Batch options
 * @returns {Promise<Array>} - Array of sent messages
 */
const sendMessageBatch = async (conversationId, userId, messages, options = {}) => {
  const { autoResponse = true, batchDelay = 0 } = options;
  const results = [];

  try {
    for (let i = 0; i < messages.length; i++) {
      const messageText = messages[i];
      const result = await sendMessage(conversationId, userId, messageText, {
        ...options,
        autoResponse
      });
      results.push(result);
      
      // Add delay between messages if specified
      if (batchDelay > 0 && i < messages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, batchDelay));
      }
    }

    logger.info(`Batch sent ${messages.length} messages to conversation ${conversationId}`);
    return results;

  } catch (error) {
    logger.error('Error in batch message sending:', error);
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

    // Update the message and handle thread cleanup using consolidated operations
    const updatedMessage = await ChatDatabaseOperations.updateMessage(conversationId, messageId, {
      content: newContent,
      edited_at: new Date().toISOString()
    });

    logger.info(`Message ${messageId} edited in conversation ${conversationId}`);
    return updatedMessage;

  } catch (error) {
    logger.error('Error editing message:', error);
    throw error;
  }
};

/**
 * Edit message and regenerate subsequent responses (replaces editMessageWithRegeneration.js)
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
      newResponse = await ResponseCoordinator.generateResponseToMessage(conversationId, messageId, newContent);
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

/**
 * Continue conversation with contextual awareness (replaces continueConversationWithContext.js)
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

// Convenience functions for common use cases
export const sendMessageOnly = (conversationId, userId, messageText, options = {}) => {
  return sendMessage(conversationId, userId, messageText, { ...options, autoResponse: false });
};

export const sendQuickReply = (conversationId, userId, quickReply, options = {}) => {
  return sendMessage(conversationId, userId, quickReply, options);
};

export const continueWithContext = (conversationId, userId, messageText, context = {}) => {
  return sendMessage(conversationId, userId, messageText, { context });
}; 