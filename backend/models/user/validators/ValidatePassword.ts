import type { ValidationResult, PasswordStrengthScore, PasswordStrengthLabel } from '../types.js';

/**
 * Password validation utilities
 */
class ValidatePassword {
  /**
   * Validate password strength
   * @param password - Password to validate
   * @returns Validation result
   */
  static validateStrength(password: string): ValidationResult {
    const errors: string[] = [];

    if (!password || typeof password !== 'string') {
      errors.push('Password is required');
      return { isValid: false, errors };
    }

    // Check length
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (password.length > 128) {
      errors.push('Password is too long (maximum 128 characters)');
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    // Check for at least one special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate password hash (for stored passwords)
   * @param passwordHash - Password hash to validate
   * @returns Validation result
   */
  static validateHash(passwordHash: string): ValidationResult {
    const errors: string[] = [];

    if (!passwordHash || typeof passwordHash !== 'string') {
      errors.push('Password hash is required');
      return { isValid: false, errors };
    }

    // Basic validation - just check that it's not empty and has reasonable length
    if (passwordHash.trim().length < 10) {
      errors.push('Invalid password hash');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate password confirmation match
   * @param password - Original password
   * @param confirmPassword - Confirmation password
   * @returns Validation result
   */
  static validateConfirmation(password: string, confirmPassword: string): ValidationResult {
    const errors: string[] = [];

    if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Comprehensive password validation for creation
   * @param password - Password to validate
   * @param confirmPassword - Password confirmation (optional)
   * @returns Validation result
   */
  static validateForCreation(password: string, confirmPassword: string | null = null): ValidationResult {
    const errors: string[] = [];

    // Check strength
    const strengthValidation = this.validateStrength(password);
    if (strengthValidation && Array.isArray(strengthValidation.errors)) {
      errors.push(...strengthValidation.errors);
    } else {
      errors.push('Validation error: password strength validation failed');
    }

    // Check confirmation if provided
    if (confirmPassword !== null) {
      const confirmationValidation = this.validateConfirmation(password, confirmPassword);
      if (confirmationValidation && Array.isArray(confirmationValidation.errors)) {
        errors.push(...confirmationValidation.errors);
      } else {
        errors.push('Validation error: password confirmation validation failed');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get password strength score (0-5)
   * @param password - Password to score
   * @returns Strength score
   */
  static getStrengthScore(password: string): PasswordStrengthScore {
    if (!password) return 0;

    let score = 0;

    // Length criteria
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;

    // Character type criteria
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score++;

    return Math.min(score, 5) as PasswordStrengthScore;
  }

  /**
   * Get password strength label
   * @param password - Password to evaluate
   * @returns Strength label
   */
  static getStrengthLabel(password: string): PasswordStrengthLabel {
    const score = this.getStrengthScore(password);

    switch (score) {
      case 0:
      case 1:
        return 'Very Weak';
      case 2:
        return 'Weak';
      case 3:
        return 'Fair';
      case 4:
        return 'Good';
      case 5:
        return 'Strong';
      default:
        return 'Unknown';
    }
  }
}

export default ValidatePassword;
