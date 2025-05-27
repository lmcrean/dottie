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

/**
 * Main User model orchestrator
 * Provides a unified interface to all user-related functionality
 */
class User {
  // Expose table name for external use
  static tableName = UserBase.getTableName();

  // === CREATE OPERATIONS ===

  /**
   * Create a new user
   * @param {object} userData - User data (username, email, password_hash, age)
   * @returns {Promise<object>} - Created user result
   */
  static async create(userData) {
    return await CreateUser.create(userData);
  }

  /**
   * Validate user data for creation
   * @param {object} userData - User data to validate
   * @returns {Promise<object>} - Validation result
   */
  static async validateForCreation(userData) {
    return await CreateUser.validateForCreation(userData);
  }

  // === READ OPERATIONS ===

  /**
   * Find a user by ID
   * @param {string} id - User ID
   * @param {boolean} sanitize - Whether to sanitize the result (default: true)
   * @returns {Promise<object|null>} - Found user or null
   */
  static async findById(id, sanitize = true) {
    return await ReadUser.findById(id, sanitize);
  }

  /**
   * Find a user by email
   * @param {string} email - User email
   * @param {boolean} sanitize - Whether to sanitize the result (default: true)
   * @returns {Promise<object|null>} - Found user or null
   */
  static async findByEmail(email, sanitize = true) {
    return await ReadUser.findByEmail(email, sanitize);
  }

  /**
   * Find a user by username
   * @param {string} username - Username
   * @param {boolean} sanitize - Whether to sanitize the result (default: true)
   * @returns {Promise<object|null>} - Found user or null
   */
  static async findByUsername(username, sanitize = true) {
    return await ReadUser.findByUsername(username, sanitize);
  }

  /**
   * Get all users
   * @param {boolean} sanitize - Whether to sanitize the results (default: true)
   * @returns {Promise<Array>} - Array of users
   */
  static async getAll(sanitize = true) {
    return await ReadUser.getAll(sanitize);
  }

  /**
   * Check if a user exists by ID
   * @param {string} id - User ID
   * @returns {Promise<boolean>} - True if user exists
   */
  static async exists(id) {
    return await ReadUser.exists(id);
  }

  /**
   * Check if an email exists
   * @param {string} email - Email to check
   * @returns {Promise<boolean>} - True if email exists
   */
  static async emailExists(email) {
    return await ReadUser.emailExists(email);
  }

  /**
   * Check if a username exists
   * @param {string} username - Username to check
   * @returns {Promise<boolean>} - True if username exists
   */
  static async usernameExists(username) {
    return await ReadUser.usernameExists(username);
  }

  // === UPDATE OPERATIONS ===

  /**
   * Update user email
   * @param {string} userId - User ID
   * @param {string} newEmail - New email address
   * @returns {Promise<object>} - Update result
   */
  static async updateEmail(userId, newEmail) {
    return await UpdateEmail.updateEmailWithChecks(userId, newEmail);
  }

  /**
   * Update user username
   * @param {string} userId - User ID
   * @param {string} newUsername - New username
   * @returns {Promise<object>} - Update result
   */
  static async updateUsername(userId, newUsername) {
    return await UpdateUsername.updateUsernameWithChecks(userId, newUsername);
  }

  /**
   * Update user password with current password verification
   * @param {string} userId - User ID
   * @param {string} currentPasswordHash - Current password hash
   * @param {string} newPasswordHash - New password hash
   * @returns {Promise<object>} - Update result
   */
  static async updatePassword(userId, currentPasswordHash, newPasswordHash) {
    return await UpdatePassword.updatePasswordWithVerification(userId, currentPasswordHash, newPasswordHash);
  }

  /**
   * Generic update method (for other fields like age)
   * @param {string} id - User ID
   * @param {object} userData - Updated user data
   * @returns {Promise<object>} - Updated user
   */
  static async update(id, userData) {
    // For backward compatibility - delegates to DbService directly
    // This should ideally be replaced with specific update services
    const updatedUser = await DbService.update(this.tableName, id, userData);
    return SanitizeUserData.sanitizeUser(updatedUser);
  }

  // === DELETE OPERATIONS ===

  /**
   * Delete a user and all related data
   * @param {string} id - User ID
   * @returns {Promise<object>} - Deletion result
   */
  static async delete(id) {
    return await DeleteUser.deleteUser(id);
  }

  /**
   * Soft delete a user
   * @param {string} userId - User ID
   * @returns {Promise<object>} - Soft deletion result
   */
  static async softDelete(userId) {
    return await DeleteUser.softDeleteUser(userId);
  }

