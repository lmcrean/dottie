import DbService from '../../../services/db-service/dbService.js';
import UserBase from '../base/UserBase.js';
import ValidateEmail from '../validators/ValidateEmail.js';
import ValidatePassword from '../validators/ValidatePassword.js';
import SanitizeUserData from '../transformers/SanitizeUserData.js';
import ReadUser from './ReadUser.js';
import UpdatePassword from './UpdatePassword.js';

/**
 * Password reset service
 */
class ResetPassword {
  /**
   * Store a password reset token for a user
   * @param {string} email - User email
   * @param {string} resetToken - Reset token
   * @param {Date} expiresAt - Token expiration date
   * @returns {Promise<object>} - Storage result
   */
  static async storeResetToken(email, resetToken, expiresAt) {
    try {
      // Validate email format
      const emailValidation = ValidateEmail.validateFormat(email);
      if (!emailValidation.isValid) {
        return {
          success: false,
          errors: emailValidation.errors
        };
      }

      // Find user by email
      const user = await ReadUser.findByEmail(email, false);
      if (!user) {
        return {
          success: false,
          errors: ['User not found']
        };
      }

      // Store reset token
      const updatedUser = await DbService.update(UserBase.getTableName(), user.id, { 
        reset_token: resetToken,
        reset_token_expires: expiresAt
      });

      return {
        success: true,
        user: SanitizeUserData.sanitizeUser(updatedUser)
      };

    } catch (error) {
      console.error('Error storing reset token:', error);
      return {
        success: false,
        errors: ['Failed to store reset token']
      };
    }
  }

  /**
   * Find a user by reset token
   * @param {string} resetToken - Reset token
   * @returns {Promise<object|null>} - Found user or null
   */
  static async findByResetToken(resetToken) {
    try {
      if (!resetToken || typeof resetToken !== 'string') {
        return null;
      }

      const users = await DbService.findBy(UserBase.getTableName(), 'reset_token', resetToken);
      
      // If no user found, return null
      if (!users.length) return null;
      const user = users[0];
      
      // Check if token is expired
      if (user.reset_token_expires && new Date(user.reset_token_expires) < new Date()) {
        return null;
      }
      
      return user;

    } catch (error) {
      console.error('Error finding user by reset token:', error);
      return null;
    }
  }

  /**
   * Clear reset token for a user
   * @param {string} userId - User ID
   * @returns {Promise<object>} - Clear result
   */
  static async clearResetToken(userId) {
    try {
      const updatedUser = await DbService.update(UserBase.getTableName(), userId, { 
        reset_token: null,
        reset_token_expires: null
      });

      return {
        success: true,
        user: SanitizeUserData.sanitizeUser(updatedUser)
      };

    } catch (error) {
      console.error('Error clearing reset token:', error);
      return {
        success: false,
        errors: ['Failed to clear reset token']
      };
    }
  }

  /**
   * Reset user password with token
   * @param {string} resetToken - Reset token
   * @param {string} newPasswordHash - New password hash
   * @returns {Promise<object>} - Reset result
   */
  static async resetPassword(resetToken, newPasswordHash) {
    try {
      // Find user by reset token
      const user = await this.findByResetToken(resetToken);
      if (!user) {
        return {
          success: false,
          errors: ['Invalid or expired reset token']
        };
      }

      // Validate new password hash
      const passwordValidation = ValidatePassword.validateHash(newPasswordHash);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          errors: passwordValidation.errors
        };
      }

      // Update password
      const passwordUpdateResult = await UpdatePassword.forcePasswordUpdate(user.id, newPasswordHash);
      if (!passwordUpdateResult.success) {
        return passwordUpdateResult;
      }

      // Clear reset token
      await this.clearResetToken(user.id);
      
      return {
        success: true,
        user: passwordUpdateResult.user
      };

    } catch (error) {
      console.error('Error resetting password:', error);
      return {
        success: false,
        errors: ['Failed to reset password']
      };
    }
  }

  /**
   * Check if reset token is valid and not expired
   * @param {string} resetToken - Reset token to validate
   * @returns {Promise<object>} - Validation result
   */
  static async validateResetToken(resetToken) {
    try {
      const user = await this.findByResetToken(resetToken);
      
      if (!user) {
        return {
          valid: false,
          reason: 'Invalid or expired reset token'
        };
      }

      return {
        valid: true,
        user: SanitizeUserData.sanitizeUser(user)
      };

    } catch (error) {
      console.error('Error validating reset token:', error);
      return {
        valid: false,
        reason: 'Failed to validate reset token'
      };
    }
  }

  /**
   * Generate reset token expiration date
   * @param {number} hoursFromNow - Hours from now for expiration (default: 24)
   * @returns {Date} - Expiration date
   */
  static generateTokenExpiration(hoursFromNow = 24) {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + hoursFromNow);
    return expirationDate;
  }

  /**
   * Initiate password reset process
   * @param {string} email - User email
   * @param {string} resetToken - Generated reset token
   * @param {number} hoursValid - How many hours the token is valid (default: 24)
   * @returns {Promise<object>} - Initiation result
   */
  static async initiatePasswordReset(email, resetToken, hoursValid = 24) {
    try {
      // Generate expiration date
      const expiresAt = this.generateTokenExpiration(hoursValid);

      // Store reset token
      const storeResult = await this.storeResetToken(email, resetToken, expiresAt);
      
      return storeResult;

    } catch (error) {
      console.error('Error initiating password reset:', error);
      return {
        success: false,
        errors: ['Failed to initiate password reset']
      };
    }
  }

  /**
   * Check if user has a pending reset token
   * @param {string} email - User email
   * @returns {Promise<object>} - Check result
   */
  static async hasPendingReset(email) {
    try {
      const user = await ReadUser.findByEmail(email, false);
      if (!user) {
        return {
          hasPending: false,
          reason: 'User not found'
        };
      }

      // Check if there's a valid reset token
      if (user.reset_token && user.reset_token_expires) {
        if (new Date(user.reset_token_expires) > new Date()) {
          return {
            hasPending: true,
            expiresAt: user.reset_token_expires
          };
        }
      }

      return {
        hasPending: false,
        reason: 'No pending reset token'
      };

    } catch (error) {
      console.error('Error checking pending reset:', error);
      return {
        hasPending: false,
        reason: 'Failed to check pending reset'
      };
    }
  }

  /**
   * Clean up expired reset tokens (maintenance function)
   * @returns {Promise<object>} - Cleanup result
   */
  static async cleanupExpiredTokens() {
    try {
      const users = await DbService.getAll(UserBase.getTableName());
      let cleanedCount = 0;

      for (const user of users) {
        if (user.reset_token && user.reset_token_expires) {
          if (new Date(user.reset_token_expires) < new Date()) {
            await this.clearResetToken(user.id);
            cleanedCount++;
          }
        }
      }

      return {
        success: true,
        cleanedCount
      };

    } catch (error) {
      console.error('Error cleaning up expired tokens:', error);
      return {
        success: false,
        errors: ['Failed to cleanup expired tokens']
      };
    }
  }
}

export default ResetPassword; 