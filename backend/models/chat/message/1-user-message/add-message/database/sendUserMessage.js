import logger from '../../../../../../services/logger.js';
import DbService from '../../../../../../services/dbService.js';
import { updateConversationPreview } from '../../../../conversation/read-conversation/getPreviewHook.js';

/**
 * Insert a chat message into the database
 * @param {string} conversationId - Conversation ID
 * @param {Object} messageData - Message data to insert (should include role, content, etc.)
 * @returns {Promise<Object>} - Inserted message data
 */
export const insertChatMessage = async (conversationId, messageData) => {
  try {
    // Log function entry
    console.log(`[insertChatMessage] Called with:`, {
      conversationId,
      conversationIdType: typeof conversationId,
      messageRole: messageData.role,
      messageLength: messageData.content.length
    });

    // Ensure conversationId is a string
    const conversationIdString = String(conversationId);
    
    // Log after type conversion
    console.log(`[insertChatMessage] Converted ID: ${conversationIdString}, type: ${typeof conversationIdString}`);
    
    // Ensure conversation_id is set
    const messageToInsert = {
      ...messageData,
      conversation_id: conversationIdString
    };

    // Log before database insert
    console.log(`[insertChatMessage] Prepared data:`, {
      conversation_id: messageToInsert.conversation_id,
      conversation_id_type: typeof messageToInsert.conversation_id,
      role: messageToInsert.role
    });

    await DbService.create('chat_messages', messageToInsert);
    
    // Log after database insert
    console.log(`[insertChatMessage] Message inserted successfully for conversation ${conversationIdString}`);
    
    // Use messageData.id if available, otherwise log general message
    const messageId = messageData.id ? messageData.id : 'new message';
    console.log(`[insertChatMessage] Message ${messageId} inserted into conversation ${conversationIdString}`);
    console.log(`[insertChatMessage] Message role: ${messageData.role}`);
    
    // Only update the conversation preview for assistant messages
    if (messageData.role === 'assistant') {
      try {
        console.log(`[insertChatMessage] Found assistant message, updating conversation preview...`);
        
        // Use our dedicated hook for updating previews
        await updateConversationPreview(DbService, conversationIdString, messageData.content);
        
        console.log(`[insertChatMessage] Preview updated using getPreviewHook`);
      } catch (previewError) {
        console.error(`[insertChatMessage] Error updating preview:`, previewError);
        // Continue execution even if preview update fails
      }
    } else {
      console.log(`[insertChatMessage] Not an assistant message, skipping preview update`);
    }

    return messageToInsert;
  } catch (error) {
    console.error(`[insertChatMessage] Error:`, error);
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
    // Ensure conversationId is a string
    const conversationIdString = String(conversationId);
    
    // This would need to be implemented in DbService or use raw query
    // For now, using a placeholder that would work with a proper implementation
    const messages = await DbService.findWhere('chat_messages', {
      conversation_id: conversationIdString,
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

