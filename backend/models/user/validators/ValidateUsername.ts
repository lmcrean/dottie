import DbService from '../../../services/db-service/dbService.js';
import UserBase from '../base/UserBase.js';
import type { ValidationResult, UserRecord } from '../types.js';

/**
 * Username validation utilities
 */
class ValidateUsername {
  /**
   * Validate username format
   * @param username - Username to validate
   * @returns Validation result
   */
  static validateFormat(username: string): ValidationResult {
    const errors: string[] = [];

    if (!username || typeof username !== 'string') {
      errors.push('Username is required');
      return { isValid: false, errors };
    }

    const trimmedUsername = username.trim();

    // Check length
    if (trimmedUsername.length < 3) {
      errors.push('Username must be at least 3 characters long');
    }

    if (trimmedUsername.length > 50) {
      errors.push('Username is too long (maximum 50 characters)');
    }

    // Check format - allow alphanumeric, underscores, and hyphens
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(trimmedUsername)) {
      errors.push('Username can only contain letters, numbers, underscores, and hyphens');
    }

    // Username cannot start or end with underscore or hyphen
    if (trimmedUsername.startsWith('_') || trimmedUsername.startsWith('-') ||
        trimmedUsername.endsWith('_') || trimmedUsername.endsWith('-')) {
      errors.push('Username cannot start or end with underscore or hyphen');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if username already exists
   * @param username - Username to check
   * @param excludeUserId - User ID to exclude from check (for updates)
   * @returns Validation result
   */
  static async validateUniqueness(username: string, excludeUserId: string | null = null): Promise<ValidationResult> {
    const errors: string[] = [];

    try {
      const users = await DbService.findBy<UserRecord>(UserBase.getTableName(), 'username', username.trim());

      // Filter out the user being updated if excludeUserId is provided
      const conflictingUsers = excludeUserId
        ? users.filter(user => user.id !== excludeUserId)
        : users;

      if (conflictingUsers.length > 0) {
        errors.push('Username already exists');
      }
    } catch (error) {
      errors.push('Error checking username uniqueness');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate username for creation (format + uniqueness)
   * @param username - Username to validate
   * @returns Validation result
   */
  static async validateForCreation(username: string): Promise<ValidationResult> {
    const errors: string[] = [];

    // Check format first
    const formatValidation = this.validateFormat(username);
    if (formatValidation && Array.isArray(formatValidation.errors)) {
      errors.push(...formatValidation.errors);
    } else {
      errors.push('Validation error: username format validation failed');
    }

    // If format is valid, check uniqueness
    if (formatValidation && formatValidation.isValid) {
      const uniquenessValidation = await this.validateUniqueness(username);
      if (uniquenessValidation && Array.isArray(uniquenessValidation.errors)) {
        errors.push(...uniquenessValidation.errors);
      } else {
        errors.push('Validation error: username uniqueness validation failed');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate username for update (format + uniqueness excluding current user)
   * @param username - Username to validate
   * @param userId - Current user ID to exclude from uniqueness check
   * @returns Validation result
   */
  static async validateForUpdate(username: string, userId: string): Promise<ValidationResult> {
    const errors: string[] = [];

    // Check format first
    const formatValidation = this.validateFormat(username);
    if (formatValidation && Array.isArray(formatValidation.errors)) {
      errors.push(...formatValidation.errors);
    } else {
      errors.push('Validation error: username format validation failed');
    }

    // If format is valid, check uniqueness
    if (formatValidation && formatValidation.isValid) {
      const uniquenessValidation = await this.validateUniqueness(username, userId);
      if (uniquenessValidation && Array.isArray(uniquenessValidation.errors)) {
        errors.push(...uniquenessValidation.errors);
      } else {
        errors.push('Validation error: username uniqueness validation failed');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Normalize username (trim)
   * @param username - Username to normalize
   * @returns Normalized username
   */
  static normalize(username: string): string {
    if (!username || typeof username !== 'string') return '';
    return username.trim();
  }
}

export default ValidateUsername;
