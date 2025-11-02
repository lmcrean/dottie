import ValidateEmail from './ValidateEmail.js';
import type { ValidationResult, LoginCredentials } from '../types.js';

/**
 * Credentials validation utilities for login
 */
class ValidateCredentials {
  /**
   * Validate login credentials format
   * @param email - Email to validate
   * @param password - Password to validate
   * @returns Validation result
   */
  static validateFormat(email: string, password: string): ValidationResult {
    const errors: string[] = [];

    // Validate email format
    if (!email || typeof email !== 'string' || email.trim() === '') {
      errors.push('Email is required');
    } else {
      const emailValidation = ValidateEmail.validateFormat(email);
      if (emailValidation && !emailValidation.isValid && Array.isArray(emailValidation.errors)) {
        errors.push(...emailValidation.errors);
      } else if (!emailValidation || !emailValidation.isValid) {
        errors.push('Validation error: email format validation failed');
      }
    }

    // Validate password presence
    if (!password || typeof password !== 'string' || password === '') {
      errors.push('Password is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate credentials for login attempt
   * @param credentials - Login credentials
   * @returns Validation result
   */
  static validateLoginCredentials(credentials: LoginCredentials | any): ValidationResult {
    const errors: string[] = [];

    if (!credentials || typeof credentials !== 'object') {
      errors.push('Credentials are required');
      return { isValid: false, errors };
    }

    const { email, password } = credentials;

    // Validate format
    const formatValidation = this.validateFormat(email, password);
    if (formatValidation && Array.isArray(formatValidation.errors)) {
      errors.push(...formatValidation.errors);
    } else {
      errors.push('Validation error: credentials format validation failed');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate email/password combination structure
   * @param email - Email
   * @param password - Password
   * @returns Validation result
   */
  static validateCredentialsPair(email: string, password: string): ValidationResult {
    return this.validateFormat(email, password);
  }

  /**
   * Prepare credentials for authentication (normalize email)
   * @param email - Email to normalize
   * @param password - Password (kept as-is)
   * @returns Normalized credentials
   */
  static normalizeCredentials(email: string, password: string): LoginCredentials {
    return {
      email: ValidateEmail.normalize(email),
      password: password // Don't modify password
    };
  }

  /**
   * Validate rate limiting data (for future rate limiting implementation)
   * @param identifier - IP address or user identifier
   * @returns Validation result
   */
  static validateRateLimitIdentifier(identifier: string): ValidationResult {
    const errors: string[] = [];

    if (!identifier || typeof identifier !== 'string' || identifier.trim() === '') {
      errors.push('Rate limit identifier is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default ValidateCredentials;
