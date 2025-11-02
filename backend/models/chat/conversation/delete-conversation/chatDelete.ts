import DbService from '../../../../services/dbService.js';
import logger from '../../../../services/logger.js';

/**
 * Delete a conversation and all its messages
 * @param conversationId - Conversation ID
 * @param userId - User ID to verify ownership
 * @returns Success indicator
 */
export const deleteConversation = async (
  conversationId: number | string,
  userId: number | string
): Promise<boolean> => {
  try {
    // First check if the conversation exists and belongs to the user
    const conversations = await DbService.findBy(
      'conversations',
      'id',
      conversationId
    ) as any[];

    // Check if conversation exists and belongs to user
    if (!conversations || conversations.length === 0) {
      logger.warn(`Conversation ${conversationId} not found`);
      return false;
    }

    const conversation = conversations[0];
    if (conversation.user_id !== userId) {
      logger.warn(`User ${userId} not authorized to delete conversation ${conversationId}`);
      return false;
    }

    // Delete all messages first (due to foreign key constraint)
    const messagesDeleted = await DbService.delete('chat_messages', {
      conversation_id: conversationId
    });
    logger.info(`Deleted ${messagesDeleted} messages from conversation ${conversationId}`);

    // Delete the conversation
    const conversationDeleted = await DbService.delete('conversations', {
      id: conversationId,
      user_id: userId  // Extra safety: ensure user owns the conversation
    });

    if (!conversationDeleted) {
      logger.error(`Failed to delete conversation ${conversationId}`);
      return false;
    }

    logger.info(`Successfully deleted conversation ${conversationId}`);
    return true;

  } catch (error) {
    logger.error('Error deleting conversation:', error);
    throw error;
  }
};
