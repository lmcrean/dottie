import DbService from '../../../services/db-service/dbService.js';
import UserBase from '../base/UserBase.js';
import ValidateEmail from '../validators/ValidateEmail.js';
import ValidatePassword from '../validators/ValidatePassword.js';
import SanitizeUserData from '../transformers/SanitizeUserData.js';
import ReadUser from './ReadUser.js';
import UpdatePassword from './UpdatePassword.js';
import type { UserPublic, UserRecord, OperationResult } from '../types.js';

/**
 * Password reset service
 */
class ResetPassword {
  static async storeResetToken(email: string, resetToken: string, expiresAt: Date | string): Promise<OperationResult<UserPublic>> {
    try {
      const emailValidation = ValidateEmail.validateFormat(email);
      if (!emailValidation.isValid) {
        return { success: false, error: emailValidation.errors.join(', ') };
      }

      const user = await ReadUser.findByEmail(email, false) as UserRecord | null;
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      const updatedUser = await DbService.update<UserRecord>(UserBase.getTableName(), user.id, {
        reset_token: resetToken,
        reset_token_expires: expiresAt
      });

      return { success: true, data: SanitizeUserData.sanitizeUser(updatedUser) as UserPublic };
    } catch (error: any) {
      console.error('Error storing reset token:', error);
      return { success: false, error: 'Failed to store reset token' };
    }
  }

  static async findByResetToken(resetToken: string): Promise<UserRecord | null> {
    try {
      if (!resetToken || typeof resetToken !== 'string') {
        return null;
      }

      const users = await DbService.findBy<UserRecord>(UserBase.getTableName(), 'reset_token', resetToken);

      if (!users.length) return null;
      const user = users[0];

      if (user.reset_token_expires && new Date(user.reset_token_expires) < new Date()) {
        return null;
      }

      return user;
    } catch (error) {
      console.error('Error finding user by reset token:', error);
      return null;
    }
  }

  static async clearResetToken(userId: string): Promise<OperationResult<UserPublic>> {
    try {
      const updatedUser = await DbService.update<UserRecord>(UserBase.getTableName(), userId, {
        reset_token: null,
        reset_token_expires: null
      });

      return { success: true, data: SanitizeUserData.sanitizeUser(updatedUser) as UserPublic };
    } catch (error: any) {
      console.error('Error clearing reset token:', error);
      return { success: false, error: 'Failed to clear reset token' };
    }
  }

  static async resetPassword(resetToken: string, newPasswordHash: string): Promise<OperationResult<UserPublic>> {
    try {
      const user = await this.findByResetToken(resetToken);
      if (!user) {
        return { success: false, error: 'Invalid or expired reset token' };
      }

      const passwordValidation = ValidatePassword.validateHash(newPasswordHash);
      if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.errors.join(', ') };
      }

      const passwordUpdateResult = await UpdatePassword.forcePasswordUpdate(user.id, newPasswordHash);
      if (!passwordUpdateResult.success) {
        return passwordUpdateResult;
      }

      await this.clearResetToken(user.id);

      return { success: true, data: passwordUpdateResult.data! };
    } catch (error: any) {
      console.error('Error resetting password:', error);
      return { success: false, error: 'Failed to reset password' };
    }
  }

  static async validateResetToken(resetToken: string): Promise<{ valid: boolean; reason?: string; user?: UserPublic }> {
    try {
      const user = await this.findByResetToken(resetToken);

      if (!user) {
        return { valid: false, reason: 'Invalid or expired reset token' };
      }

      return { valid: true, user: SanitizeUserData.sanitizeUser(user) as UserPublic };
    } catch (error: any) {
      console.error('Error validating reset token:', error);
      return { valid: false, reason: 'Failed to validate reset token' };
    }
  }

  static generateTokenExpiration(hoursFromNow: number = 24): Date {
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + hoursFromNow);
    return expirationDate;
  }

  static async initiatePasswordReset(email: string, resetToken: string, hoursValid: number = 24): Promise<OperationResult<UserPublic>> {
    try {
      const expiresAt = this.generateTokenExpiration(hoursValid);
      return await this.storeResetToken(email, resetToken, expiresAt);
    } catch (error: any) {
      console.error('Error initiating password reset:', error);
      return { success: false, error: 'Failed to initiate password reset' };
    }
  }

  static async hasPendingReset(email: string): Promise<{ hasPending: boolean; reason?: string; expiresAt?: Date | string }> {
    try {
      const user = await ReadUser.findByEmail(email, false) as UserRecord | null;
      if (!user) {
        return { hasPending: false, reason: 'User not found' };
      }

      if (user.reset_token && user.reset_token_expires) {
        if (new Date(user.reset_token_expires) > new Date()) {
          return { hasPending: true, expiresAt: user.reset_token_expires };
        }
      }

      return { hasPending: false, reason: 'No pending reset token' };
    } catch (error: any) {
      console.error('Error checking pending reset:', error);
      return { hasPending: false, reason: 'Failed to check pending reset' };
    }
  }

  static async cleanupExpiredTokens(): Promise<{ success: boolean; cleanedCount?: number; errors?: string[] }> {
    try {
      const users = await DbService.getAll<UserRecord>(UserBase.getTableName());
      let cleanedCount = 0;

      for (const user of users) {
        if (user.reset_token && user.reset_token_expires) {
          if (new Date(user.reset_token_expires) < new Date()) {
            await this.clearResetToken(user.id);
            cleanedCount++;
          }
        }
      }

      return { success: true, cleanedCount };
    } catch (error: any) {
      console.error('Error cleaning up expired tokens:', error);
      return { success: false, errors: ['Failed to cleanup expired tokens'] };
    }
  }
}

export default ResetPassword;
