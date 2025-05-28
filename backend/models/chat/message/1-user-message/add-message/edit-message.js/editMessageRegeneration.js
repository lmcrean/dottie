import logger from '../../../../../../services/logger.js';
import { updateChatMessage } from '../database/sendUserMessage.js';
import { generateResponseToMessage } from '../../../2-chatbot-message/generateResponse.js';
import Chat from '../../../../list/chat.js';
import { cleanupChildrenMessages } from './cleanupChildrenMessages.js';

/**
 * Edit an existing message and handle thread updates
 * @param {string} conversationId - Conversation ID
 * @param {string} messageId - Message ID to edit
 * @param {string} userId - User ID
 * @param {string} newContent - New message content
 * @returns {Promise<Object>} - Updated message
 */
export const editMessage = async (conversationId, messageId, userId, newContent) => {
  try {
    // Verify conversation ownership
    const isOwner = await Chat.isOwner(conversationId, userId);
    if (!isOwner) {
      throw new Error('User does not own this conversation');
    }

    // Update the message and handle thread cleanup using consolidated operations
    const updatedMessage = await updateChatMessage(conversationId, messageId, {
      content: newContent,
      edited_at: new Date().toISOString()
    });

    logger.info(`Message ${messageId} edited in conversation ${conversationId}`);
    return updatedMessage;

  } catch (error) {
    logger.error('Error editing message:', error);
    throw error;
  }
};

/**
 * Edit message and regenerate subsequent responses
 * @param {string} conversationId - Conversation ID
 * @param {string} messageId - Message ID to edit
 * @param {string} userId - User ID
 * @param {string} newContent - New message content
 * @param {Object} [options] - Edit options
 * @param {boolean} [options.regenerateResponse=true] - Regenerate AI response
 * @returns {Promise<Object>} - Updated message and new response
 */
export const editMessageWithRegeneration = async (conversationId, messageId, userId, newContent, options = {}) => {
  const { regenerateResponse = true } = options;

  try {
    logger.info(`Starting message edit flow for message ${messageId}`);

    // Step 1: Clean up all messages that came after this one
    const deletedMessageIds = await cleanupChildrenMessages(conversationId, messageId);

    // Step 2: Edit the message
    const updatedMessage = await editMessage(conversationId, messageId, userId, newContent);

    // Step 3: Generate new response to the edited message
    let newResponse = null;
    if (regenerateResponse) {
      newResponse = await generateResponseToMessage(conversationId, userId, messageId, newContent);
    }

    logger.info(`Message edit flow completed for message ${messageId}`);

    return {
      updatedMessage,
      newResponse,
      deletedMessageIds,
      conversationId,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    logger.error('Error in message edit flow:', error);
    throw error;
  }
}; 