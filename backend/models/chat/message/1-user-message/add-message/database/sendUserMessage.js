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
    
    // Update the conversation preview ONLY if this is an assistant message
    if (messageData.role === 'assistant') {
      console.log(`[insertChatMessage] Processing assistant message for preview update: ${messageId}`);
      console.log(`[insertChatMessage] Assistant message in conversation: ${conversationId}`);
      
      // Truncate the message content for the preview (if not empty)
      const content = messageData.content || '';
      const previewContent = content.substring(0, 50);
      const preview = content.length > 50 ? previewContent + '...' : content;
      console.log(`[insertChatMessage] Generated preview: "${preview.substring(0, 30)}${preview.length > 30 ? '...' : ''}"`);
      
      try {
        console.log(`[insertChatMessage] Calling DbService.updateWhere for preview update`);
        const updateData = { 
          preview: preview,
          updated_at: new Date().toISOString()
        };
        console.log(`[insertChatMessage] Update data:`, JSON.stringify(updateData));
        
        const result = await DbService.updateWhere('conversations', 
          { id: conversationId }, 
          updateData
        );
        
        console.log(`[insertChatMessage] Preview update result:`, result ? `Success, affected ${Array.isArray(result) ? result.length : 0} rows` : 'No result returned');
        logger.info(`Updated conversation ${conversationId} preview with assistant message content`);
      } catch (previewError) {
        console.error(`[insertChatMessage] FAILED to update conversation preview for ${conversationId}:`, previewError);
        logger.error(`Failed to update conversation preview for ${conversationId}:`, previewError);
        // Continue execution even if preview update fails
      }
    } else {
      console.log(`[insertChatMessage] Skipping preview update for non-assistant message: ${messageRole}`);
    }
    
    return messageToInsert;
  } catch (error) {
    logger.error(`Error inserting chat message (Role: ${messageData.role || 'unknown'}) into conversation ${conversationId}:`, error);
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

