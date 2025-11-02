import DbService from '../../../services/db-service/dbService.js';
import UserBase from '../base/UserBase.js';
import ValidateEmail from '../validators/ValidateEmail.js';
import SanitizeUserData from '../transformers/SanitizeUserData.js';
import ReadUser from './ReadUser.js';
import type { UserPublic, UserRecord, OperationResult, ValidationResult } from '../types.js';

class UpdateEmail {
  static async updateEmail(userId: string, newEmail: string): Promise<OperationResult<UserPublic>> {
    try {
      const userExists = await ReadUser.exists(userId);
      if (!userExists) {
        return { success: false, error: 'User not found' };
      }

      const emailValidation = await ValidateEmail.validateForUpdate(newEmail, userId);
      if (!emailValidation.isValid) {
        return { success: false, error: emailValidation.errors.join(', ') };
      }

      const normalizedEmail = ValidateEmail.normalize(newEmail);
      const updatedUser = await DbService.update<UserRecord>(UserBase.getTableName(), userId, { email: normalizedEmail });

      return { success: true, data: SanitizeUserData.sanitizeUser(updatedUser) as UserPublic };
    } catch (error: any) {
      console.error('Error updating user email:', error);
      return { success: false, error: 'Failed to update email' };
    }
  }

  static async validateEmailChange(userId: string, newEmail: string): Promise<ValidationResult> {
    try {
      const userExists = await ReadUser.exists(userId);
      if (!userExists) {
        return { isValid: false, errors: ['User not found'] };
      }
      return await ValidateEmail.validateForUpdate(newEmail, userId);
    } catch (error) {
      console.error('Error validating email change:', error);
      return { isValid: false, errors: ['Failed to validate email change'] };
    }
  }

  static async isEmailChangeAllowed(userId: string, newEmail: string): Promise<{ allowed: boolean; reason?: string }> {
    try {
      const currentUser = await ReadUser.findById(userId, false) as UserRecord | null;
      if (!currentUser) {
        return { allowed: false, reason: 'User not found' };
      }

      const normalizedNewEmail = ValidateEmail.normalize(newEmail);
      const normalizedCurrentEmail = ValidateEmail.normalize(currentUser.email);

      if (normalizedNewEmail === normalizedCurrentEmail) {
        return { allowed: false, reason: 'New email is the same as current email' };
      }

      return { allowed: true };
    } catch (error) {
      console.error('Error checking if email change is allowed:', error);
      return { allowed: false, reason: 'Failed to check email change permissions' };
    }
  }

  static async updateEmailWithChecks(userId: string, newEmail: string, options: { requireDifferent?: boolean } = {}): Promise<OperationResult<UserPublic>> {
    const { requireDifferent = true } = options;

    try {
      if (requireDifferent) {
        const changeAllowed = await this.isEmailChangeAllowed(userId, newEmail);
        if (!changeAllowed.allowed) {
          return { success: false, error: changeAllowed.reason || 'Email change not allowed' };
        }
      }

      return await this.updateEmail(userId, newEmail);
    } catch (error) {
      console.error('Error updating email with checks:', error);
      return { success: false, error: 'Failed to update email' };
    }
  }
}

export default UpdateEmail;
