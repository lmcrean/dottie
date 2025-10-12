/**
 * Basic user data validation utilities
 */
class ValidateUserData {
  /**
   * Validate required fields for user creation
   * @param {object} userData - User data to validate
   * @returns {object} - Validation result with isValid and errors
   */
  static validateRequiredFields(userData) {
    const errors = [];
    const requiredFields = ['username', 'email', 'password_hash'];

    requiredFields.forEach(field => {
      if (!userData[field] || typeof userData[field] !== 'string' || userData[field].trim() === '') {
        errors.push(`${field} is required`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate age field if provided
   * @param {any} age - Age value to validate
   * @returns {object} - Validation result
   */
  static validateAge(age) {
    const errors = [];

    if (age !== undefined && age !== null) {
      const ageNum = Number(age);
      if (isNaN(ageNum) || ageNum < 0 || ageNum > 150) {
        errors.push('Age must be a valid number between 0 and 150');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate user data for creation
   * @param {object} userData - User data to validate
   * @returns {object} - Validation result
   */
  static validateForCreation(userData) {
    const errors = [];

    // Check required fields
    const requiredValidation = this.validateRequiredFields(userData);
    if (requiredValidation && Array.isArray(requiredValidation.errors)) {
      errors.push(...requiredValidation.errors);
    } else {
      errors.push('Validation error: required fields validation failed');
    }

    // Check age if provided
    const ageValidation = this.validateAge(userData.age);
    if (ageValidation && Array.isArray(ageValidation.errors)) {
      errors.push(...ageValidation.errors);
    } else {
      errors.push('Validation error: age validation failed');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate user data for update
   * @param {object} userData - User data to validate
   * @returns {object} - Validation result
   */
  static validateForUpdate(userData) {
    const errors = [];

    // For updates, we don't require all fields, just validate what's provided
    if (userData.age !== undefined) {
      const ageValidation = this.validateAge(userData.age);
      if (ageValidation && Array.isArray(ageValidation.errors)) {
        errors.push(...ageValidation.errors);
      } else {
        errors.push('Validation error: age validation failed');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default ValidateUserData; 