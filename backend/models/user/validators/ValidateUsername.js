import DbService from '../../../services/db-service/dbService.js';
import UserBase from '../base/UserBase.js';

/**
 * Username validation utilities
 */
class ValidateUsername {
  /**
   * Validate username format
   * @param {string} username - Username to validate
   * @returns {object} - Validation result
   */
  static validateFormat(username) {
    const errors = [];
    
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
   * @param {string} username - Username to check
   * @param {string} excludeUserId - User ID to exclude from check (for updates)
   * @returns {Promise<object>} - Validation result
   */
  static async validateUniqueness(username, excludeUserId = null) {
    const errors = [];
    
    try {
      const users = await DbService.findBy(UserBase.getTableName(), 'username', username.trim());
      
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
   * @param {string} username - Username to validate
   * @returns {Promise<object>} - Validation result
   */
  static async validateForCreation(username) {
    const errors = [];

    // Check format first
    const formatValidation = this.validateFormat(username);
    errors.push(...formatValidation.errors);

    // If format is valid, check uniqueness
    if (formatValidation.isValid) {
      const uniquenessValidation = await this.validateUniqueness(username);
      errors.push(...uniquenessValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate username for update (format + uniqueness excluding current user)
   * @param {string} username - Username to validate
   * @param {string} userId - Current user ID to exclude from uniqueness check
   * @returns {Promise<object>} - Validation result
   */
  static async validateForUpdate(username, userId) {
    const errors = [];

    // Check format first
    const formatValidation = this.validateFormat(username);
    errors.push(...formatValidation.errors);

    // If format is valid, check uniqueness
    if (formatValidation.isValid) {
      const uniquenessValidation = await this.validateUniqueness(username, userId);
      errors.push(...uniquenessValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Normalize username (trim)
   * @param {string} username - Username to normalize
   * @returns {string} - Normalized username
   */
  static normalize(username) {
    if (!username || typeof username !== 'string') return '';
    return username.trim();
  }
}

export default ValidateUsername; 