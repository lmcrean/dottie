import logger from '../../../../../services/logger.js';
import DbService from '../../../../../services/dbService.js';

/**
 * Insert a new chat message into the database
 * @param {string} conversationId - Conversation ID
 * @param {Object} messageData - Message data to insert
 * @returns {Promise<Object>} - Inserted message
 */
export const insertChatMessage = async (conversationId, messageData) => {
  try {
    // Validate required fields
    if (!conversationId) {
      throw new Error('Conversation ID is required');
    }
    
    if (!messageData.content || !messageData.role) {
      throw new Error('Message content and role are required');
    }

    // Prepare message data for insertion
    const messageToInsert = {
      id: messageData.id,
      conversation_id: conversationId,
      role: messageData.role,
      content: messageData.content,
      user_id: messageData.user_id || null,
      parent_message_id: messageData.parent_message_id || null,
      created_at: messageData.created_at || new Date().toISOString(),
      edited_at: messageData.edited_at || null,
      metadata: messageData.metadata ? JSON.stringify(messageData.metadata) : null
    };

    // Insert message into database
    const insertedMessage = await DbService.create('chat_messages', messageToInsert);

    logger.info(`Chat message ${insertedMessage.id} inserted for conversation ${conversationId}`);
    
    return {
      id: insertedMessage.id,
      conversation_id: insertedMessage.conversation_id,
      role: insertedMessage.role,
      content: insertedMessage.content,
      user_id: insertedMessage.user_id,
      parent_message_id: insertedMessage.parent_message_id,
      created_at: insertedMessage.created_at,
      edited_at: insertedMessage.edited_at,
      metadata: insertedMessage.metadata ? JSON.parse(insertedMessage.metadata) : null
    };

  } catch (error) {
    logger.error('Error inserting chat message:', error);
    throw error;
  }
};

/**
 * Insert multiple chat messages in a batch
 * @param {string} conversationId - Conversation ID
 * @param {Array<Object>} messagesData - Array of message data objects
 * @returns {Promise<Array>} - Array of inserted messages
 */
export const insertChatMessageBatch = async (conversationId, messagesData) => {
  try {
    const insertedMessages = [];

    for (const messageData of messagesData) {
      const insertedMessage = await insertChatMessage(conversationId, messageData);
      insertedMessages.push(insertedMessage);
    }

    logger.info(`Batch inserted ${insertedMessages.length} messages for conversation ${conversationId}`);
    return insertedMessages;

  } catch (error) {
    logger.error('Error batch inserting chat messages:', error);
    throw error;
  }
};

/**
 * Insert a user message
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @param {string} content - Message content
 * @param {Object} [options] - Additional options
 * @returns {Promise<Object>} - Inserted user message
 */
export const insertUserMessage = async (conversationId, userId, content, options = {}) => {
  const { parentMessageId = null, metadata = {} } = options;

  const messageData = {
    id: options.id,
    role: 'user',
    content,
    user_id: userId,
    parent_message_id: parentMessageId,
    metadata
  };

  return await insertChatMessage(conversationId, messageData);
};

/**
 * Insert an assistant message
 * @param {string} conversationId - Conversation ID
 * @param {string} content - Message content
 * @param {Object} [options] - Additional options
 * @returns {Promise<Object>} - Inserted assistant message
 */
export const insertAssistantMessage = async (conversationId, content, options = {}) => {
  const { parentMessageId = null, metadata = {} } = options;

  const messageData = {
    id: options.id,
    role: 'assistant',
    content,
    parent_message_id: parentMessageId,
    metadata
  };

  return await insertChatMessage(conversationId, messageData);
}; 