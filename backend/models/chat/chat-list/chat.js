import DbService from '../../../services/dbService.js';
import logger from '../../../services/logger.js';

/**
 * Chat/Conversation Model
 * Handles the database schema and basic operations for conversations
 */
export class Chat {
  constructor(data) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.assessment_id = data.assessment_id;
    this.assessment_pattern = data.assessment_pattern;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    this.deleted_at = data.deleted_at;
  }

  /**
   * Find conversation by ID
   * @param {string} conversationId 
   * @returns {Promise<Chat|null>}
   */
  static async findById(conversationId) {
    try {
      const conversation = await DbService.getById('conversations', conversationId);
      return conversation ? new Chat(conversation) : null;
    } catch (error) {
      logger.error('Error finding conversation by ID:', error);
      throw error;
    }
  }

  /**
   * Find conversations by user ID
   * @param {string} userId 
   * @returns {Promise<Chat[]>}
   */
  static async findByUserId(userId) {
    try {
      const conversations = await DbService.getWhere('conversations', { user_id: userId });
      return conversations.map(conv => new Chat(conv));
    } catch (error) {
      logger.error('Error finding conversations by user ID:', error);
      throw error;
    }
  }

  /**
   * Create new conversation
   * @param {Object} data - Conversation data
   * @returns {Promise<Chat>}
   */
  static async create(data) {
    try {
      const conversation = await DbService.create('conversations', data);
      return new Chat(conversation);
    } catch (error) {
      logger.error('Error creating conversation:', error);
      throw error;
    }
  }

  /**
   * Update conversation
   * @param {string} conversationId 
   * @param {Object} data 
   * @returns {Promise<Chat>}
   */
  static async update(conversationId, data) {
    try {
      const updated = await DbService.update('conversations', conversationId, {
        ...data,
        updated_at: new Date().toISOString()
      });
      return new Chat(updated);
    } catch (error) {
      logger.error('Error updating conversation:', error);
      throw error;
    }
  }

  /**
   * Delete conversation (soft delete)
   * @param {string} conversationId 
   * @returns {Promise<boolean>}
   */
  static async delete(conversationId) {
    try {
      await DbService.update('conversations', conversationId, {
        deleted_at: new Date().toISOString()
      });
      return true;
    } catch (error) {
      logger.error('Error deleting conversation:', error);
      throw error;
    }
  }

  /**
   * Check if user owns conversation
   * @param {string} conversationId 
   * @param {string} userId 
   * @returns {Promise<boolean>}
   */
  static async isOwner(conversationId, userId) {
    try {
      const conversation = await this.findById(conversationId);
      return conversation && conversation.user_id === userId;
    } catch (error) {
      logger.error('Error checking conversation ownership:', error);
      return false;
    }
  }
}

export default Chat; 