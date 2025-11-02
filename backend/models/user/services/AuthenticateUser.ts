import ValidateCredentials from '../validators/ValidateCredentials.js';
import SanitizeUserData from '../transformers/SanitizeUserData.js';
import ReadUser from './ReadUser.js';
import type { UserPublic, UserRecord, OperationResult, LoginCredentials } from '../types.js';

/**
 * User authentication service
 */
class AuthenticateUser {
  static async authenticate(email: string, passwordHash: string): Promise<OperationResult<UserPublic>> {
    try {
      const credentialsValidation = ValidateCredentials.validateCredentialsPair(email, passwordHash);
      if (!credentialsValidation.isValid) {
        return { success: false, error: credentialsValidation.errors.join(', ') };
      }

      const normalizedCredentials = ValidateCredentials.normalizeCredentials(email, passwordHash);
      const user = await ReadUser.findByEmail(normalizedCredentials.email, false) as UserRecord | null;

      if (!user) {
        return { success: false, error: 'Invalid email or password' };
      }

      if (user.password_hash !== normalizedCredentials.password) {
        return { success: false, error: 'Invalid email or password' };
      }

      return { success: true, data: SanitizeUserData.sanitizeUser(user) as UserPublic };
    } catch (error: any) {
      console.error('Error authenticating user:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  static async verifyCredentials(email: string, passwordHash: string): Promise<OperationResult<UserPublic>> {
    return await this.authenticate(email, passwordHash);
  }

  static async authenticateWithCredentials(credentials: LoginCredentials): Promise<OperationResult<UserPublic>> {
    try {
      const validation = ValidateCredentials.validateLoginCredentials(credentials);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      return await this.authenticate(credentials.email, credentials.password);
    } catch (error: any) {
      console.error('Error authenticating with credentials:', error);
      return { success: false, error: 'Authentication failed' };
    }
  }

  static async checkUserStatus(email: string): Promise<{ success: boolean; exists: boolean; active: boolean; reason?: string; user?: UserPublic }> {
    try {
      const user = await ReadUser.findByEmail(email, false) as UserRecord | null;

      if (!user) {
        return { success: true, exists: false, active: false, reason: 'User not found' };
      }

      if (user.deleted_at) {
        return { success: true, exists: true, active: false, reason: 'User account is deactivated' };
      }

      return {
        success: true,
        exists: true,
        active: true,
        user: SanitizeUserData.sanitizeUser(user) as UserPublic
      };
    } catch (error: any) {
      console.error('Error checking user status:', error);
      return { success: false, exists: false, active: false, reason: 'Failed to check user status' };
    }
  }

  static async validateLoginAttempt(credentials: LoginCredentials): Promise<{ isValid: boolean; errors?: string[]; user?: UserPublic }> {
    try {
      const validation = ValidateCredentials.validateLoginCredentials(credentials);
      if (!validation.isValid) {
        return validation;
      }

      const userStatus = await this.checkUserStatus(credentials.email);
      if (!userStatus.exists) {
        return { isValid: false, errors: ['User not found'] };
      }

      if (!userStatus.active) {
        return { isValid: false, errors: [userStatus.reason || 'User inactive'] };
      }

      return { isValid: true, user: userStatus.user };
    } catch (error: any) {
      console.error('Error validating login attempt:', error);
      return { isValid: false, errors: ['Failed to validate login attempt'] };
    }
  }

  static async getUserForJWT(email: string): Promise<UserPublic | null> {
    try {
      return await ReadUser.findByEmail(email, true) as UserPublic | null;
    } catch (error) {
      console.error('Error getting user for JWT:', error);
      return null;
    }
  }

  static async emailExists(email: string): Promise<boolean> {
    try {
      return await ReadUser.emailExists(email);
    } catch (error) {
      console.error('Error checking if email exists:', error);
      return false;
    }
  }

  static async usernameExists(username: string): Promise<boolean> {
    try {
      return await ReadUser.usernameExists(username);
    } catch (error) {
      console.error('Error checking if username exists:', error);
      return false;
    }
  }
}

export default AuthenticateUser;
