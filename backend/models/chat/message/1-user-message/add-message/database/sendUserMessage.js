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
    const messageId = messageData.id ? messageData.id : 'new message';
    logger.info(`[insertChatMessage] Message ${messageId} inserted into conversation ${conversationId}`);
    
    // Only update the conversation preview for assistant messages
    if (messageData.role === 'assistant' && messageData.content) {
      logger.info(`[insertChatMessage] Updating conversation preview for conversation ${conversationId} with assistant message`);
      logger.info(`[insertChatMessage] Preview content: "${messageData.content.substring(0, 50)}..."`);
      
      // Make sure there's no content check that could cause empty strings to be ignored
      const preview = messageData.content.substring(0, 100); // Limit preview to 100 chars
      
      // Update the conversation with the preview
      try {
        const updateResult = await DbService.updateWhere(
          'conversations',
          { id: conversationId },
          { preview, updated_at: new Date() }
        );
        
        logger.info(`[insertChatMessage] Conversation preview update complete, result: ${JSON.stringify(updateResult)}`);
      } catch (previewError) {
        logger.error(`[insertChatMessage] Failed to update conversation preview: ${previewError.message}`);
        // Don't throw here, we still want to return the message even if preview update fails
      }
    } else {
      logger.info(`[insertChatMessage] Skipping preview update for non-assistant message or empty content`);
    }

    return messageToInsert;
  } catch (error) {
    logger.error(`[insertChatMessage] Error inserting message: ${error.message}`);
    throw error;
  }
};

/**
 * Update a message
 * @param {string} conversationId - Conversation ID
 * @param {string} messageId - Message ID to update
 * @param {object} updateData - Data to update
 * @returns {Promise<object>} - Updated message
 */
export const updateChatMessage = async (conversationId, messageId, updateData) => {
  try {
    const updatedMessage = await DbService.update('chat_messages', messageId, updateData);
    return updatedMessage;
  } catch (error) {
    throw new Error(`Failed to update message ${messageId}: ${error.message}`);
  }
};

/**
 * Get a specific message
 * @param {string} conversationId - Conversation ID
 * @param {string} messageId - Message ID
 * @returns {Promise<object>} - Message data
 */
export const getChatMessage = async (conversationId, messageId) => {
  try {
    const message = await DbService.findById('chat_messages', messageId);
    return message;
  } catch (error) {
    throw new Error(`Failed to get message ${messageId}: ${error.message}`);
  }
};

/**
 * Get messages after a specific timestamp
 * @param {string} conversationId - Conversation ID
 * @param {string} timestamp - Timestamp to get messages after
 * @returns {Promise<Array>} - Array of messages
 */
export const getChatMessagesAfterTimestamp = async (conversationId, timestamp) => {
  try {
    // This would need to be implemented in DbService or use raw query
    // For now, using a placeholder that would work with a proper implementation
    const messages = await DbService.findWhere('chat_messages', {
      conversation_id: conversationId,
      created_at: { '>': timestamp }
    });
    return messages;
  } catch (error) {
    throw new Error(`Failed to get messages after timestamp: ${error.message}`);
  }
};

/**
 * Delete a message
 * @param {string} conversationId - Conversation ID
 * @param {string} messageId - Message ID
 * @returns {Promise<boolean>} - Success status
 */
export const deleteChatMessage = async (conversationId, messageId) => {
  try {
    await DbService.delete('chat_messages', messageId);
    return true;
  } catch (error) {
    throw new Error(`Failed to delete message ${messageId}: ${error.message}`);
  }
};

