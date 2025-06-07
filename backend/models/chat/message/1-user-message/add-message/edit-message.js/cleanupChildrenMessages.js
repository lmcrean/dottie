import logger from '../../../../../../services/logger.js';
import { getChatMessage, getChatMessagesAfterTimestamp, deleteChatMessage } from '../database/sendUserMessage.js';

/**
 * Clean up all messages that came after the edited message
 * This ensures conversation consistency when editing messages
 * @param {string} conversationId - Conversation ID
 * @param {string} messageId - The message ID that was edited
 * @returns {Promise<Array>} - Array of deleted message IDs
 */
export const cleanupChildrenMessages = async (conversationId, messageId) => {
  try {
    logger.info(`Starting cleanup of children messages after ${messageId} in conversation ${conversationId}`);

    // Get the timestamp of the edited message
    const editedMessage = await getChatMessage(conversationId, messageId);
    if (!editedMessage) {
      throw new Error('Edited message not found');
    }

    // Find all messages that came after the edited message
    const subsequentMessages = await getChatMessagesAfterTimestamp(
      conversationId, 
      editedMessage.created_at
    );

    const deletedMessageIds = [];

    // Delete each subsequent message
    for (const message of subsequentMessages) {
      // Skip the edited message itself
      if (message.id !== messageId) {
        await deleteChatMessage(conversationId, message.id);
        deletedMessageIds.push(message.id);
        logger.info(`Deleted message ${message.id} from conversation ${conversationId}`);
      }
    }

    logger.info(`Cleanup completed: removed ${deletedMessageIds.length} messages after ${messageId}`);
    return deletedMessageIds;

  } catch (error) {
    logger.error('Error cleaning up children messages:', error);
    throw error;
  }
};
