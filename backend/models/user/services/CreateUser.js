import DbService from '../../../services/db-service/dbService.js';
import UserBase from '../base/UserBase.js';
import ValidateUserData from '../validators/ValidateUserData.js';
import ValidateEmail from '../validators/ValidateEmail.js';
import ValidateUsername from '../validators/ValidateUsername.js';
import ValidatePassword from '../validators/ValidatePassword.js';
import SanitizeUserData from '../transformers/SanitizeUserData.js';

/**
 * User creation service
 */
class CreateUser {
  /**
   * Create a new user with validation
   * @param {object} userData - User data to create
   * @param {string} userData.username - Username
   * @param {string} userData.email - Email
   * @param {string} userData.password_hash - Password hash
   * @param {number} userData.age - Age (optional)
   * @returns {Promise<object>} - Created user (sanitized) or error
   */
  static async create(userData) {
    try {
      // Validate basic user data
      const basicValidation = ValidateUserData.validateForCreation(userData);
      if (!basicValidation.isValid) {
        return {
          success: false,
          errors: basicValidation.errors
        };
      }

      // Validate email
      const emailValidation = await ValidateEmail.validateForCreation(userData.email);
      if (!emailValidation.isValid) {
        return {
          success: false,
          errors: emailValidation.errors
        };
      }

      // Validate username
      const usernameValidation = await ValidateUsername.validateForCreation(userData.username);
      if (!usernameValidation.isValid) {
        return {
          success: false,
          errors: usernameValidation.errors
        };
      }

      // Validate password hash
      const passwordValidation = ValidatePassword.validateHash(userData.password_hash);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          errors: passwordValidation.errors
        };
      }

      // Prepare user data
      const newUser = {
        id: UserBase.generateId(),
        username: ValidateUsername.normalize(userData.username),
        email: ValidateEmail.normalize(userData.email),
        password_hash: userData.password_hash,
        age: userData.age || null
      };

      // Create user in database
      const createdUser = await DbService.create(UserBase.getTableName(), newUser);

      // Return sanitized user data
      return {
        success: true,
        user: SanitizeUserData.sanitizeUser(createdUser)
      };

    } catch (error) {
      console.error('Error creating user:', error);
      return {
        success: false,
        errors: ['Failed to create user']
      };
    }
  }

  /**
   * Validate user data for creation without actually creating
   * @param {object} userData - User data to validate
   * @returns {Promise<object>} - Validation result
   */
  static async validateForCreation(userData) {
    const allErrors = [];

    // Basic validation
    const basicValidation = ValidateUserData.validateForCreation(userData);
    allErrors.push(...basicValidation.errors);

    // Email validation
    if (userData.email) {
      const emailValidation = await ValidateEmail.validateForCreation(userData.email);
      allErrors.push(...emailValidation.errors);
    }

    // Username validation
    if (userData.username) {
      const usernameValidation = await ValidateUsername.validateForCreation(userData.username);
      allErrors.push(...usernameValidation.errors);
    }

    // Password validation
    if (userData.password_hash) {
      const passwordValidation = ValidatePassword.validateHash(userData.password_hash);
      allErrors.push(...passwordValidation.errors);
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  }
}

export default CreateUser; 