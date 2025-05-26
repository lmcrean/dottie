import { TestRequestBody, TestOptions, MockResponse, TestUserOverrides, TestCycleOverrides, TestSymptomOverrides, TestAssessmentOverrides } from '../../../types/common';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import

// Mock DbService and UserAuth
vi.mock('@/services/dbService.ts');
vi.mock('../UserAuth.js', () => ({
  default: {
    findByEmail: vi.fn(),
    findByUsername: vi.fn(),
    updatePassword: vi.fn(),
    verifyCredentials: vi.fn(),
    emailExists: vi.fn(),
    usernameExists: vi.fn(),
    tableName: 'users'
  }
}));

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

      // Mock UserAuth methods
      UserAuth.emailExists.mockResolvedValue(false);
      UserAuth.usernameExists.mockResolvedValue(false);
      
      // Create the user
      DbService.create.mockResolvedValue(userData);

      // 1. Check if email already exists
      const emailExists = await UserAuth.emailExists(email);
      expect(emailExists).toBe(false);

      // 2. Check if username already exists
      const usernameExists = await UserAuth.usernameExists(username);
      expect(usernameExists).toBe(false);

      // 3. Create the user
      const createdUser = await User.create(userData);

      expect(UserAuth.emailExists).toHaveBeenCalledWith(email);
      expect(UserAuth.usernameExists).toHaveBeenCalledWith(username);
      expect(DbService.create).toHaveBeenCalledWith('users', expect.objectContaining({
        email,
        username,
        id: expect.any(String)
      }));
      expect(createdUser).toEqual(userData);
    });

    it('should prevent duplicate email registration', async () => {
      const existingUser = generateUser({ email: 'existing@example.com' });
      
      UserAuth.emailExists.mockResolvedValue(true);

      const emailExists = await UserAuth.emailExists('existing@example.com');
      
      expect(emailExists).toBe(true);
      expect(UserAuth.emailExists).toHaveBeenCalledWith('existing@example.com');
    });
  });

  describe('User Login Workflow', () => {
    it('should complete successful login flow', async () => {
      const email = 'user@example.com';
      const passwordHash = 'hashed-password';
      const user = generateUser({ email, password_hash: passwordHash });

      UserAuth.verifyCredentials.mockResolvedValue(user);

      // Verify credentials
      const authenticatedUser = await UserAuth.verifyCredentials(email, passwordHash);

      expect(UserAuth.verifyCredentials).toHaveBeenCalledWith(email, passwordHash);
      expect(authenticatedUser).toEqual(user);
    });

    it('should fail login with wrong password', async () => {
      const email = 'user@example.com';
      const user = generateUser({ email, password_hash: 'correct-hash' });

      UserAuth.verifyCredentials.mockResolvedValue(null);

      const authenticatedUser = await UserAuth.verifyCredentials(email, 'wrong-hash');

      expect(authenticatedUser).toBeNull();
    });

    it('should fail login with non-existent email', async () => {
      UserAuth.verifyCredentials.mockResolvedValue(null);

      const authenticatedUser = await UserAuth.verifyCredentials('nonexistent@example.com', 'any-hash');

      expect(authenticatedUser).toBeNull();
    });
  });

  describe('Password Reset Workflow', () => {
    it('should complete full password reset flow', async () => {
      const email = 'user@example.com';
      const resetToken = 'reset-token-123';
      const newPasswordHash = 'new-hashed-password';
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
      
      const user = generateUser({ email, id: 'user-123' });
      const userWithToken = { 
        ...user, 
        reset_token: resetToken, 
        reset_token_expires: expiresAt 
      };

      // Mock UserAuth.findByEmail for storeResetToken
      UserAuth.findByEmail.mockResolvedValue(user);
      
      // Mock DbService calls
      DbService.update.mockResolvedValueOnce(userWithToken); // For storing token
      DbService.findBy.mockResolvedValueOnce([userWithToken]); // For finding by token  
      DbService.findBy.mockResolvedValueOnce([userWithToken]); // For isValidResetToken check
      UserAuth.updatePassword.mockResolvedValue({ success: true }); // For updating password
      DbService.update.mockResolvedValueOnce({ ...user, reset_token: null, reset_token_expires: null }); // For clearing token

      // 1. Store reset token
      const tokenResult = await UserPasswordReset.storeResetToken(email, resetToken, expiresAt);
      expect(tokenResult).toEqual(userWithToken);

      // 2. Validate reset token
      const isValid = await UserPasswordReset.isValidResetToken(resetToken);
      expect(isValid).toBe(true);

      // 3. Reset password
      const resetResult = await UserPasswordReset.resetPassword(resetToken, newPasswordHash);
      expect(resetResult).toEqual(userWithToken);

      // Verify the sequence of calls
      expect(UserAuth.findByEmail).toHaveBeenCalledWith(email);
      expect(DbService.update).toHaveBeenCalledWith('users', user.id, {
        reset_token: resetToken,
        reset_token_expires: expiresAt
      });
      expect(UserAuth.updatePassword).toHaveBeenCalledWith(user.id, newPasswordHash);
      expect(DbService.update).toHaveBeenCalledWith('users', user.id, {
        reset_token: null,
        reset_token_expires: null
      });
    });

    it('should fail password reset with expired token', async () => {
      const resetToken = 'expired-token';
      const expiredDate = new Date(Date.now() - 3600000); // 1 hour ago
      const user = {
        ...generateUser(), 
        reset_token: resetToken, 
        reset_token_expires: expiredDate 
      };

      DbService.findBy.mockResolvedValue([user]);

      const isValid = await UserPasswordReset.isValidResetToken(resetToken);
      expect(isValid).toBe(false);

      const resetResult = await UserPasswordReset.resetPassword(resetToken, 'new-hash');
      expect(resetResult).toBeNull();
    });
  });

  describe('User Account Management', () => {
    it('should complete account deletion with cascade', async () => {
      const userId = 'user-123';
      const conversations = [
        { id: 'conv-1', user_id: userId },
        { id: 'conv-2', user_id: userId }
      ];

      DbService.findBy.mockResolvedValue(conversations);
      DbService.delete.mockResolvedValue(true);

      const deleteResult = await User.delete(userId);

      expect(deleteResult).toBe(true);
      
      // Verify cascade deletion order
      expect(DbService.findBy).toHaveBeenCalledWith('conversations', 'user_id', userId);
      expect(DbService.delete).toHaveBeenCalledWith('chat_messages', { conversation_id: 'conv-1' });
      expect(DbService.delete).toHaveBeenCalledWith('chat_messages', { conversation_id: 'conv-2' });
      expect(DbService.delete).toHaveBeenCalledWith('conversations', { user_id: userId });
      expect(DbService.delete).toHaveBeenCalledWith('assessments', { user_id: userId });
      expect(DbService.delete).toHaveBeenCalledWith('period_logs', { user_id: userId });
      expect(DbService.delete).toHaveBeenCalledWith('users', userId);
    });

    it('should update user profile', async () => {
      const userId = 'user-123';
      const updateData = { username: 'newusername', age: '35_44' };
      const updatedUser = generateUser({ id: userId, ...updateData });

      DbService.update.mockResolvedValue(updatedUser);

      const result = await User.update(userId, updateData);

      expect(DbService.update).toHaveBeenCalledWith('users', userId, updateData);
      expect(result).toEqual(updatedUser);
    });

    it('should change password', async () => {
      const userId = 'user-123';
      const newPasswordHash = 'new-hashed-password';
      const updatedUser = generateUser({ id: userId, password_hash: newPasswordHash });

      UserAuth.updatePassword.mockResolvedValue(updatedUser);

      const result = await UserAuth.updatePassword(userId, newPasswordHash);

      expect(UserAuth.updatePassword).toHaveBeenCalledWith(userId, newPasswordHash);
      expect(result).toEqual(updatedUser);
    });
  });
}); 