  /**
   * Get deletion preview
   * @param {string} userId - User ID
   * @returns {Promise<object>} - Preview of what would be deleted
   */
  static async getDeletionPreview(userId) {
    return await DeleteUser.getDeletionPreview(userId);
  }

  // === AUTHENTICATION OPERATIONS ===

  /**
   * Authenticate user with email and password hash
   * @param {string} email - User email
   * @param {string} passwordHash - Password hash
   * @returns {Promise<object>} - Authentication result
   */
  static async authenticate(email, passwordHash) {
    return await AuthenticateUser.authenticate(email, passwordHash);
  }

  /**
   * Verify user credentials
   * @param {string} email - User email
   * @param {string} passwordHash - Password hash
   * @returns {Promise<object>} - Verification result
   */
  static async verifyCredentials(email, passwordHash) {
    return await AuthenticateUser.verifyCredentials(email, passwordHash);
  }

  /**
   * Check user status (exists and active)
   * @param {string} email - User email
   * @returns {Promise<object>} - User status result
   */
  static async checkUserStatus(email) {
    return await AuthenticateUser.checkUserStatus(email);
  }

  // === PASSWORD RESET OPERATIONS ===

  /**
   * Initiate password reset process
   * @param {string} email - User email
   * @param {string} resetToken - Generated reset token
   * @param {number} hoursValid - Hours the token is valid (default: 24)
   * @returns {Promise<object>} - Initiation result
   */
  static async initiatePasswordReset(email, resetToken, hoursValid = 24) {
    return await ResetPassword.initiatePasswordReset(email, resetToken, hoursValid);
  }

  /**
   * Reset password with token
   * @param {string} resetToken - Reset token
   * @param {string} newPasswordHash - New password hash
   * @returns {Promise<object>} - Reset result
   */
  static async resetPassword(resetToken, newPasswordHash) {
    return await ResetPassword.resetPassword(resetToken, newPasswordHash);
  }

  /**
   * Validate reset token
   * @param {string} resetToken - Reset token
   * @returns {Promise<object>} - Validation result
   */
  static async validateResetToken(resetToken) {
    return await ResetPassword.validateResetToken(resetToken);
  }

  /**
   * Check if user has pending reset
   * @param {string} email - User email
   * @returns {Promise<object>} - Check result
   */
  static async hasPendingReset(email) {
    return await ResetPassword.hasPendingReset(email);
  }

  // === VALIDATION UTILITIES ===

  /**
   * Validate email format and uniqueness
   * @param {string} email - Email to validate
   * @param {string} excludeUserId - User ID to exclude from uniqueness check
   * @returns {Promise<object>} - Validation result
   */
  static async validateEmail(email, excludeUserId = null) {
    if (excludeUserId) {
      return await ValidateEmail.validateForUpdate(email, excludeUserId);
    }
    return await ValidateEmail.validateForCreation(email);
  }

  /**
   * Validate username format and uniqueness
   * @param {string} username - Username to validate
   * @param {string} excludeUserId - User ID to exclude from uniqueness check
   * @returns {Promise<object>} - Validation result
   */
  static async validateUsername(username, excludeUserId = null) {
    if (excludeUserId) {
      return await ValidateUsername.validateForUpdate(username, excludeUserId);
    }
    return await ValidateUsername.validateForCreation(username);
  }

  /**
   * Validate password strength
   * @param {string} password - Password to validate
   * @returns {object} - Validation result
   */
  static validatePassword(password) {
    return ValidatePassword.validateStrength(password);
  }

  /**
   * Validate credentials for login
   * @param {object} credentials - Login credentials
   * @returns {object} - Validation result
   */
  static validateCredentials(credentials) {
    return ValidateCredentials.validateLoginCredentials(credentials);
  }

  // === UTILITY METHODS ===

  /**
   * Sanitize user data (remove sensitive fields)
   * @param {object} user - User object to sanitize
   * @returns {object} - Sanitized user object
   */
  static sanitizeUser(user) {
    return SanitizeUserData.sanitizeUser(user);
  }

  /**
   * Sanitize multiple users
   * @param {Array} users - Array of user objects
   * @returns {Array} - Array of sanitized user objects
   */
  static sanitizeUsers(users) {
    return SanitizeUserData.sanitizeUsers(users);
  }

  /**
   * Get user count
   * @returns {Promise<number>} - Total number of users
   */
  static async getCount() {
    return await ReadUser.getCount();
  }

  /**
   * Get table name
   * @returns {string} - Table name
   */
  static getTableName() {
    return UserBase.getTableName();
  }
}

export default User; 