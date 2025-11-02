import DbService from '../../../services/db-service/dbService.js';
import UserBase from '../base/UserBase.js';
import type { ValidationResult, UserRecord } from '../types.js';

/**
 * Email validation utilities
 */
class ValidateEmail {
  /**
   * Validate email format
   * @param email - Email to validate
   * @returns Validation result
   */
  static validateFormat(email: string): ValidationResult {
    const errors: string[] = [];

    if (!email || typeof email !== 'string') {
      errors.push('Email is required');
      return { isValid: false, errors };
    }

    // Basic email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      errors.push('Email format is invalid');
    }

    // Check email length
    if (email.trim().length > 255) {
      errors.push('Email is too long (maximum 255 characters)');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if email already exists
   * @param email - Email to check
   * @param excludeUserId - User ID to exclude from check (for updates)
   * @returns Validation result
   */
  static async validateUniqueness(email: string, excludeUserId: string | null = null): Promise<ValidationResult> {
    const errors: string[] = [];

    try {
      const users = await DbService.findBy<UserRecord>(UserBase.getTableName(), 'email', email.trim().toLowerCase());

      // Filter out the user being updated if excludeUserId is provided
      const conflictingUsers = excludeUserId
        ? users.filter(user => user.id !== excludeUserId)
        : users;

      if (conflictingUsers.length > 0) {
        errors.push('Email already exists');
      }
    } catch (error) {
      errors.push('Error checking email uniqueness');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate email for creation (format + uniqueness)
   * @param email - Email to validate
   * @returns Validation result
   */
  static async validateForCreation(email: string): Promise<ValidationResult> {
    const errors: string[] = [];

    // Check format first
    const formatValidation = this.validateFormat(email);
    if (formatValidation && Array.isArray(formatValidation.errors)) {
      errors.push(...formatValidation.errors);
    } else {
      errors.push('Validation error: email format validation failed');
    }

    // If format is valid, check uniqueness
    if (formatValidation && formatValidation.isValid) {
      const uniquenessValidation = await this.validateUniqueness(email);
      if (uniquenessValidation && Array.isArray(uniquenessValidation.errors)) {
        errors.push(...uniquenessValidation.errors);
      } else {
        errors.push('Validation error: email uniqueness validation failed');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate email for update (format + uniqueness excluding current user)
   * @param email - Email to validate
   * @param userId - Current user ID to exclude from uniqueness check
   * @returns Validation result
   */
  static async validateForUpdate(email: string, userId: string): Promise<ValidationResult> {
    const errors: string[] = [];

    // Check format first
    const formatValidation = this.validateFormat(email);
    if (formatValidation && Array.isArray(formatValidation.errors)) {
      errors.push(...formatValidation.errors);
    } else {
      errors.push('Validation error: email format validation failed');
    }

    // If format is valid, check uniqueness
    if (formatValidation && formatValidation.isValid) {
      const uniquenessValidation = await this.validateUniqueness(email, userId);
      if (uniquenessValidation && Array.isArray(uniquenessValidation.errors)) {
        errors.push(...uniquenessValidation.errors);
      } else {
        errors.push('Validation error: email uniqueness validation failed');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Normalize email (trim and lowercase)
   * @param email - Email to normalize
   * @returns Normalized email
   */
  static normalize(email: string): string {
    if (!email || typeof email !== 'string') return '';
    return email.trim().toLowerCase();
  }
}

export default ValidateEmail;
