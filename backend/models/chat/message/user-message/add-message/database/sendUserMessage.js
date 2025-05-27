import logger from '../../../../../../services/logger.js';
import DbService from '../../../../../../services/dbService.js';

/**
 * Insert a chat message into the database
 * @param {string} conversationId - Conversation ID
 * @param {Object} messageData - Message data to insert (should include role, content, etc.)
 * @returns {Promise<Object>} - Inserted message data
 */
export const insertChatMessage = async (conversationId, messageData) => {
  try {
    // Ensure conversation_id is set
    const messageToInsert = {
      ...messageData,
      conversation_id: conversationId
    };

    await DbService.create('chat_messages', messageToInsert);
    // Use messageData.id if available, otherwise log general message
    const messageId = messageData.id ? messageData.id : 'new';
    const messageRole = messageData.role ? messageData.role : 'unknown';
    logger.info(`Message (ID: ${messageId}, Role: ${messageRole}) inserted into conversation ${conversationId}`);
    
    return messageToInsert;
  } catch (error) {
    logger.error(`Error inserting chat message (Role: ${messageData.role || 'unknown'}) into conversation ${conversationId}:`, error);
    throw error;
  }
};

