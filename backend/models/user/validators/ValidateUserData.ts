import type { ValidationResult, UserCreateInput, UserUpdateInput } from '../types.js';

/**
 * Basic user data validation utilities
 */
class ValidateUserData {
  /**
   * Validate required fields for user creation
   * @param userData - User data to validate
   * @returns Validation result with isValid and errors
   */
  static validateRequiredFields(userData: Partial<UserCreateInput>): ValidationResult {
    const errors: string[] = [];
    const requiredFields: (keyof UserCreateInput)[] = ['username', 'email', 'password_hash'];

    requiredFields.forEach(field => {
      const value = userData[field];
      if (!value || typeof value !== 'string' || value.trim() === '') {
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
   * @param age - Age value to validate
   * @returns Validation result
   */
  static validateAge(age: any): ValidationResult {
    const errors: string[] = [];

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
   * @param userData - User data to validate
   * @returns Validation result
   */
  static validateForCreation(userData: Partial<UserCreateInput>): ValidationResult {
    const errors: string[] = [];

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
   * @param userData - User data to validate
   * @returns Validation result
   */
  static validateForUpdate(userData: UserUpdateInput): ValidationResult {
    const errors: string[] = [];

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
