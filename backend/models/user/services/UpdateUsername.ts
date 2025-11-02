import DbService from '../../../services/db-service/dbService.js';
import UserBase from '../base/UserBase.js';
import ValidateUsername from '../validators/ValidateUsername.js';
import SanitizeUserData from '../transformers/SanitizeUserData.js';
import ReadUser from './ReadUser.js';
import type { UserPublic, UserRecord, OperationResult, ValidationResult } from '../types.js';

class UpdateUsername {
  static async updateUsername(userId: string, newUsername: string): Promise<OperationResult<UserPublic>> {
    try {
      const userExists = await ReadUser.exists(userId);
      if (!userExists) {
        return { success: false, error: 'User not found' };
      }

      const usernameValidation = await ValidateUsername.validateForUpdate(newUsername, userId);
      if (!usernameValidation.isValid) {
        return { success: false, error: usernameValidation.errors.join(', ') };
      }

      const normalizedUsername = ValidateUsername.normalize(newUsername);
      const updatedUser = await DbService.update<UserRecord>(UserBase.getTableName(), userId, { username: normalizedUsername });

      return { success: true, data: SanitizeUserData.sanitizeUser(updatedUser) as UserPublic };
    } catch (error: any) {
      console.error('Error updating username:', error);
      return { success: false, error: 'Failed to update username' };
    }
  }

  static async validateUsernameChange(userId: string, newUsername: string): Promise<ValidationResult> {
    try {
      const userExists = await ReadUser.exists(userId);
      if (!userExists) {
        return { isValid: false, errors: ['User not found'] };
      }
      return await ValidateUsername.validateForUpdate(newUsername, userId);
    } catch (error) {
      console.error('Error validating username change:', error);
      return { isValid: false, errors: ['Failed to validate username change'] };
    }
  }

  static async isUsernameChangeAllowed(userId: string, newUsername: string): Promise<{ allowed: boolean; reason?: string }> {
    try {
      const currentUser = await ReadUser.findById(userId, false) as UserRecord | null;
      if (!currentUser) {
        return { allowed: false, reason: 'User not found' };
      }

      const normalizedNewUsername = ValidateUsername.normalize(newUsername);
      const normalizedCurrentUsername = ValidateUsername.normalize(currentUser.username);

      if (normalizedNewUsername === normalizedCurrentUsername) {
        return { allowed: false, reason: 'New username is the same as current username' };
      }

      return { allowed: true };
    } catch (error) {
      console.error('Error checking if username change is allowed:', error);
      return { allowed: false, reason: 'Failed to check username change permissions' };
    }
  }

  static async updateUsernameWithChecks(userId: string, newUsername: string, options: { requireDifferent?: boolean } = {}): Promise<OperationResult<UserPublic>> {
    const { requireDifferent = true } = options;

    try {
      if (requireDifferent) {
        const changeAllowed = await this.isUsernameChangeAllowed(userId, newUsername);
        if (!changeAllowed.allowed) {
          return { success: false, error: changeAllowed.reason || 'Username change not allowed' };
        }
      }

      return await this.updateUsername(userId, newUsername);
    } catch (error) {
      console.error('Error updating username with checks:', error);
      return { success: false, error: 'Failed to update username' };
    }
  }

  static async checkAvailability(username: string, excludeUserId: string | null = null): Promise<{ available: boolean; reason: string }> {
    try {
      const validation = await ValidateUsername.validateUniqueness(username, excludeUserId);
      return {
        available: validation.isValid,
        reason: validation.isValid ? 'Username is available' : validation.errors[0]
      };
    } catch (error) {
      console.error('Error checking username availability:', error);
      return { available: false, reason: 'Failed to check username availability' };
    }
  }
}

export default UpdateUsername;
