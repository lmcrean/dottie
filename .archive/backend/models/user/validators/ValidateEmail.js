import DbService from '../../../services/db-service/dbService.js';
import UserBase from '../base/UserBase.js';

/**
 * Email validation utilities
 */
class ValidateEmail {
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {object} - Validation result
   */
  static validateFormat(email) {
    const errors = [];
    
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
   * @param {string} email - Email to check
   * @param {string} excludeUserId - User ID to exclude from check (for updates)
   * @returns {Promise<object>} - Validation result
   */
  static async validateUniqueness(email, excludeUserId = null) {
    const errors = [];
    
    try {
      const users = await DbService.findBy(UserBase.getTableName(), 'email', email.trim().toLowerCase());
      
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
   * @param {string} email - Email to validate
   * @returns {Promise<object>} - Validation result
   */
  static async validateForCreation(email) {
    const errors = [];

    // Check format first
    const formatValidation = this.validateFormat(email);
    errors.push(...formatValidation.errors);

    // If format is valid, check uniqueness
    if (formatValidation.isValid) {
      const uniquenessValidation = await this.validateUniqueness(email);
      errors.push(...uniquenessValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate email for update (format + uniqueness excluding current user)
   * @param {string} email - Email to validate
   * @param {string} userId - Current user ID to exclude from uniqueness check
   * @returns {Promise<object>} - Validation result
   */
  static async validateForUpdate(email, userId) {
    const errors = [];

    // Check format first
    const formatValidation = this.validateFormat(email);
    errors.push(...formatValidation.errors);

    // If format is valid, check uniqueness
    if (formatValidation.isValid) {
      const uniquenessValidation = await this.validateUniqueness(email, userId);
      errors.push(...uniquenessValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Normalize email (trim and lowercase)
   * @param {string} email - Email to normalize
   * @returns {string} - Normalized email
   */
  static normalize(email) {
    if (!email || typeof email !== 'string') return '';
    return email.trim().toLowerCase();
  }
}

export default ValidateEmail; 