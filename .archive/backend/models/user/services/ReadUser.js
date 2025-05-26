import DbService from '../../../services/db-service/dbService.js';
import UserBase from '../base/UserBase.js';
import SanitizeUserData from '../transformers/SanitizeUserData.js';

/**
 * User reading service
 */
class ReadUser {
  /**
   * Find a user by ID
   * @param {string} id - User ID
   * @param {boolean} sanitize - Whether to sanitize the result (default: true)
   * @returns {Promise<object|null>} - Found user or null
   */
  static async findById(id, sanitize = true) {
    try {
      if (!id || typeof id !== 'string') {
        return null;
      }

      const user = await DbService.findById(UserBase.getTableName(), id);
      
      if (!user) {
        return null;
      }

      return sanitize ? SanitizeUserData.sanitizeUser(user) : user;

    } catch (error) {
      console.error('Error finding user by ID:', error);
      return null;
    }
  }

  /**
   * Find a user by email
   * @param {string} email - User email
   * @param {boolean} sanitize - Whether to sanitize the result (default: true)
   * @returns {Promise<object|null>} - Found user or null
   */
  static async findByEmail(email, sanitize = true) {
    try {
      if (!email || typeof email !== 'string') {
        return null;
      }

      const users = await DbService.findBy(UserBase.getTableName(), 'email', email.trim().toLowerCase());
      const user = users.length > 0 ? users[0] : null;

      if (!user) {
        return null;
      }

      return sanitize ? SanitizeUserData.sanitizeUser(user) : user;

    } catch (error) {
      console.error('Error finding user by email:', error);
      return null;
    }
  }

  /**
   * Find a user by username
   * @param {string} username - Username
   * @param {boolean} sanitize - Whether to sanitize the result (default: true)
   * @returns {Promise<object|null>} - Found user or null
   */
  static async findByUsername(username, sanitize = true) {
    try {
      if (!username || typeof username !== 'string') {
        return null;
      }

      const users = await DbService.findBy(UserBase.getTableName(), 'username', username.trim());
      const user = users.length > 0 ? users[0] : null;

      if (!user) {
        return null;
      }

      return sanitize ? SanitizeUserData.sanitizeUser(user) : user;

    } catch (error) {
      console.error('Error finding user by username:', error);
      return null;
    }
  }

  /**
   * Get all users
   * @param {boolean} sanitize - Whether to sanitize the results (default: true)
   * @returns {Promise<Array>} - Array of users
   */
  static async getAll(sanitize = true) {
    try {
      const users = await DbService.getAll(UserBase.getTableName());
      
      return sanitize ? SanitizeUserData.sanitizeUsers(users) : users;

    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  /**
   * Check if a user exists by ID
   * @param {string} id - User ID
   * @returns {Promise<boolean>} - True if user exists, false otherwise
   */
  static async exists(id) {
    try {
      const user = await this.findById(id, false);
      return user !== null;
    } catch (error) {
      console.error('Error checking if user exists:', error);
      return false;
    }
  }

  /**
   * Check if an email exists
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} - True if email exists, false otherwise
   */
  static async emailExists(email) {
    try {
      const user = await this.findByEmail(email, false);
      return user !== null;
    } catch (error) {
      console.error('Error checking if email exists:', error);
      return false;
    }
  }

  /**
   * Check if a username exists
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} - True if username exists, false otherwise
   */
  static async usernameExists(username) {
    try {
      const user = await this.findByUsername(username, false);
      return user !== null;
    } catch (error) {
      console.error('Error checking if username exists:', error);
      return false;
    }
  }

  /**
   * Get user count
   * @returns {Promise<number>} - Total number of users
   */
  static async getCount() {
    try {
      const users = await this.getAll(false);
      return users.length;
    } catch (error) {
      console.error('Error getting user count:', error);
      return 0;
    }
  }
}

export default ReadUser; 