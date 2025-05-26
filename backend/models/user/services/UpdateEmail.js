import DbService from '../../../services/db-service/dbService.js';
import UserBase from '../base/UserBase.js';
import ValidateEmail from '../validators/ValidateEmail.js';
import SanitizeUserData from '../transformers/SanitizeUserData.js';
import ReadUser from './ReadUser.js';

/**
 * Email update service
 */
class UpdateEmail {
  /**
   * Update user email with validation
   * @param {string} userId - User ID
   * @param {string} newEmail - New email address
   * @returns {Promise<object>} - Update result
   */
  static async updateEmail(userId, newEmail) {
    try {
      // Check if user exists
      const userExists = await ReadUser.exists(userId);
      if (!userExists) {
        return {
          success: false,
          errors: ['User not found']
        };
      }

      // Validate new email
      const emailValidation = await ValidateEmail.validateForUpdate(newEmail, userId);
      if (!emailValidation.isValid) {
        return {
          success: false,
          errors: emailValidation.errors
        };
      }

      // Normalize email
      const normalizedEmail = ValidateEmail.normalize(newEmail);

      // Update email in database
      const updatedUser = await DbService.update(
        UserBase.getTableName(), 
        userId, 
        { email: normalizedEmail }
      );

      return {
        success: true,
        user: SanitizeUserData.sanitizeUser(updatedUser)
      };

    } catch (error) {
      console.error('Error updating user email:', error);
      return {
        success: false,
        errors: ['Failed to update email']
      };
    }
  }

  /**
   * Validate email change without actually updating
   * @param {string} userId - User ID
   * @param {string} newEmail - New email to validate
   * @returns {Promise<object>} - Validation result
   */
  static async validateEmailChange(userId, newEmail) {
    try {
      // Check if user exists
      const userExists = await ReadUser.exists(userId);
      if (!userExists) {
        return {
          isValid: false,
          errors: ['User not found']
        };
      }

      // Validate email
      const emailValidation = await ValidateEmail.validateForUpdate(newEmail, userId);
      
      return emailValidation;

    } catch (error) {
      console.error('Error validating email change:', error);
      return {
        isValid: false,
        errors: ['Failed to validate email change']
      };
    }
  }

  /**
   * Check if email change is allowed (email is different from current)
   * @param {string} userId - User ID
   * @param {string} newEmail - New email
   * @returns {Promise<object>} - Check result
   */
  static async isEmailChangeAllowed(userId, newEmail) {
    try {
      const currentUser = await ReadUser.findById(userId, false);
      if (!currentUser) {
        return {
          allowed: false,
          reason: 'User not found'
        };
      }

      const normalizedNewEmail = ValidateEmail.normalize(newEmail);
      const normalizedCurrentEmail = ValidateEmail.normalize(currentUser.email);

      if (normalizedNewEmail === normalizedCurrentEmail) {
        return {
          allowed: false,
          reason: 'New email is the same as current email'
        };
      }

      return {
        allowed: true
      };

    } catch (error) {
      console.error('Error checking if email change is allowed:', error);
      return {
        allowed: false,
        reason: 'Failed to check email change permissions'
      };
    }
  }

  /**
   * Update email with additional checks
   * @param {string} userId - User ID
   * @param {string} newEmail - New email
   * @param {object} options - Additional options
   * @param {boolean} options.requireDifferent - Require email to be different from current (default: true)
   * @returns {Promise<object>} - Update result
   */
  static async updateEmailWithChecks(userId, newEmail, options = {}) {
    const { requireDifferent = true } = options;

    try {
      // Check if email change is allowed
      if (requireDifferent) {
        const changeAllowed = await this.isEmailChangeAllowed(userId, newEmail);
        if (!changeAllowed.allowed) {
          return {
            success: false,
            errors: [changeAllowed.reason]
          };
        }
      }

      // Proceed with email update
      return await this.updateEmail(userId, newEmail);

    } catch (error) {
      console.error('Error updating email with checks:', error);
      return {
        success: false,
        errors: ['Failed to update email']
      };
    }
  }
}

export default UpdateEmail; 