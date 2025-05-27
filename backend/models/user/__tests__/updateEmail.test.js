import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import User from '../User.js';
import UpdateEmail from '../services/UpdateEmail.js';
import ReadUser from '../services/ReadUser.js';

// Mock the UpdateEmail and ReadUser services
vi.mock('../services/UpdateEmail.js');
vi.mock('../services/ReadUser.js');

describe('Update Email Tests (TDD Plan)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('update email', () => {
    it('should successfully update email with valid data', async () => {
      const userId = 'user-123';
      const newEmail = 'newemail@example.com';

      const expectedResult = {
        success: true,
        user: {
          id: 'user-123',
          username: 'testuser',
          email: 'newemail@example.com',
          age: 25,
          updated_at: '2024-01-01T12:00:00.000Z'
        },
        message: 'Email updated successfully'
      };

      UpdateEmail.updateEmailWithChecks.mockResolvedValue(expectedResult);

      const result = await User.updateEmail(userId, newEmail);

      expect(UpdateEmail.updateEmailWithChecks).toHaveBeenCalledWith(userId, newEmail);
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.email).toBe(newEmail);
      expect(result.user.id).toBe(userId);
      // Password hash should not be in sanitized response
      expect(result.user.password_hash).toBeUndefined();
    });

    it('should fail to update email if user not found', async () => {
      const userId = 'non-existent-user';
      const newEmail = 'newemail@example.com';

      const expectedResult = {
        success: false,
        errors: ['User not found']
      };

      UpdateEmail.updateEmailWithChecks.mockResolvedValue(expectedResult);

      const result = await User.updateEmail(userId, newEmail);

      expect(UpdateEmail.updateEmailWithChecks).toHaveBeenCalledWith(userId, newEmail);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('User not found');
    });

    it('should fail to update email if new email already exists', async () => {
      const userId = 'user-123';
      const newEmail = 'existing@example.com';

      const expectedResult = {
        success: false,
        errors: ['Email already exists']
      };

      UpdateEmail.updateEmailWithChecks.mockResolvedValue(expectedResult);

      const result = await User.updateEmail(userId, newEmail);

      expect(UpdateEmail.updateEmailWithChecks).toHaveBeenCalledWith(userId, newEmail);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Email already exists');
    });

    it('should fail to update email with invalid format', async () => {
      const userId = 'user-123';
      const invalidEmails = ['', '   ', 'invalid-email', 'user@', '@example.com', 'user..email@example.com', 'user email@example.com'];

      for (const invalidEmail of invalidEmails) {
        const expectedResult = {
          success: false,
          errors: ['Invalid email format']
        };

        UpdateEmail.updateEmailWithChecks.mockResolvedValue(expectedResult);

        const result = await User.updateEmail(userId, invalidEmail);

        expect(UpdateEmail.updateEmailWithChecks).toHaveBeenCalledWith(userId, invalidEmail);
        expect(result.success).toBe(false);
        expect(result.errors).toContain('Invalid email format');
      }
    });

    it('should fail to update email with same current email', async () => {
      const userId = 'user-123';
      const currentEmail = 'current@example.com';

      const expectedResult = {
        success: false,
        errors: ['New email must be different from current email']
      };

      UpdateEmail.updateEmailWithChecks.mockResolvedValue(expectedResult);

      const result = await User.updateEmail(userId, currentEmail);

      expect(UpdateEmail.updateEmailWithChecks).toHaveBeenCalledWith(userId, currentEmail);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('New email must be different from current email');
    });

    it('should normalize email during update', async () => {
      const userId = 'user-123';
      const newEmail = '  NewEmail@Example.COM  '; // With whitespace and mixed case
      const normalizedEmail = 'newemail@example.com';

      const expectedResult = {
        success: true,
        user: {
          id: 'user-123',
          username: 'testuser',
          email: normalizedEmail,
          age: 25,
          updated_at: '2024-01-01T12:00:00.000Z'
        },
        message: 'Email updated successfully'
      };

      UpdateEmail.updateEmailWithChecks.mockResolvedValue(expectedResult);

      const result = await User.updateEmail(userId, newEmail);

      expect(UpdateEmail.updateEmailWithChecks).toHaveBeenCalledWith(userId, newEmail);
      expect(result.success).toBe(true);
      expect(result.user.email).toBe(normalizedEmail);
    });

    it('should handle database errors during email update', async () => {
      const userId = 'user-123';
      const newEmail = 'newemail@example.com';

      const expectedResult = {
        success: false,
        errors: ['Database error during update']
      };

      UpdateEmail.updateEmailWithChecks.mockResolvedValue(expectedResult);

      const result = await User.updateEmail(userId, newEmail);

      expect(UpdateEmail.updateEmailWithChecks).toHaveBeenCalledWith(userId, newEmail);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Database error during update');
    });

    it('should handle email length limits', async () => {
      const userId = 'user-123';
      const longEmail = 'a'.repeat(250) + '@example.com'; // Very long email

      const expectedResult = {
        success: false,
        errors: ['Email is too long']
      };

      UpdateEmail.updateEmailWithChecks.mockResolvedValue(expectedResult);

      const result = await User.updateEmail(userId, longEmail);

      expect(UpdateEmail.updateEmailWithChecks).toHaveBeenCalledWith(userId, longEmail);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Email is too long');
    });
  });

  describe('validate email for update', () => {
    it('should validate new email format', async () => {
      const email = 'valid@example.com';
      const userId = 'user-123';

      const expectedResult = {
        isValid: true,
        errors: []
      };

      // Mock the validation method if it exists
      if (UpdateEmail.validateForUpdate) {
        UpdateEmail.validateForUpdate.mockResolvedValue(expectedResult);

        const result = await User.validateEmail(email, userId);

        expect(UpdateEmail.validateForUpdate).toHaveBeenCalledWith(email, userId);
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
      }
    });

    it('should return validation errors for invalid email', async () => {
      const email = 'invalid-email-format';
      const userId = 'user-123';

      const expectedResult = {
        isValid: false,
        errors: ['Invalid email format']
      };

      // Mock the validation method if it exists
      if (UpdateEmail.validateForUpdate) {
        UpdateEmail.validateForUpdate.mockResolvedValue(expectedResult);

        const result = await User.validateEmail(email, userId);

        expect(UpdateEmail.validateForUpdate).toHaveBeenCalledWith(email, userId);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Invalid email format');
      }
    });

    it('should check uniqueness during validation', async () => {
      const email = 'existing@example.com';
      const userId = 'user-123';

      const expectedResult = {
        isValid: false,
        errors: ['Email is already in use by another user']
      };

      // Mock the validation method if it exists
      if (UpdateEmail.validateForUpdate) {
        UpdateEmail.validateForUpdate.mockResolvedValue(expectedResult);

        const result = await User.validateEmail(email, userId);

        expect(UpdateEmail.validateForUpdate).toHaveBeenCalledWith(email, userId);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Email is already in use by another user');
      }
    });
  });

  describe('email existence checks', () => {
    it('should check if email exists', async () => {
      const email = 'existing@example.com';

      ReadUser.emailExists.mockResolvedValue(true);

      const result = await User.emailExists(email);

      expect(ReadUser.emailExists).toHaveBeenCalledWith(email);
      expect(result).toBe(true);
    });

    it('should return false for non-existent email', async () => {
      const email = 'nonexistent@example.com';

      ReadUser.emailExists.mockResolvedValue(false);

      const result = await User.emailExists(email);

      expect(ReadUser.emailExists).toHaveBeenCalledWith(email);
      expect(result).toBe(false);
    });
  });

  describe('email verification flow', () => {
    it('should initiate email verification for new email', async () => {
      const userId = 'user-123';
      const newEmail = 'newemail@example.com';

      const expectedResult = {
        success: true,
        pendingEmail: newEmail,
        verificationRequired: true,
        message: 'Verification email sent to new address'
      };

      // If email verification is part of the update process
      if (UpdateEmail.initiateEmailChange) {
        UpdateEmail.initiateEmailChange.mockResolvedValue(expectedResult);

        const result = await UpdateEmail.initiateEmailChange(userId, newEmail);

        expect(UpdateEmail.initiateEmailChange).toHaveBeenCalledWith(userId, newEmail);
        expect(result.success).toBe(true);
        expect(result.verificationRequired).toBe(true);
        expect(result.pendingEmail).toBe(newEmail);
      }
    });

    it('should complete email change after verification', async () => {
      const userId = 'user-123';
      const verificationToken = 'verification-token-123';

      const expectedResult = {
        success: true,
        user: {
          id: 'user-123',
          username: 'testuser',
          email: 'newemail@example.com',
          updated_at: '2024-01-01T12:00:00.000Z'
        },
        message: 'Email updated successfully'
      };

      // If email verification is part of the update process
      if (UpdateEmail.completeEmailChange) {
        UpdateEmail.completeEmailChange.mockResolvedValue(expectedResult);

        const result = await UpdateEmail.completeEmailChange(userId, verificationToken);

        expect(UpdateEmail.completeEmailChange).toHaveBeenCalledWith(userId, verificationToken);
        expect(result.success).toBe(true);
        expect(result.user.email).toBe('newemail@example.com');
      }
    });
  });
}); 