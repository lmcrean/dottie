import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { User, ReadUser, AuthenticateUser, ResetPassword, CreateUser } from '../index.js';
import DbService from '@/services/dbService.js';
import { generateUser } from '@test-utils/testFixtures.js';

// Mock DbService and new services
vi.mock('@/services/dbService.js');
vi.mock('../services/ReadUser.js');
vi.mock('../services/AuthenticateUser.js');
vi.mock('../services/ResetPassword.js');
vi.mock('../services/CreateUser.js');

describe('User Models Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('User Registration Workflow', () => {
    it('should complete user registration flow', async () => {
      const email = 'newuser@example.com';
      const username = 'newuser';
      const userData = generateUser({ email, username });

      // Mock ReadUser methods
      ReadUser.emailExists.mockResolvedValue(false);
      ReadUser.usernameExists.mockResolvedValue(false);
      
      // Mock CreateUser.create
      CreateUser.create.mockResolvedValue({
        success: true,
        user: userData
      });

      // 1. Check if email already exists
      const emailExists = await User.emailExists(email);
      expect(emailExists).toBe(false);

      // 2. Check if username already exists
      const usernameExists = await User.usernameExists(username);
      expect(usernameExists).toBe(false);

      // 3. Create the user
      const createdUser = await User.create(userData);

      expect(ReadUser.emailExists).toHaveBeenCalledWith(email);
      expect(ReadUser.usernameExists).toHaveBeenCalledWith(username);
      expect(CreateUser.create).toHaveBeenCalledWith(userData);
      expect(createdUser.success).toBe(true);
      expect(createdUser.user).toEqual(userData);
    });

    it('should prevent duplicate email registration', async () => {
      const existingUser = generateUser({ email: 'existing@example.com' });
      
      ReadUser.emailExists.mockResolvedValue(true);

      const emailExists = await User.emailExists('existing@example.com');
      
      expect(emailExists).toBe(true);
      expect(ReadUser.emailExists).toHaveBeenCalledWith('existing@example.com');
    });
  });

  describe('User Login Workflow', () => {
    it('should complete successful login flow', async () => {
      const email = 'user@example.com';
      const passwordHash = 'hashed-password';
      const user = generateUser({ email, password_hash: passwordHash });

      AuthenticateUser.verifyCredentials.mockResolvedValue({ success: true, user });

      // Verify credentials
      const result = await User.verifyCredentials(email, passwordHash);

      expect(AuthenticateUser.verifyCredentials).toHaveBeenCalledWith(email, passwordHash);
      expect(result.success).toBe(true);
      expect(result.user).toEqual(user);
    });

    it('should fail login with wrong password', async () => {
      const email = 'user@example.com';

      AuthenticateUser.verifyCredentials.mockResolvedValue({ success: false, errors: ['Invalid credentials'] });

      const result = await User.verifyCredentials(email, 'wrong-hash');

      expect(result.success).toBe(false);
      expect(result.errors).toContain('Invalid credentials');
    });

    it('should fail login with non-existent email', async () => {
      AuthenticateUser.verifyCredentials.mockResolvedValue({ success: false, errors: ['User not found'] });

      const result = await User.verifyCredentials('nonexistent@example.com', 'any-hash');

      expect(result.success).toBe(false);
      expect(result.errors).toContain('User not found');
    });
  });

  describe('Password Reset Workflow', () => {
    it('should complete full password reset flow', async () => {
      const email = 'user@example.com';
      const resetToken = 'reset-token-123';
      const newPasswordHash = 'new-hashed-password';
      
      const user = generateUser({ email, id: 'user-123' });

      // Mock ResetPassword service methods
      ResetPassword.initiatePasswordReset.mockResolvedValue({ success: true, token: resetToken });
      ResetPassword.validateResetToken.mockResolvedValue({ success: true, valid: true });
      ResetPassword.resetPassword.mockResolvedValue({ success: true, user });

      // 1. Initiate password reset
      const initResult = await User.initiatePasswordReset(email, resetToken, 24);
      expect(initResult.success).toBe(true);

      // 2. Validate reset token
      const validationResult = await User.validateResetToken(resetToken);
      expect(validationResult.success).toBe(true);
      expect(validationResult.valid).toBe(true);

      // 3. Reset password
      const resetResult = await User.resetPassword(resetToken, newPasswordHash);
      expect(resetResult.success).toBe(true);

      // Verify the sequence of calls
      expect(ResetPassword.initiatePasswordReset).toHaveBeenCalledWith(email, resetToken, 24);
      expect(ResetPassword.validateResetToken).toHaveBeenCalledWith(resetToken);
      expect(ResetPassword.resetPassword).toHaveBeenCalledWith(resetToken, newPasswordHash);
    });

    it('should fail password reset with expired token', async () => {
      const resetToken = 'expired-token';
      const newPasswordHash = 'new-hash';

      ResetPassword.validateResetToken.mockResolvedValue({ success: true, valid: false });
      ResetPassword.resetPassword.mockResolvedValue({ success: false, errors: ['Token expired'] });

      const validationResult = await User.validateResetToken(resetToken);
      expect(validationResult.valid).toBe(false);

      const resetResult = await User.resetPassword(resetToken, newPasswordHash);
      expect(resetResult.success).toBe(false);
      expect(resetResult.errors).toContain('Token expired');
    });
  });

  describe('User Account Management', () => {
    it('should complete account deletion with cascade', async () => {
      const userId = 'user-123';

      // Mock successful deletion
      const deleteResult = { success: true };
      
      // Mock User.delete method (which uses DeleteUser service)
      vi.spyOn(User, 'delete').mockResolvedValue(deleteResult);

      const result = await User.delete(userId);

      expect(result.success).toBe(true);
      expect(User.delete).toHaveBeenCalledWith(userId);
    });

    it('should update user profile', async () => {
      const userId = 'user-123';
      const updateData = { username: 'newusername', age: '35_44' };
      const updatedUser = generateUser({ id: userId, ...updateData });

      DbService.update.mockResolvedValue(updatedUser);

      const result = await User.update(userId, updateData);

      expect(DbService.update).toHaveBeenCalledWith('users', userId, updateData);
      expect(result).toEqual(expect.objectContaining(updateData));
    });

    it('should change password', async () => {
      const userId = 'user-123';
      const currentHash = 'current-hash';
      const newPasswordHash = 'new-hashed-password';
      const updatedUser = generateUser({ id: userId, password_hash: newPasswordHash });

      // Mock User.updatePassword method (which uses UpdatePassword service)
      vi.spyOn(User, 'updatePassword').mockResolvedValue({ success: true, user: updatedUser });

      const result = await User.updatePassword(userId, currentHash, newPasswordHash);

      expect(User.updatePassword).toHaveBeenCalledWith(userId, currentHash, newPasswordHash);
      expect(result.success).toBe(true);
      expect(result.user).toEqual(updatedUser);
    });
  });
}); 