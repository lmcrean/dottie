import { v4 as uuidv4 } from 'uuid';
import DbService from '../../services/dbService.js';

/**
 * Core User model for handling basic user CRUD operations
 */
class User {
  static tableName = 'users';

  /**
   * Create a new user
   * @param {object} userData - User data (username, email, password_hash, age)
   * @returns {Promise<object>} - Created user
   */
  static async create(userData) {
    const newUser = {
      ...userData,
      id: uuidv4(),
    };

    return DbService.create(this.tableName, newUser);
  }

  /**
   * Find a user by ID
   * @param {string} id - User ID
   * @returns {Promise<object|null>} - Found user or null
   */
  static async findById(id) {
    return DbService.findById(this.tableName, id);
  }

  /**
   * Update a user
   * @param {string} id - User ID
   * @param {object} userData - Updated user data
   * @returns {Promise<object>} - Updated user
   */
  static async update(id, userData) {
    return DbService.update(this.tableName, id, userData);
  }

  /**
   * Delete a user and all related data
   * @param {string} id - User ID
   * @returns {Promise<boolean>} - Success flag
   */
  static async delete(id) {
    try {
      // Delete all related data in the correct order to avoid foreign key constraint errors
      
      // 1. Find all conversations for this user
      const conversations = await DbService.findBy('conversations', 'user_id', id);
      
      // 2. Delete all chat messages for each conversation
      for (const conversation of conversations) {
        await DbService.delete('chat_messages', { conversation_id: conversation.id });
      }
      
      // 3. Delete all conversations for this user
      await DbService.delete('conversations', { user_id: id });
      
      // 4. Delete all assessments for this user
      await DbService.delete('assessments', { user_id: id });
      
      // 5. Delete all period logs for this user
      await DbService.delete('period_logs', { user_id: id });
      
      // 6. Delete all symptoms for this user (if table exists)
      try {
        await DbService.delete('symptoms', { user_id: id });
      } catch (error) {
        // Table might not exist, ignore the error
      }
      
      // 7. Finally, delete the user
      return DbService.delete(this.tableName, id);
      
    } catch (error) {
      console.error('Error deleting from users:', error);
      throw error;
    }
  }

  /**
   * Get all users
   * @returns {Promise<Array>} - Array of users
   */
  static async getAll() {
    return DbService.getAll(this.tableName);
  }
}

export default User; 