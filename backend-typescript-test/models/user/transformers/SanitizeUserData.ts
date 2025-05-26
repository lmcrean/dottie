import UserBase from '../base/UserBase.js';

/**
 * User data sanitization utilities
 */
class SanitizeUserData {
  /**
   * Remove sensitive data from a user object
   * @param {object} user - User object to sanitize
   * @returns {object} - Sanitized user object
   */
  static sanitizeUser(user) {
    if (!user) return null;

    const sanitizedUser = { ...user };
    const sensitiveColumns = UserBase.getSensitiveColumns();
    
    // Remove sensitive columns
    sensitiveColumns.forEach(column => {
      delete sanitizedUser[column];
    });

    return sanitizedUser;
  }

  /**
   * Remove sensitive data from an array of users
   * @param {Array} users - Array of user objects to sanitize
   * @returns {Array} - Array of sanitized user objects
   */
  static sanitizeUsers(users) {
    if (!Array.isArray(users)) return [];
    
    return users.map(user => this.sanitizeUser(user));
  }

  /**
   * Keep only safe columns from a user object
   * @param {object} user - User object to filter
   * @returns {object} - User object with only safe columns
   */
  static keepSafeFields(user) {
    if (!user) return null;

    const safeColumns = UserBase.getSafeColumns();
    const safUser = {};

    safeColumns.forEach(column => {
      if (user.hasOwnProperty(column)) {
        safUser[column] = user[column];
      }
    });

    return safUser;
  }
}

export default SanitizeUserData; 