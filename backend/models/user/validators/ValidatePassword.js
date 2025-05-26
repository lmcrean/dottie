/**
 * Password validation utilities
 */
class ValidatePassword {
  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {object} - Validation result
   */
  static validateStrength(password) {
    const errors = [];
    
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
   * @param {string} passwordHash - Password hash to validate
   * @returns {object} - Validation result
   */
  static validateHash(passwordHash) {
    const errors = [];
    
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
   * @param {string} password - Original password
   * @param {string} confirmPassword - Confirmation password
   * @returns {object} - Validation result
   */
  static validateConfirmation(password, confirmPassword) {
    const errors = [];
    
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
   * @param {string} password - Password to validate
   * @param {string} confirmPassword - Password confirmation (optional)
   * @returns {object} - Validation result
   */
  static validateForCreation(password, confirmPassword = null) {
    const errors = [];

    // Check strength
    const strengthValidation = this.validateStrength(password);
    errors.push(...strengthValidation.errors);

    // Check confirmation if provided
    if (confirmPassword !== null) {
      const confirmationValidation = this.validateConfirmation(password, confirmPassword);
      errors.push(...confirmationValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get password strength score (0-5)
   * @param {string} password - Password to score
   * @returns {number} - Strength score
   */
  static getStrengthScore(password) {
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

    return Math.min(score, 5);
  }

  /**
   * Get password strength label
   * @param {string} password - Password to evaluate
   * @returns {string} - Strength label
   */
  static getStrengthLabel(password) {
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