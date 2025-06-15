import DbService from '../../../services/dbService.js';
import logger from '../../../services/logger.js';

/**
 * Chat utility class for conversation operations
 */
class Chat {
  /**
   * Check if a user owns a specific conversation
   * @param {string} conversationId - Conversation ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - True if user owns the conversation
   */
  static async isOwner(conversationId, userId) {
    try {
      if (!conversationId || !userId) {
        return false;
      }

      const conversations = await DbService.findBy('conversations', 'id', conversationId);
      
      if (!conversations || conversations.length === 0) {
        logger.warn(`Conversation ${conversationId} not found`);
        return false;
      }

      const conversation = conversations[0];
      const isOwner = conversation.user_id === userId;
      
      if (!isOwner) {
        logger.warn(`User ${userId} does not own conversation ${conversationId}`);
      }
      
      return isOwner;
      
    } catch (error) {
      logger.error('Error checking conversation ownership:', error);
      return false;
    }
  }
}

export default Chat; 