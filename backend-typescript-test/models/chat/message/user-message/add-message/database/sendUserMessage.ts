import logger from '../../../../../../services/logger.ts';
import DbService from '../../../../../../services/dbService.ts';

/**
 * Insert a user message into the database
 * @param {string} conversationId - Conversation ID
 * @param {Object} messageData - Message data to insert
 * @returns {Promise<Object>} - Inserted message data
 */
export const insertUserMessage = async (conversationId, messageData) => {
  try {
    // Ensure conversation_id is set
    const messageToInsert = {
      ...messageData,
      conversation_id: conversationId
    };

    await DbService.create('chat_messages', messageToInsert);
    logger.info(`User message ${messageData.id} inserted into conversation ${conversationId}`);
    
    return messageToInsert;
  } catch (error) {
    logger.error('Error inserting user message:', error);
    throw error;
  }
};


