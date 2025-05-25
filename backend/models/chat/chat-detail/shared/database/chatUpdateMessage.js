import logger from '../../../../../services/logger.js';
import DbService from '../../../../../services/dbService.js';

/**
 * Update a chat message and handle thread cleanup
 * @param {string} conversationId - Conversation ID
 * @param {string} messageId - Message ID to update
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - Updated message
 */
export const updateChatMessage = async (conversationId, messageId, updateData) => {
  try {
    // Validate required fields
    if (!conversationId || !messageId) {
      throw new Error('Conversation ID and Message ID are required');
    }

    // Check if message exists and belongs to conversation
    const existingMessage = await DbService.query(`
      SELECT * FROM chat_messages 
      WHERE id = ? AND conversation_id = ?
    `, [messageId, conversationId]);

    if (!existingMessage || existingMessage.length === 0) {
      throw new Error('Message not found in conversation');
    }

    const message = existingMessage[0];

    // If this is an older message being edited, delete all subsequent messages
    // to maintain conversation consistency
    if (updateData.content && message.content !== updateData.content) {
      await deleteSubsequentMessages(conversationId, messageId, message.created_at);
    }

    // Prepare update data
    const updateFields = {
      ...updateData,
      edited_at: new Date().toISOString()
    };

    // Handle metadata serialization
    if (updateFields.metadata && typeof updateFields.metadata === 'object') {
      updateFields.metadata = JSON.stringify(updateFields.metadata);
    }

    // Update the message
    const updatedMessage = await DbService.update('chat_messages', messageId, updateFields);

    logger.info(`Chat message ${messageId} updated in conversation ${conversationId}`);

    return {
      id: updatedMessage.id,
      conversation_id: updatedMessage.conversation_id,
      role: updatedMessage.role,
      content: updatedMessage.content,
      user_id: updatedMessage.user_id,
      parent_message_id: updatedMessage.parent_message_id,
      created_at: updatedMessage.created_at,
      edited_at: updatedMessage.edited_at,
      metadata: updatedMessage.metadata ? JSON.parse(updatedMessage.metadata) : null
    };

  } catch (error) {
    logger.error('Error updating chat message:', error);
    throw error;
  }
};

/**
 * Delete all messages that come after a specific message in the conversation thread
 * @param {string} conversationId - Conversation ID
 * @param {string} messageId - Reference message ID
 * @param {string} messageTimestamp - Reference message timestamp
 * @returns {Promise<number>} - Number of deleted messages
 */
export const deleteSubsequentMessages = async (conversationId, messageId, messageTimestamp) => {
  try {
    // Find all messages after this timestamp in the conversation
    const subsequentMessages = await DbService.query(`
      SELECT id FROM chat_messages 
      WHERE conversation_id = ? 
      AND created_at > ? 
      AND id != ?
      ORDER BY created_at ASC
    `, [conversationId, messageTimestamp, messageId]);

    if (subsequentMessages.length === 0) {
      return 0;
    }

    // Delete subsequent messages
    const messageIds = subsequentMessages.map(msg => msg.id);
    await DbService.query(`
      DELETE FROM chat_messages 
      WHERE id IN (${messageIds.map(() => '?').join(',')})
    `, messageIds);

    logger.info(`Deleted ${subsequentMessages.length} subsequent messages after editing message ${messageId}`);
    return subsequentMessages.length;

  } catch (error) {
    logger.error('Error deleting subsequent messages:', error);
    throw error;
  }
};

/**
 * Update message content and trigger new response
 * @param {string} conversationId - Conversation ID
 * @param {string} messageId - Message ID to update
 * @param {string} newContent - New message content
 * @param {Object} [options] - Update options
 * @returns {Promise<Object>} - Update result with new response trigger
 */
export const updateMessageAndTriggerResponse = async (conversationId, messageId, newContent, options = {}) => {
  const { shouldGenerateResponse = true, userId = null } = options;

  try {
    // Update the message
    const updatedMessage = await updateChatMessage(conversationId, messageId, {
      content: newContent
    });

    const result = {
      updatedMessage,
      subsequentMessagesDeleted: true,
      shouldGenerateResponse
    };

    // If this is a user message and we should generate a response, mark it for response generation
    if (shouldGenerateResponse && updatedMessage.role === 'user') {
      result.triggerNewResponse = true;
      result.responseFor = {
        messageId: updatedMessage.id,
        content: newContent,
        userId: userId || updatedMessage.user_id
      };
    }

    return result;

  } catch (error) {
    logger.error('Error updating message and triggering response:', error);
    throw error;
  }
};

/**
 * Soft delete a message (mark as deleted but keep in database)
 * @param {string} conversationId - Conversation ID
 * @param {string} messageId - Message ID to soft delete
 * @returns {Promise<Object>} - Soft deleted message
 */
export const softDeleteMessage = async (conversationId, messageId) => {
  try {
    const updateData = {
      deleted_at: new Date().toISOString(),
      content: '[This message was deleted]'
    };

    return await updateChatMessage(conversationId, messageId, updateData);

  } catch (error) {
    logger.error('Error soft deleting message:', error);
    throw error;
  }
};

/**
 * Update message metadata only
 * @param {string} conversationId - Conversation ID
 * @param {string} messageId - Message ID
 * @param {Object} metadata - New metadata
 * @returns {Promise<Object>} - Updated message
 */
export const updateMessageMetadata = async (conversationId, messageId, metadata) => {
  try {
    return await updateChatMessage(conversationId, messageId, { metadata });
  } catch (error) {
    logger.error('Error updating message metadata:', error);
    throw error;
  }
};

/**
 * Mark message as edited without changing content
 * @param {string} conversationId - Conversation ID
 * @param {string} messageId - Message ID
 * @returns {Promise<Object>} - Updated message
 */
export const markMessageAsEdited = async (conversationId, messageId) => {
  try {
    return await updateChatMessage(conversationId, messageId, {
      edited_at: new Date().toISOString()
    });
  } catch (error) {
    logger.error('Error marking message as edited:', error);
    throw error;
  }
}; 