import ValidateCredentials from '../validators/ValidateCredentials.js';
import SanitizeUserData from '../transformers/SanitizeUserData.js';
import ReadUser from './ReadUser.js';

/**
 * User authentication service
 */
class AuthenticateUser {
  /**
   * Authenticate user with email and password hash
   * @param {string} email - User email
   * @param {string} passwordHash - Password hash to verify
   * @returns {Promise<object>} - Authentication result
   */
  static async authenticate(email, passwordHash) {
    try {
      // Validate credentials format
      const credentialsValidation = ValidateCredentials.validateCredentialsPair(email, passwordHash);
      if (!credentialsValidation.isValid) {
        return {
          success: false,
          errors: credentialsValidation.errors
        };
      }

      // Normalize credentials
      const normalizedCredentials = ValidateCredentials.normalizeCredentials(email, passwordHash);

      // Find user by email
      const user = await ReadUser.findByEmail(normalizedCredentials.email, false);
      if (!user) {
        return {
          success: false,
          errors: ['Invalid email or password']
        };
      }

      // Verify password
      if (user.password_hash !== normalizedCredentials.password) {
        return {
          success: false,
          errors: ['Invalid email or password']
        };
      }

      // Return authenticated user (sanitized)
      return {
        success: true,
        user: SanitizeUserData.sanitizeUser(user)
      };

    } catch (error) {
      console.error('Error authenticating user:', error);
      return {
        success: false,
        errors: ['Authentication failed']
      };
    }
  }

  /**
   * Verify user credentials (same as authenticate but different naming for clarity)
   * @param {string} email - User email
   * @param {string} passwordHash - Password hash to verify
   * @returns {Promise<object>} - Verification result
   */
  static async verifyCredentials(email, passwordHash) {
    return await this.authenticate(email, passwordHash);
  }

  /**
   * Authenticate user with credentials object
   * @param {object} credentials - Login credentials
   * @param {string} credentials.email - User email
   * @param {string} credentials.password - User password (raw or hash)
   * @returns {Promise<object>} - Authentication result
   */
  static async authenticateWithCredentials(credentials) {
    try {
      // Validate credentials structure
      const validation = ValidateCredentials.validateLoginCredentials(credentials);
      if (!validation.isValid) {
        return {
          success: false,
          errors: validation.errors
        };
      }

      // Authenticate with email and password
      return await this.authenticate(credentials.email, credentials.password);

    } catch (error) {
      console.error('Error authenticating with credentials:', error);
      return {
        success: false,
        errors: ['Authentication failed']
      };
    }
  }

  /**
   * Check if a user exists and is active
   * @param {string} email - User email
   * @returns {Promise<object>} - User status result
   */
  static async checkUserStatus(email) {
    try {
      const user = await ReadUser.findByEmail(email, false);
      
      if (!user) {
        return {
          success: true,
          exists: false,
          active: false,
          reason: 'User not found'
        };
      }

      // Check if user is soft deleted
      if (user.deleted_at) {
        return {
          success: true,
          exists: true,
          active: false,
          reason: 'User account is deactivated'
        };
      }

      return {
        success: true,
        exists: true,
        active: true,
        user: SanitizeUserData.sanitizeUser(user)
      };

    } catch (error) {
      console.error('Error checking user status:', error);
      return {
        success: false,
        exists: false,
        active: false,
        reason: 'Failed to check user status'
      };
    }
  }

  /**
   * Validate login attempt before authentication
   * @param {object} credentials - Login credentials
   * @returns {Promise<object>} - Pre-validation result
   */
  static async validateLoginAttempt(credentials) {
    try {
      // Validate credentials format
      const validation = ValidateCredentials.validateLoginCredentials(credentials);
      if (!validation.isValid) {
        return validation;
      }

      // Check if user exists and is active
      const userStatus = await this.checkUserStatus(credentials.email);
      if (!userStatus.exists) {
        return {
          isValid: false,
          errors: ['User not found']
        };
      }

      if (!userStatus.active) {
        return {
          isValid: false,
          errors: [userStatus.reason]
        };
      }

      return {
        isValid: true,
        user: userStatus.user
      };

    } catch (error) {
      console.error('Error validating login attempt:', error);
      return {
        isValid: false,
        errors: ['Failed to validate login attempt']
      };
    }
  }

  /**
   * Get user by credentials for JWT generation (without password verification)
   * @param {string} email - User email
   * @returns {Promise<object|null>} - User for JWT or null
   */
  static async getUserForJWT(email) {
    try {
      const user = await ReadUser.findByEmail(email, true);
      return user;
    } catch (error) {
      console.error('Error getting user for JWT:', error);
      return null;
    }
  }

  /**
   * Check if email exists (for registration validation)
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} - True if email exists
   */
  static async emailExists(email) {
    try {
      return await ReadUser.emailExists(email);
    } catch (error) {
      console.error('Error checking if email exists:', error);
      return false;
    }
  }

  /**
   * Check if username exists (for registration validation)
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} - True if username exists
   */
  static async usernameExists(username) {
    try {
      return await ReadUser.usernameExists(username);
    } catch (error) {
      console.error('Error checking if username exists:', error);
      return false;
    }
  }
}

export default AuthenticateUser; 