import { TestRequestBody, TestOptions, MockResponse, TestUserOverrides, TestCycleOverrides, TestSymptomOverrides, TestAssessmentOverrides } from '../types/common';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import UserPasswordReset from '';
import DbService from '';
import UserAuth from '';
import { generateUser } from '';

// Mock dependencies
vi.mock('@/services/dbService.ts');
vi.mock('../UserAuth.ts');

describe('UserPasswordReset Model', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('storeResetToken', () => {
    it('should store reset token for existing user', async () => {
      const email = 'test@example.com';
      const resetToken = 'reset-token-123';
      const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
      const user = generateUser({ email, id: 'user-123' });
      const updatedUser = { ...user, reset_token: resetToken, reset_token_expires: expiresAt };

      UserAuth.findByEmail.mockResolvedValue(user);
      DbService.update.mockResolvedValue(updatedUser);

      const result = await UserPasswordReset.storeResetToken(email, resetToken, expiresAt);

      expect(UserAuth.findByEmail).toHaveBeenCalledWith(email);
      expect(DbService.update).toHaveBeenCalledWith('users', user.id, {
        reset_token: resetToken,
        reset_token_expires: expiresAt
      });
      expect(result).toEqual(updatedUser);
    });

    it('should return null when user does not exist', async () => {
      const email = 'nonexistent@example.com';
      const resetToken = 'reset-token-123';
      const expiresAt = new Date();

      UserAuth.findByEmail.mockResolvedValue(null);

      const result = await UserPasswordReset.storeResetToken(email, resetToken, expiresAt);

      expect(UserAuth.findByEmail).toHaveBeenCalledWith(email);
      expect(DbService.update).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('findByResetToken', () => {
    it('should find user by valid reset token', async () => {
      const resetToken = 'valid-token';
      const futureDate = new Date(Date.now() + 3600000); // 1 hour from now
      const user = generateUser({ 
        reset_token: resetToken, 
        reset_token_expires: futureDate 
      });

      DbService.findBy.mockResolvedValue([user]);

      const result = await UserPasswordReset.findByResetToken(resetToken);

      expect(DbService.findBy).toHaveBeenCalledWith('users', 'reset_token', resetToken);
      expect(result).toEqual(user);
    });

    it('should return null when no user found with token', async () => {
      const resetToken = 'nonexistent-token';

      DbService.findBy.mockResolvedValue([]);

      const result = await UserPasswordReset.findByResetToken(resetToken);

      expect(result).toBeNull();
    });

    it('should return null when token is expired', async () => {
      const resetToken = 'expired-token';
      const pastDate = new Date(Date.now() - 3600000); // 1 hour ago
      const user = {
        ...generateUser(), 
        reset_token: resetToken, 
        reset_token_expires: pastDate 
      };

      DbService.findBy.mockResolvedValue([user]);

      const result = await UserPasswordReset.findByResetToken(resetToken);

      expect(result).toBeNull();
    });

    it('should return user when token has no expiration date', async () => {
      const resetToken = 'no-expiry-token';
      const user = generateUser({ 
        reset_token: resetToken, 
        reset_token_expires: null 
      });

      DbService.findBy.mockResolvedValue([user]);

      const result = await UserPasswordReset.findByResetToken(resetToken);

      expect(result).toEqual(user);
    });
  });

  describe('clearResetToken', () => {
    it('should clear reset token for user', async () => {
      const userId = 'user-123';
      const updatedUser = generateUser({ 
        id: userId, 
        reset_token: null, 
        reset_token_expires: null 
      });

      DbService.update.mockResolvedValue(updatedUser);

      const result = await UserPasswordReset.clearResetToken(userId);

      expect(DbService.update).toHaveBeenCalledWith('users', userId, {
        reset_token: null,
        reset_token_expires: null
      });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('resetPassword', () => {
    it('should reset password with valid token', async () => {
      const resetToken = 'valid-token';
      const newPasswordHash = 'new-password-hash';
      const futureDate = new Date(Date.now() + 3600000);
      const user = generateUser({ 
        id: 'user-123',
        reset_token: resetToken, 
        reset_token_expires: futureDate 
      });

      // Mock the findByResetToken call
      DbService.findBy.mockResolvedValue([user]);
      
      // Mock UserAuth.updatePassword
      UserAuth.updatePassword.mockResolvedValue({ success: true });
      
      // Mock clearResetToken
      DbService.update.mockResolvedValue(user);

      const result = await UserPasswordReset.resetPassword(resetToken, newPasswordHash);

      expect(UserAuth.updatePassword).toHaveBeenCalledWith(user.id, newPasswordHash);
      expect(DbService.update).toHaveBeenCalledWith('users', user.id, {
        reset_token: null,
        reset_token_expires: null
      });
      expect(result).toEqual(user);
    });

    it('should return null for invalid token', async () => {
      const resetToken = 'invalid-token';
      const newPasswordHash = 'new-password-hash';

      DbService.findBy.mockResolvedValue([]);

      const result = await UserPasswordReset.resetPassword(resetToken, newPasswordHash);

      expect(UserAuth.updatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null for expired token', async () => {
      const resetToken = 'expired-token';
      const newPasswordHash = 'new-password-hash';
      const pastDate = new Date(Date.now() - 3600000);
      const user = {
        ...generateUser(), 
        reset_token: resetToken, 
        reset_token_expires: pastDate 
      };

      DbService.findBy.mockResolvedValue([user]);

      const result = await UserPasswordReset.resetPassword(resetToken, newPasswordHash);

      expect(UserAuth.updatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });

  describe('isValidResetToken', () => {
    it('should return true for valid token', async () => {
      const resetToken = 'valid-token';
      const futureDate = new Date(Date.now() + 3600000);
      const user = generateUser({ 
        reset_token: resetToken, 
        reset_token_expires: futureDate 
      });

      DbService.findBy.mockResolvedValue([user]);

      const result = await UserPasswordReset.isValidResetToken(resetToken);

      expect(result).toBe(true);
    });

    it('should return false for invalid token', async () => {
      const resetToken = 'invalid-token';

      DbService.findBy.mockResolvedValue([]);

      const result = await UserPasswordReset.isValidResetToken(resetToken);

      expect(result).toBe(false);
    });

    it('should return false for expired token', async () => {
      const resetToken = 'expired-token';
      const pastDate = new Date(Date.now() - 3600000);
      const user = {
        ...generateUser(), 
        reset_token: resetToken, 
        reset_token_expires: pastDate 
      };

      DbService.findBy.mockResolvedValue([user]);

      const result = await UserPasswordReset.isValidResetToken(resetToken);

      expect(result).toBe(false);
    });
  });

  describe('tableName', () => {
    it('should have correct table name', () => {
      expect(UserPasswordReset.tableName).toBe('users');
    });
  });
}); 

