import DbService from '../../../services/db-service/dbService.js';
import UserBase from '../base/UserBase.js';
import ValidateUsername from '../validators/ValidateUsername.js';
import SanitizeUserData from '../transformers/SanitizeUserData.js';
import ReadUser from './ReadUser.js';

/**
 * Username update service
 */
class UpdateUsername {
  /**
   * Update user username with validation
   * @param {string} userId - User ID
   * @param {string} newUsername - New username
   * @returns {Promise<object>} - Update result
   */
  static async updateUsername(userId, newUsername) {
    try {
      // Check if user exists
      const userExists = await ReadUser.exists(userId);
      if (!userExists) {
        return {
          success: false,
          errors: ['User not found']
        };
      }

      // Validate new username
      const usernameValidation = await ValidateUsername.validateForUpdate(newUsername, userId);
      if (!usernameValidation.isValid) {
        return {
          success: false,
          errors: usernameValidation.errors
        };
      }

      // Normalize username
      const normalizedUsername = ValidateUsername.normalize(newUsername);

      // Update username in database
      const updatedUser = await DbService.update(
        UserBase.getTableName(), 
        userId, 
        { username: normalizedUsername }
      );

      return {
        success: true,
        user: SanitizeUserData.sanitizeUser(updatedUser)
      };

    } catch (error) {
      console.error('Error updating username:', error);
      return {
        success: false,
        errors: ['Failed to update username']
      };
    }
  }

  /**
   * Validate username change without actually updating
   * @param {string} userId - User ID
   * @param {string} newUsername - New username to validate
   * @returns {Promise<object>} - Validation result
   */
  static async validateUsernameChange(userId, newUsername) {
    try {
      // Check if user exists
      const userExists = await ReadUser.exists(userId);
      if (!userExists) {
        return {
          isValid: false,
          errors: ['User not found']
        };
      }

      // Validate username
      const usernameValidation = await ValidateUsername.validateForUpdate(newUsername, userId);
      
      return usernameValidation;

    } catch (error) {
      console.error('Error validating username change:', error);
      return {
        isValid: false,
        errors: ['Failed to validate username change']
      };
    }
  }

  /**
   * Check if username change is allowed (username is different from current)
   * @param {string} userId - User ID
   * @param {string} newUsername - New username
   * @returns {Promise<object>} - Check result
   */
  static async isUsernameChangeAllowed(userId, newUsername) {
    try {
      const currentUser = await ReadUser.findById(userId, false);
      if (!currentUser) {
        return {
          allowed: false,
          reason: 'User not found'
        };
      }

      const normalizedNewUsername = ValidateUsername.normalize(newUsername);
      const normalizedCurrentUsername = ValidateUsername.normalize(currentUser.username);

      if (normalizedNewUsername === normalizedCurrentUsername) {
        return {
          allowed: false,
          reason: 'New username is the same as current username'
        };
      }

      return {
        allowed: true
      };

    } catch (error) {
      console.error('Error checking if username change is allowed:', error);
      return {
        allowed: false,
        reason: 'Failed to check username change permissions'
      };
    }
  }

  /**
   * Update username with additional checks
   * @param {string} userId - User ID
   * @param {string} newUsername - New username
   * @param {object} options - Additional options
   * @param {boolean} options.requireDifferent - Require username to be different from current (default: true)
   * @returns {Promise<object>} - Update result
   */
  static async updateUsernameWithChecks(userId, newUsername, options = {}) {
    const { requireDifferent = true } = options;

    try {
      // Check if username change is allowed
      if (requireDifferent) {
        const changeAllowed = await this.isUsernameChangeAllowed(userId, newUsername);
        if (!changeAllowed.allowed) {
          return {
            success: false,
            errors: [changeAllowed.reason]
          };
        }
      }

      // Proceed with username update
      return await this.updateUsername(userId, newUsername);

    } catch (error) {
      console.error('Error updating username with checks:', error);
      return {
        success: false,
        errors: ['Failed to update username']
      };
    }
  }

  /**
   * Check username availability for a user
   * @param {string} username - Username to check
   * @param {string} excludeUserId - User ID to exclude from check
   * @returns {Promise<object>} - Availability result
   */
  static async checkAvailability(username, excludeUserId = null) {
    try {
      const validation = await ValidateUsername.validateUniqueness(username, excludeUserId);
      
      return {
        available: validation.isValid,
        reason: validation.isValid ? 'Username is available' : validation.errors[0]
      };

    } catch (error) {
      console.error('Error checking username availability:', error);
      return {
        available: false,
        reason: 'Failed to check username availability'
      };
    }
  }
}

export default UpdateUsername; 