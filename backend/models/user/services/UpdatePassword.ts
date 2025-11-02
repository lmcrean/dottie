import DbService from '../../../services/db-service/dbService.js';
import UserBase from '../base/UserBase.js';
import ValidatePassword from '../validators/ValidatePassword.js';
import SanitizeUserData from '../transformers/SanitizeUserData.js';
import ReadUser from './ReadUser.js';
import type { UserPublic, UserRecord, OperationResult, ValidationResult } from '../types.js';

/**
 * Password update service
 */
class UpdatePassword {
  static async updatePassword(userId: string, newPasswordHash: string, currentPasswordHash: string | null = null): Promise<OperationResult<UserPublic>> {
    try {
      const userExists = await ReadUser.exists(userId);
      if (!userExists) {
        return { success: false, error: 'User not found' };
      }

      if (currentPasswordHash) {
        const user = await ReadUser.findById(userId, false) as UserRecord;
        if (user.password_hash !== currentPasswordHash) {
          return { success: false, error: 'Current password is incorrect' };
        }
      }

      const passwordValidation = ValidatePassword.validateHash(newPasswordHash);
      if (!passwordValidation.isValid) {
        return { success: false, error: passwordValidation.errors.join(', ') };
      }

      const updatedUser = await DbService.update<UserRecord>(UserBase.getTableName(), userId, { password_hash: newPasswordHash });

      return { success: true, data: SanitizeUserData.sanitizeUser(updatedUser) as UserPublic };
    } catch (error: any) {
      console.error('Error updating password:', error);
      return { success: false, error: 'Failed to update password' };
    }
  }

  static async verifyCurrentPassword(userId: string, passwordHash: string): Promise<{ valid: boolean; reason: string }> {
    try {
      const user = await ReadUser.findById(userId, false) as UserRecord | null;
      if (!user) {
        return { valid: false, reason: 'User not found' };
      }

      const isValid = user.password_hash === passwordHash;
      return { valid: isValid, reason: isValid ? 'Password is correct' : 'Password is incorrect' };
    } catch (error) {
      console.error('Error verifying current password:', error);
      return { valid: false, reason: 'Failed to verify password' };
    }
  }

  static async updatePasswordWithVerification(userId: string, currentPasswordHash: string, newPasswordHash: string): Promise<OperationResult<UserPublic>> {
    try {
      const verification = await this.verifyCurrentPassword(userId, currentPasswordHash);
      if (!verification.valid) {
        return { success: false, error: verification.reason };
      }

      return await this.updatePassword(userId, newPasswordHash);
    } catch (error) {
      console.error('Error updating password with verification:', error);
      return { success: false, error: 'Failed to update password' };
    }
  }

  static async forcePasswordUpdate(userId: string, newPasswordHash: string): Promise<OperationResult<UserPublic>> {
    try {
      return await this.updatePassword(userId, newPasswordHash);
    } catch (error) {
      console.error('Error forcing password update:', error);
      return { success: false, error: 'Failed to update password' };
    }
  }

  static validatePasswordChange(passwordHash: string): ValidationResult {
    return ValidatePassword.validateHash(passwordHash);
  }

  static async isPasswordChangeNeeded(userId: string, maxDaysOld: number = 90): Promise<{ needed: boolean; reason: string }> {
    try {
      const user = await ReadUser.findById(userId, false) as UserRecord | null;
      if (!user) {
        return { needed: false, reason: 'User not found' };
      }

      if (user.updated_at) {
        const passwordAge = (new Date().getTime() - new Date(user.updated_at).getTime()) / (1000 * 60 * 60 * 24);
        if (passwordAge > maxDaysOld) {
          return { needed: true, reason: `Password is ${Math.floor(passwordAge)} days old` };
        }
      }

      return { needed: false, reason: 'Password is recent enough' };
    } catch (error) {
      console.error('Error checking if password change is needed:', error);
      return { needed: false, reason: 'Failed to check password age' };
    }
  }
}

export default UpdatePassword;
