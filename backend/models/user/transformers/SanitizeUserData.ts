import UserBase from '../base/UserBase.js';
import type { UserRecord, UserPublic } from '../types.js';

/**
 * User data sanitization utilities
 */
class SanitizeUserData {
  /**
   * Remove sensitive data from a user object
   * @param user - User object to sanitize
   * @returns Sanitized user object
   */
  static sanitizeUser(user: UserRecord | null): UserPublic | null {
    if (!user) return null;

    const sanitizedUser: any = { ...user };
    const sensitiveColumns = UserBase.getSensitiveColumns();

    // Remove sensitive columns
    sensitiveColumns.forEach(column => {
      delete sanitizedUser[column];
    });

    return sanitizedUser as UserPublic;
  }

  /**
   * Remove sensitive data from an array of users
   * @param users - Array of user objects to sanitize
   * @returns Array of sanitized user objects
   */
  static sanitizeUsers(users: UserRecord[]): UserPublic[] {
    if (!Array.isArray(users)) return [];

    return users.map(user => this.sanitizeUser(user)).filter((u): u is UserPublic => u !== null);
  }

  /**
   * Keep only safe columns from a user object
   * @param user - User object to filter
   * @returns User object with only safe columns
   */
  static keepSafeFields(user: UserRecord | null): Partial<UserPublic> | null {
    if (!user) return null;

    const safeColumns = UserBase.getSafeColumns();
    const safeUser: any = {};

    safeColumns.forEach(column => {
      if (user.hasOwnProperty(column)) {
        safeUser[column] = (user as any)[column];
      }
    });

    return safeUser;
  }
}

export default SanitizeUserData;
