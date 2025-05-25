import ValidateEmail from './ValidateEmail.js';

/**
 * Credentials validation utilities for login
 */
class ValidateCredentials {
  /**
   * Validate login credentials format
   * @param {string} email - Email to validate
   * @param {string} password - Password to validate
   * @returns {object} - Validation result
   */
  static validateFormat(email, password) {
    const errors = [];

    // Validate email format
    if (!email || typeof email !== 'string' || email.trim() === '') {
      errors.push('Email is required');
    } else {
      const emailValidation = ValidateEmail.validateFormat(email);
      if (!emailValidation.isValid) {
        errors.push(...emailValidation.errors);
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
   * @param {object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password
   * @returns {object} - Validation result
   */
  static validateLoginCredentials(credentials) {
    const errors = [];

    if (!credentials || typeof credentials !== 'object') {
      errors.push('Credentials are required');
      return { isValid: false, errors };
    }

    const { email, password } = credentials;

    // Validate format
    const formatValidation = this.validateFormat(email, password);
    errors.push(...formatValidation.errors);

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate email/password combination structure
   * @param {string} email - Email
   * @param {string} password - Password
   * @returns {object} - Validation result
   */
  static validateCredentialsPair(email, password) {
    return this.validateFormat(email, password);
  }

  /**
   * Prepare credentials for authentication (normalize email)
   * @param {string} email - Email to normalize
   * @param {string} password - Password (kept as-is)
   * @returns {object} - Normalized credentials
   */
  static normalizeCredentials(email, password) {
    return {
      email: ValidateEmail.normalize(email),
      password: password // Don't modify password
    };
  }

  /**
   * Validate rate limiting data (for future rate limiting implementation)
   * @param {string} identifier - IP address or user identifier
   * @returns {object} - Validation result
   */
  static validateRateLimitIdentifier(identifier) {
    const errors = [];

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