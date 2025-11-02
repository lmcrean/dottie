import DbService from '../../../services/db-service/dbService.js';
import UserBase from '../base/UserBase.js';
import ValidateUserData from '../validators/ValidateUserData.js';
import ValidateEmail from '../validators/ValidateEmail.js';
import ValidateUsername from '../validators/ValidateUsername.js';
import ValidatePassword from '../validators/ValidatePassword.js';
import SanitizeUserData from '../transformers/SanitizeUserData.js';
import type { UserCreateInput, UserPublic, OperationResult, ValidationResult, UserRecord } from '../types.js';

/**
 * User creation service
 */
class CreateUser {
  /**
   * Create a new user with validation
   * @param userData - User data to create
   * @returns Created user (sanitized) or error
   */
  static async create(userData: UserCreateInput): Promise<OperationResult<UserPublic>> {
    try {
      // Validate basic user data
      const basicValidation = ValidateUserData.validateForCreation(userData);
      if (!basicValidation.isValid) {
        return {
          success: false,
          error: basicValidation.errors.join(', ')
        };
      }

      // Validate email
      const emailValidation = await ValidateEmail.validateForCreation(userData.email);
      if (!emailValidation.isValid) {
        return {
          success: false,
          error: emailValidation.errors.join(', ')
        };
      }

      // Validate username
      const usernameValidation = await ValidateUsername.validateForCreation(userData.username);
      if (!usernameValidation.isValid) {
        return {
          success: false,
          error: usernameValidation.errors.join(', ')
        };
      }

      // Validate password hash
      const passwordValidation = ValidatePassword.validateHash(userData.password_hash);
      if (!passwordValidation.isValid) {
        return {
          success: false,
          error: passwordValidation.errors.join(', ')
        };
      }

      // Prepare user data
      const newUser: Partial<UserRecord> = {
        id: UserBase.generateId(),
        username: ValidateUsername.normalize(userData.username),
        email: ValidateEmail.normalize(userData.email),
        password_hash: userData.password_hash,
        age: userData.age || null
      };

      // Create user in database
      console.log('[CreateUser] Attempting to create user in database:', {
        table: UserBase.getTableName(),
        userId: newUser.id,
        username: newUser.username
      });

      const createdUser = await DbService.create<UserRecord>(UserBase.getTableName(), newUser);

      console.log('[CreateUser] User created successfully:', {
        id: createdUser?.id,
        username: createdUser?.username
      });

      // Return sanitized user data
      const sanitizedUser = SanitizeUserData.sanitizeUser(createdUser);
      return {
        success: true,
        data: sanitizedUser as UserPublic
      };

    } catch (error: any) {
      console.error('[CreateUser] Error creating user:', {
        error: error.message,
        stack: error.stack,
        code: error.code,
        errno: error.errno
      });
      return {
        success: false,
        error: `Failed to create user: ${error.message}`
      };
    }
  }

  /**
   * Validate user data for creation without actually creating
   * @param userData - User data to validate
   * @returns Validation result
   */
  static async validateForCreation(userData: Partial<UserCreateInput>): Promise<ValidationResult> {
    const allErrors: string[] = [];

    // Basic validation
    const basicValidation = ValidateUserData.validateForCreation(userData);
    allErrors.push(...basicValidation.errors);

    // Email validation
    if (userData.email) {
      const emailValidation = await ValidateEmail.validateForCreation(userData.email);
      allErrors.push(...emailValidation.errors);
    }

    // Username validation
    if (userData.username) {
      const usernameValidation = await ValidateUsername.validateForCreation(userData.username);
      allErrors.push(...usernameValidation.errors);
    }

    // Password validation
    if (userData.password_hash) {
      const passwordValidation = ValidatePassword.validateHash(userData.password_hash);
      allErrors.push(...passwordValidation.errors);
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors
    };
  }
}

export default CreateUser;
