import DbService from '../../../services/db-service/dbService.js';
import UserBase from '../base/UserBase.js';
import SanitizeUserData from '../transformers/SanitizeUserData.js';
import type { UserRecord, UserPublic } from '../types.js';

/**
 * User reading service
 */
class ReadUser {
  /**
   * Find a user by ID
   * @param id - User ID
   * @param sanitize - Whether to sanitize the result (default: true)
   * @returns Found user or null
   */
  static async findById(id: string, sanitize: true): Promise<UserPublic | null>;
  static async findById(id: string, sanitize: false): Promise<UserRecord | null>;
  static async findById(id: string, sanitize?: boolean): Promise<UserPublic | UserRecord | null>;
  static async findById(id: string, sanitize: boolean = true): Promise<UserPublic | UserRecord | null> {
    try {
      if (!id || typeof id !== 'string') {
        return null;
      }

      const user = await DbService.findById<UserRecord>(UserBase.getTableName(), id);

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
   * @param email - User email
   * @param sanitize - Whether to sanitize the result (default: true)
   * @returns Found user or null
   */
  static async findByEmail(email: string, sanitize: true): Promise<UserPublic | null>;
  static async findByEmail(email: string, sanitize: false): Promise<UserRecord | null>;
  static async findByEmail(email: string, sanitize?: boolean): Promise<UserPublic | UserRecord | null>;
  static async findByEmail(email: string, sanitize: boolean = true): Promise<UserPublic | UserRecord | null> {
    try {
      if (!email || typeof email !== 'string') {
        return null;
      }

      const users = await DbService.findBy<UserRecord>(UserBase.getTableName(), 'email', email.trim().toLowerCase());
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
   * @param username - Username
   * @param sanitize - Whether to sanitize the result (default: true)
   * @returns Found user or null
   */
  static async findByUsername(username: string, sanitize: true): Promise<UserPublic | null>;
  static async findByUsername(username: string, sanitize: false): Promise<UserRecord | null>;
  static async findByUsername(username: string, sanitize?: boolean): Promise<UserPublic | UserRecord | null>;
  static async findByUsername(username: string, sanitize: boolean = true): Promise<UserPublic | UserRecord | null> {
    try {
      if (!username || typeof username !== 'string') {
        return null;
      }

      const users = await DbService.findBy<UserRecord>(UserBase.getTableName(), 'username', username.trim());
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
   * @param sanitize - Whether to sanitize the results (default: true)
   * @returns Array of users
   */
  static async getAll(sanitize: boolean = true): Promise<UserPublic[] | UserRecord[]> {
    try {
      const users = await DbService.getAll<UserRecord>(UserBase.getTableName());

      return sanitize ? SanitizeUserData.sanitizeUsers(users) : users;

    } catch (error) {
      console.error('Error getting all users:', error);
      return [];
    }
  }

  /**
   * Check if a user exists by ID
   * @param id - User ID
   * @returns True if user exists, false otherwise
   */
  static async exists(id: string): Promise<boolean> {
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
   * @param email - Email to check
   * @returns True if email exists, false otherwise
   */
  static async emailExists(email: string): Promise<boolean> {
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
   * @param username - Username to check
   * @returns True if username exists, false otherwise
   */
  static async usernameExists(username: string): Promise<boolean> {
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
   * @returns Total number of users
   */
  static async getCount(): Promise<number> {
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
