import DbService from '../../../services/db-service/dbService.js';
import UserBase from '../base/UserBase.js';
import ValidatePassword from '../validators/ValidatePassword.js';
import SanitizeUserData from '../transformers/SanitizeUserData.js';
import ReadUser from './ReadUser.js';

/**
 * Password update service
 */
class UpdatePassword {
  /**
   * Update user password with validation
   * @param {string} userId - User ID
   * @param {string} newPasswordHash - New password hash
   * @param {string} currentPasswordHash - Current password hash for verification (optional)
   * @returns {Promise<object>} - Update result
   */
  static async updatePassword(userId, newPasswordHash, currentPasswordHash = null) {
    try {
      // Check if user exists
      const userExists = await ReadUser.exists(userId);
      if (!userExists) {
        return {
          success: false,
          errors: ['User not found']
        };
      }

      // Verify current password if provided
      if (currentPasswordHash) {
        const user = await ReadUser.findById(userId, false);
        if (user.password_hash !== currentPasswordHash) {
          return {
            success: false,
            errors: ['Current password is incorrect']
          };
        }
      }

      // Validate new password hash
      const passwordValidation = ValidatePassword.validateHash(newPasswordHash);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          errors: passwordValidation.errors
        };
      }

      // Update password in database
      const updatedUser = await DbService.update(
        UserBase.getTableName(), 
        userId, 
        { password_hash: newPasswordHash }
      );

      return {
        success: true,
        user: SanitizeUserData.sanitizeUser(updatedUser)
      };

    } catch (error) {
      console.error('Error updating password:', error);
      return {
        success: false,
        errors: ['Failed to update password']
      };
    }
  }

  /**
   * Verify current password for a user
   * @param {string} userId - User ID
   * @param {string} passwordHash - Password hash to verify
   * @returns {Promise<object>} - Verification result
   */
  static async verifyCurrentPassword(userId, passwordHash) {
    try {
      const user = await ReadUser.findById(userId, false);
      if (!user) {
        return {
          valid: false,
          reason: 'User not found'
        };
      }

      const isValid = user.password_hash === passwordHash;
      
      return {
        valid: isValid,
        reason: isValid ? 'Password is correct' : 'Password is incorrect'
      };

    } catch (error) {
      console.error('Error verifying current password:', error);
      return {
        valid: false,
        reason: 'Failed to verify password'
      };
    }
  }

  /**
   * Update password with current password verification
   * @param {string} userId - User ID
   * @param {string} currentPasswordHash - Current password hash
   * @param {string} newPasswordHash - New password hash
   * @returns {Promise<object>} - Update result
   */
  static async updatePasswordWithVerification(userId, currentPasswordHash, newPasswordHash) {
    try {
      // Verify current password first
      const verification = await this.verifyCurrentPassword(userId, currentPasswordHash);
      if (!verification.valid) {
        return {
          success: false,
          errors: [verification.reason]
        };
      }

      // Update password
      return await this.updatePassword(userId, newPasswordHash);

    } catch (error) {
      console.error('Error updating password with verification:', error);
      return {
        success: false,
        errors: ['Failed to update password']
      };
    }
  }

  /**
   * Force password update (admin use - no current password verification)
   * @param {string} userId - User ID
   * @param {string} newPasswordHash - New password hash
   * @returns {Promise<object>} - Update result
   */
  static async forcePasswordUpdate(userId, newPasswordHash) {
    try {
      return await this.updatePassword(userId, newPasswordHash);
    } catch (error) {
      console.error('Error forcing password update:', error);
      return {
        success: false,
        errors: ['Failed to update password']
      };
    }
  }

  /**
   * Validate password change without actually updating
   * @param {string} passwordHash - Password hash to validate
   * @returns {object} - Validation result
   */
  static validatePasswordChange(passwordHash) {
    return ValidatePassword.validateHash(passwordHash);
  }

  /**
   * Check if password change is needed (for security policies)
   * @param {string} userId - User ID
   * @param {number} maxDaysOld - Maximum age in days (default: 90)
   * @returns {Promise<object>} - Check result
   */
  static async isPasswordChangeNeeded(userId, maxDaysOld = 90) {
    try {
      const user = await ReadUser.findById(userId, false);
      if (!user) {
        return {
          needed: false,
          reason: 'User not found'
        };
      }

      // If updated_at field exists, use it to check password age
      if (user.updated_at) {
        const passwordAge = (new Date() - new Date(user.updated_at)) / (1000 * 60 * 60 * 24);
        if (passwordAge > maxDaysOld) {
          return {
            needed: true,
            reason: `Password is ${Math.floor(passwordAge)} days old`
          };
        }
      }

      return {
        needed: false,
        reason: 'Password is recent enough'
      };

    } catch (error) {
      console.error('Error checking if password change is needed:', error);
      return {
        needed: false,
        reason: 'Failed to check password age'
      };
    }
  }
}

export default UpdatePassword; 