import { v4 as uuidv4 } from 'uuid';

/**
 * Base User utilities and constants
 */
class UserBase {
  static tableName = 'users';

  /**
   * Generate a new UUID for user ID
   * @returns New UUID
   */
  static generateId(): string {
    return uuidv4();
  }

  /**
   * Get the table name
   * @returns Table name
   */
  static getTableName(): string {
    return this.tableName;
  }

  /**
   * Get user columns that should be returned in responses (excluding sensitive data)
   * @returns Array of safe column names
   */
  static getSafeColumns(): string[] {
    return ['id', 'username', 'email', 'age', 'created_at', 'updated_at'];
  }

  /**
   * Get sensitive columns that should be excluded from responses
   * @returns Array of sensitive column names
   */
  static getSensitiveColumns(): string[] {
    return ['password_hash', 'reset_token', 'reset_token_expires'];
  }
}

export default UserBase;
