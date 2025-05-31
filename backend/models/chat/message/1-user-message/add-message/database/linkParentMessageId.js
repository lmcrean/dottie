import logger from '../../../../../../services/logger.js';
import DbService from '../../../../../../services/dbService.js';

/**
 * Get the most recent message in a conversation
 * @param {string} conversationId - The conversation ID
 * @returns {Promise<Object|null>} - The most recent message or null if none exists
 */
export const getMostRecentMessage = async (conversationId) => {
  try {
    const messages = await DbService.findWhere(
      'chat_messages',
      { conversation_id: conversationId },
      { orderBy: 'created_at', order: 'desc', limit: 1 }
    );
    
    return messages.length > 0 ? messages[0] : null;
  } catch (error) {
    logger.error(`Error getting most recent message in conversation ${conversationId}:`, error);
    throw error;
  }
};

/**
 * Verify parent message ID is properly set for a message
 * @param {string} conversationId - The conversation ID
 * @param {Object} messageData - Message data to validate
 * @returns {Promise<Object>} - Message data with proper parent_message_id
 */
export const verifyParentMessageId = async (conversationId, messageData) => {
  try {
    // Skip for first message in conversation
    const mostRecentMessage = await getMostRecentMessage(conversationId);
    
    // If no messages exist in the conversation, this is the first message
    if (!mostRecentMessage) {
      logger.info(`First message in conversation ${conversationId}, no parent_message_id needed`);
      return { ...messageData, parent_message_id: null };
    }
    
    // If parent_message_id is already set, verify it exists
    if (messageData.parent_message_id) {
      const parentExists = await DbService.exists('chat_messages', messageData.parent_message_id);
      
      if (!parentExists) {
        logger.warn(`Specified parent message ${messageData.parent_message_id} not found, using most recent message instead`);
        return { ...messageData, parent_message_id: mostRecentMessage.id };
      }
      
      return messageData;
    }
    
    // If not set but not first message, use most recent message as parent
    logger.info(`Setting parent_message_id to most recent message: ${mostRecentMessage.id}`);
    return { ...messageData, parent_message_id: mostRecentMessage.id };
  } catch (error) {
    logger.error(`Error verifying parent_message_id for message in conversation ${conversationId}:`, error);
    throw error;
  }
};

/**
 * Update message with proper parent_message_id
 * @param {string} conversationId - The conversation ID
 * @param {string} messageId - The message ID to update
 * @returns {Promise<Object>} - Updated message data
 */
export const updateMessageWithParentId = async (conversationId, messageId) => {
  try {
    // Get current message
    const message = await DbService.findById('chat_messages', messageId);
    if (!message) {
      throw new Error(`Message ${messageId} not found`);
    }
    
    // Skip if already has parent_message_id
    if (message.parent_message_id) {
      return message;
    }
    
    // Get messages before this one
    const earlierMessages = await DbService.findWhere(
      'chat_messages',
      { 
        conversation_id: conversationId,
        created_at: { '<': message.created_at }
      },
      { orderBy: 'created_at', order: 'desc', limit: 1 }
    );
    
    // If no earlier messages, this is the first message
    if (earlierMessages.length === 0) {
      return message;
    }
    
    // Update with parent ID
    const parentId = earlierMessages[0].id;
    const updatedMessage = await DbService.update('chat_messages', messageId, {
      parent_message_id: parentId
    });
    
    logger.info(`Updated message ${messageId} with parent_message_id: ${parentId}`);
    return updatedMessage;
  } catch (error) {
    logger.error(`Error updating message ${messageId} with parent_message_id:`, error);
    throw error;
  }
};
