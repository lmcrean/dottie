import logger from '';
import DbService from '';

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

/**
 * Mock implementation of insertUserMessage for testing
 */
export async function insertUserMessage(conversationId: string, userId: string, messageText: string) {
  // This is a mock implementation for testing
  return {
    id: 'msg-user-456',
    conversation_id: conversationId,
    role: 'user',
    content: messageText,
    user_id: userId,
    created_at: new Date().toISOString()
  };
}


