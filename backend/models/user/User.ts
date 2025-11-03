// Services
import CreateUser from './services/CreateUser.js';
import ReadUser from './services/ReadUser.js';
import UpdateEmail from './services/UpdateEmail.js';
import UpdateUsername from './services/UpdateUsername.js';
import UpdatePassword from './services/UpdatePassword.js';
import DeleteUser from './services/DeleteUser.js';
import AuthenticateUser from './services/AuthenticateUser.js';
import ResetPassword from './services/ResetPassword.js';
import DbService from '../../services/dbService.js';

// Validators
import ValidateUserData from './validators/ValidateUserData.js';
import ValidateEmail from './validators/ValidateEmail.js';
import ValidateUsername from './validators/ValidateUsername.js';
import ValidatePassword from './validators/ValidatePassword.js';
import ValidateCredentials from './validators/ValidateCredentials.js';

// Transformers
import SanitizeUserData from './transformers/SanitizeUserData.js';

// Base
import UserBase from './base/UserBase.js';

// Types
import type {
  UserCreateInput,
  UserPublic,
  UserRecord,
  OperationResult,
  ValidationResult,
  LoginCredentials
} from './types.js';

/**
 * Main User model orchestrator
 * Provides a unified interface to all user-related functionality
 */
class User {
  // Expose table name for external use
  static tableName = UserBase.getTableName();

  // === CREATE OPERATIONS ===

  static async create(userData: UserCreateInput): Promise<OperationResult<UserPublic>> {
    return await CreateUser.create(userData);
  }

  static async validateForCreation(userData: Partial<UserCreateInput>): Promise<ValidationResult> {
    return await CreateUser.validateForCreation(userData);
  }

  // === READ OPERATIONS ===

  static async findById(id: string, sanitize: true): Promise<UserPublic | null>;
  static async findById(id: string, sanitize: false): Promise<UserRecord | null>;
  static async findById(id: string, sanitize?: boolean): Promise<UserPublic | UserRecord | null>;
  static async findById(id: string, sanitize: boolean = true): Promise<UserPublic | UserRecord | null> {
    return await ReadUser.findById(id, sanitize);
  }

  static async findByEmail(email: string, sanitize: true): Promise<UserPublic | null>;
  static async findByEmail(email: string, sanitize: false): Promise<UserRecord | null>;
  static async findByEmail(email: string, sanitize?: boolean): Promise<UserPublic | UserRecord | null>;
  static async findByEmail(email: string, sanitize: boolean = true): Promise<UserPublic | UserRecord | null> {
    return await ReadUser.findByEmail(email, sanitize);
  }

  static async findByUsername(username: string, sanitize: true): Promise<UserPublic | null>;
  static async findByUsername(username: string, sanitize: false): Promise<UserRecord | null>;
  static async findByUsername(username: string, sanitize?: boolean): Promise<UserPublic | UserRecord | null>;
  static async findByUsername(username: string, sanitize: boolean = true): Promise<UserPublic | UserRecord | null> {
    return await ReadUser.findByUsername(username, sanitize);
  }

  static async getAll(sanitize: boolean = true): Promise<UserPublic[] | UserRecord[]> {
    return await ReadUser.getAll(sanitize);
  }

  static async exists(id: string): Promise<boolean> {
    return await ReadUser.exists(id);
  }

  static async emailExists(email: string): Promise<boolean> {
    return await ReadUser.emailExists(email);
  }

  static async usernameExists(username: string): Promise<boolean> {
    return await ReadUser.usernameExists(username);
  }

  // === UPDATE OPERATIONS ===

  static async updateEmail(userId: string, newEmail: string): Promise<OperationResult<UserPublic>> {
    return await UpdateEmail.updateEmailWithChecks(userId, newEmail);
  }

  static async updateUsername(userId: string, newUsername: string): Promise<OperationResult<UserPublic>> {
    return await UpdateUsername.updateUsernameWithChecks(userId, newUsername);
  }

  static async updatePassword(userId: string, currentPasswordHash: string, newPasswordHash: string): Promise<OperationResult<UserPublic>> {
    return await UpdatePassword.updatePasswordWithVerification(userId, currentPasswordHash, newPasswordHash);
  }

  static async update(id: string, userData: any): Promise<UserPublic> {
    // For backward compatibility - delegates to DbService directly
    const updatedUser = await DbService.update<UserRecord>(this.tableName, id, userData);
    return SanitizeUserData.sanitizeUser(updatedUser) as UserPublic;
  }

  // === DELETE OPERATIONS ===

  static async delete(id: string): Promise<OperationResult<any>> {
    return await DeleteUser.deleteUser(id);
  }

  static async softDelete(userId: string): Promise<OperationResult<any>> {
    return await DeleteUser.softDeleteUser(userId);
  }

  static async getDeletionPreview(userId: string): Promise<OperationResult<any>> {
    return await DeleteUser.getDeletionPreview(userId);
  }

  // === AUTHENTICATION OPERATIONS ===

  static async authenticate(email: string, passwordHash: string): Promise<OperationResult<UserPublic>> {
    return await AuthenticateUser.authenticate(email, passwordHash);
  }

  static async verifyCredentials(email: string, passwordHash: string): Promise<OperationResult<UserPublic>> {
    return await AuthenticateUser.verifyCredentials(email, passwordHash);
  }

  static async checkUserStatus(email: string): Promise<any> {
    return await AuthenticateUser.checkUserStatus(email);
  }

  // === PASSWORD RESET OPERATIONS ===

  static async initiatePasswordReset(email: string, resetToken: string, hoursValid: number = 24): Promise<OperationResult<UserPublic>> {
    return await ResetPassword.initiatePasswordReset(email, resetToken, hoursValid);
  }

  static async resetPassword(resetToken: string, newPasswordHash: string): Promise<OperationResult<UserPublic>> {
    return await ResetPassword.resetPassword(resetToken, newPasswordHash);
  }

  static async validateResetToken(resetToken: string): Promise<any> {
    return await ResetPassword.validateResetToken(resetToken);
  }

  static async hasPendingReset(email: string): Promise<any> {
    return await ResetPassword.hasPendingReset(email);
  }

  // === VALIDATION UTILITIES ===

  static async validateEmail(email: string, excludeUserId: string | null = null): Promise<ValidationResult> {
    if (excludeUserId) {
      return await ValidateEmail.validateForUpdate(email, excludeUserId);
    }
    return await ValidateEmail.validateForCreation(email);
  }

  static async validateUsername(username: string, excludeUserId: string | null = null): Promise<ValidationResult> {
    if (excludeUserId) {
      return await ValidateUsername.validateForUpdate(username, excludeUserId);
    }
    return await ValidateUsername.validateForCreation(username);
  }

  static validatePassword(password: string): ValidationResult {
    return ValidatePassword.validateStrength(password);
  }

  static validateCredentials(credentials: LoginCredentials): ValidationResult {
    return ValidateCredentials.validateLoginCredentials(credentials);
  }

  // === UTILITY METHODS ===

  static sanitizeUser(user: UserRecord): UserPublic | null {
    return SanitizeUserData.sanitizeUser(user);
  }

  static sanitizeUsers(users: UserRecord[]): UserPublic[] {
    return SanitizeUserData.sanitizeUsers(users);
  }

  static async getCount(): Promise<number> {
    return await ReadUser.getCount();
  }

  static getTableName(): string {
    return UserBase.getTableName();
  }
}

export default User;
