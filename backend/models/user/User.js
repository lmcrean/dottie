import { v4 as uuidv4 } from 'uuid';
import DbService from '../../services/dbService.js';

/**
 * User model for handling user-related database operations
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
   * Find a user by email
   * @param {string} email - User email
   * @returns {Promise<object|null>} - Found user or null
   */
  static async findByEmail(email) {
    const users = await DbService.findBy(this.tableName, 'email', email);
    return users.length > 0 ? users[0] : null;
  }

  /**
   * Find a user by username
   * @param {string} username - Username
   * @returns {Promise<object|null>} - Found user or null
   */
  static async findByUsername(username) {
    const users = await DbService.findBy(this.tableName, 'username', username);
    return users.length > 0 ? users[0] : null;
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
   * Delete a user
   * @param {string} id - User ID
   * @returns {Promise<boolean>} - Success flag
   */
  static async delete(id) {
    return DbService.delete(this.tableName, id);
  }

  /**
   * Get all users
   * @returns {Promise<Array>} - Array of users
   */
  static async getAll() {
    return DbService.getAll(this.tableName);
  }

  /**
   * Update a user's password
   * @param {string} id - User ID
   * @param {string} password_hash - New password hash
   * @returns {Promise<object>} - Success indicator
   */
  static async updatePassword(id, password_hash) {
    return DbService.update(this.tableName, id, { password_hash });
  }

  /**
   * Store a password reset token for a user
   * @param {string} email - User email
   * @param {string} resetToken - Reset token
   * @param {Date} expiresAt - Token expiration date
   * @returns {Promise<object>} - Updated user
   */
  static async storeResetToken(email, resetToken, expiresAt) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    
    return DbService.update(this.tableName, user.id, { 
      reset_token: resetToken,
      reset_token_expires: expiresAt
    });
  }

  /**
   * Find a user by reset token
   * @param {string} resetToken - Reset token
   * @returns {Promise<object|null>} - Found user or null
   */
  static async findByResetToken(resetToken) {
    const users = await DbService.findBy(this.tableName, 'reset_token', resetToken);
    
    // If no user found or token is expired, return null
    if (!users.length) return null;
    const user = users[0];
    
    // Check if token is expired
    if (user.reset_token_expires && new Date(user.reset_token_expires) < new Date()) {
      return null;
    }
    
    return user;
  }

  /**
   * Clear reset token for a user
   * @param {string} id - User ID
   * @returns {Promise<object>} - Updated user
   */
  static async clearResetToken(id) {
    return DbService.update(this.tableName, id, { 
      reset_token: null,
      reset_token_expires: null
    });
  }
}

export default User; 