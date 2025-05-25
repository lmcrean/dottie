import { v4 as uuidv4 } from 'uuid';

/**
 * Base User utilities and constants
 */
class UserBase {
  static tableName = 'users';

  /**
   * Generate a new UUID for user ID
   * @returns {string} - New UUID
   */
  static generateId() {
    return uuidv4();
  }

  /**
   * Get the table name
   * @returns {string} - Table name
   */
  static getTableName() {
    return this.tableName;
  }

  /**
   * Get user columns that should be returned in responses (excluding sensitive data)
   * @returns {Array<string>} - Array of safe column names
   */
  static getSafeColumns() {
    return ['id', 'username', 'email', 'age', 'created_at', 'updated_at'];
  }

  /**
   * Get sensitive columns that should be excluded from responses
   * @returns {Array<string>} - Array of sensitive column names
   */
  static getSensitiveColumns() {
    return ['password_hash', 'reset_token', 'reset_token_expires'];
  }
}

export default UserBase; 