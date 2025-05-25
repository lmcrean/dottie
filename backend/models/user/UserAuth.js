import DbService from '../../services/dbService.js';

/**
 * UserAuth model for handling authentication-related operations
 */
class UserAuth {
  static tableName = 'users';

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
   * Update a user's password
   * @param {string} id - User ID
   * @param {string} password_hash - New password hash
   * @returns {Promise<object>} - Success indicator
   */
  static async updatePassword(id, password_hash) {
    return DbService.update(this.tableName, id, { password_hash });
  }

  /**
   * Verify user credentials by email
   * @param {string} email - User email
   * @param {string} password_hash - Password hash to verify
   * @returns {Promise<object|null>} - User if credentials are valid, null otherwise
   */
  static async verifyCredentials(email, password_hash) {
    const user = await this.findByEmail(email);
    if (user && user.password_hash === password_hash) {
      return user;
    }
    return null;
  }

  /**
   * Check if email already exists
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} - True if email exists, false otherwise
   */
  static async emailExists(email) {
    const user = await this.findByEmail(email);
    return user !== null;
  }

  /**
   * Check if username already exists
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} - True if username exists, false otherwise
   */
  static async usernameExists(username) {
    const user = await this.findByUsername(username);
    return user !== null;
  }
}

export default UserAuth; 