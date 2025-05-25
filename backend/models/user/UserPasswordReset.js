import DbService from '../../services/dbService.js';
import UserAuth from './UserAuth.js';

/**
 * UserPasswordReset model for handling password reset operations
 */
class UserPasswordReset {
  static tableName = 'users';

  /**
   * Store a password reset token for a user
   * @param {string} email - User email
   * @param {string} resetToken - Reset token
   * @param {Date} expiresAt - Token expiration date
   * @returns {Promise<object|null>} - Updated user or null if user not found
   */
  static async storeResetToken(email, resetToken, expiresAt) {
    const user = await UserAuth.findByEmail(email);
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

  /**
   * Reset user password with token
   * @param {string} resetToken - Reset token
   * @param {string} newPasswordHash - New password hash
   * @returns {Promise<object|null>} - Updated user or null if token invalid
   */
  static async resetPassword(resetToken, newPasswordHash) {
    const user = await this.findByResetToken(resetToken);
    if (!user) return null;

    // Update password and clear reset token
    await UserAuth.updatePassword(user.id, newPasswordHash);
    await this.clearResetToken(user.id);
    
    return user;
  }

  /**
   * Check if reset token is valid and not expired
   * @param {string} resetToken - Reset token to validate
   * @returns {Promise<boolean>} - True if token is valid, false otherwise
   */
  static async isValidResetToken(resetToken) {
    const user = await this.findByResetToken(resetToken);
    return user !== null;
  }
}

export default UserPasswordReset; 