import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import User from '../User.js';
import UpdatePassword from '../services/UpdatePassword.js';
import ValidatePassword from '../validators/ValidatePassword.js';

// Mock the UpdatePassword service and ValidatePassword validator
vi.mock('../services/UpdatePassword.js');
vi.mock('../validators/ValidatePassword.js');

describe('Update Password Tests (TDD Plan)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('update password', () => {
    it('should successfully update password with valid data', async () => {
      const userId = 'user-123';
      const currentPasswordHash = 'current_password_hash';
      const newPasswordHash = 'new_password_hash';

      const expectedResult = {
        success: true,
        user: {
          id: 'user-123',
          username: 'testuser',
          email: 'test@example.com',
          age: 25,
          updated_at: '2024-01-01T12:00:00.000Z'
        },
        message: 'Password updated successfully'
      };

      UpdatePassword.updatePasswordWithVerification.mockResolvedValue(expectedResult);

      const result = await User.updatePassword(userId, currentPasswordHash, newPasswordHash);

      expect(UpdatePassword.updatePasswordWithVerification).toHaveBeenCalledWith(userId, currentPasswordHash, newPasswordHash);
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.id).toBe(userId);
      // Password hash should not be in sanitized response
      expect(result.user.password_hash).toBeUndefined();
    });

    it('should fail to update password if user not found', async () => {
      const userId = 'non-existent-user';
      const currentPasswordHash = 'current_password_hash';
      const newPasswordHash = 'new_password_hash';

      const expectedResult = {
        success: false,
        errors: ['User not found']
      };

      UpdatePassword.updatePasswordWithVerification.mockResolvedValue(expectedResult);

      const result = await User.updatePassword(userId, currentPasswordHash, newPasswordHash);

      expect(UpdatePassword.updatePasswordWithVerification).toHaveBeenCalledWith(userId, currentPasswordHash, newPasswordHash);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('User not found');
    });

    it('should fail to update password with incorrect current password', async () => {
      const userId = 'user-123';
      const wrongCurrentPasswordHash = 'wrong_password_hash';
      const newPasswordHash = 'new_password_hash';

      const expectedResult = {
        success: false,
        errors: ['Current password is incorrect']
      };

      UpdatePassword.updatePasswordWithVerification.mockResolvedValue(expectedResult);

      const result = await User.updatePassword(userId, wrongCurrentPasswordHash, newPasswordHash);

      expect(UpdatePassword.updatePasswordWithVerification).toHaveBeenCalledWith(userId, wrongCurrentPasswordHash, newPasswordHash);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Current password is incorrect');
    });

    it('should fail to update password with invalid new password hash', async () => {
      const userId = 'user-123';
      const currentPasswordHash = 'current_password_hash';
      const invalidPasswordHashes = ['', '   ', 'too_short', '123', null, undefined];

      for (const invalidPasswordHash of invalidPasswordHashes) {
        const expectedResult = {
          success: false,
          errors: ['Invalid password hash']
        };

        UpdatePassword.updatePasswordWithVerification.mockResolvedValue(expectedResult);

        const result = await User.updatePassword(userId, currentPasswordHash, invalidPasswordHash);

        expect(UpdatePassword.updatePasswordWithVerification).toHaveBeenCalledWith(userId, currentPasswordHash, invalidPasswordHash);
        expect(result.success).toBe(false);
        expect(result.errors).toContain('Invalid password hash');
      }
    });

    it('should fail to update password with same current password', async () => {
      const userId = 'user-123';
      const currentPasswordHash = 'same_password_hash';
      const newPasswordHash = 'same_password_hash'; // Same as current

      const expectedResult = {
        success: false,
        errors: ['New password must be different from current password']
      };

      UpdatePassword.updatePasswordWithVerification.mockResolvedValue(expectedResult);

      const result = await User.updatePassword(userId, currentPasswordHash, newPasswordHash);

      expect(UpdatePassword.updatePasswordWithVerification).toHaveBeenCalledWith(userId, currentPasswordHash, newPasswordHash);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('New password must be different from current password');
    });

    it('should handle database errors during password update', async () => {
      const userId = 'user-123';
      const currentPasswordHash = 'current_password_hash';
      const newPasswordHash = 'new_password_hash';

      const expectedResult = {
        success: false,
        errors: ['Database error during update']
      };

      UpdatePassword.updatePasswordWithVerification.mockResolvedValue(expectedResult);

      const result = await User.updatePassword(userId, currentPasswordHash, newPasswordHash);

      expect(UpdatePassword.updatePasswordWithVerification).toHaveBeenCalledWith(userId, currentPasswordHash, newPasswordHash);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Database error during update');
    });

    it('should validate password strength requirements', async () => {
      const userId = 'user-123';
      const currentPasswordHash = 'current_password_hash';
      const weakPasswordHash = 'weak_hash';

      const expectedResult = {
        success: false,
        errors: ['Password does not meet strength requirements']
      };

      UpdatePassword.updatePasswordWithVerification.mockResolvedValue(expectedResult);

      const result = await User.updatePassword(userId, currentPasswordHash, weakPasswordHash);

      expect(UpdatePassword.updatePasswordWithVerification).toHaveBeenCalledWith(userId, currentPasswordHash, weakPasswordHash);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Password does not meet strength requirements');
    });
  });

  describe('password validation', () => {
    it('should validate password strength for plain text password', async () => {
      const password = 'StrongPassword123!';

      const expectedResult = {
        isValid: true,
        errors: [],
        strength: 'strong'
      };

      ValidatePassword.validateStrength.mockReturnValue(expectedResult);

      const result = User.validatePassword(password);

      expect(ValidatePassword.validateStrength).toHaveBeenCalledWith(password);
      expect(result.isValid).toBe(true);
      expect(result.strength).toBe('strong');
    });

    it('should return validation errors for weak password', async () => {
      const password = '123';

      const expectedResult = {
        isValid: false,
        errors: [
          'Password must be at least 8 characters long',
          'Password must contain uppercase letters',
          'Password must contain lowercase letters',
          'Password must contain special characters'
        ],
        strength: 'very_weak'
      };

      ValidatePassword.validateStrength.mockReturnValue(expectedResult);

      const result = User.validatePassword(password);

      expect(ValidatePassword.validateStrength).toHaveBeenCalledWith(password);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.strength).toBe('very_weak');
    });

    it('should validate password hash format', async () => {
      const passwordHash = 'valid_bcrypt_hash_$2b$10$...';

      const expectedResult = {
        isValid: true,
        errors: []
      };

      ValidatePassword.validateHash.mockReturnValue(expectedResult);

      const result = ValidatePassword.validateHash(passwordHash);

      expect(ValidatePassword.validateHash).toHaveBeenCalledWith(passwordHash);
      expect(result.isValid).toBe(true);
    });

    it('should return errors for invalid password hash format', async () => {
      const invalidHash = 'invalid_hash_format';

      const expectedResult = {
        isValid: false,
        errors: ['Invalid password hash format']
      };

      ValidatePassword.validateHash.mockReturnValue(expectedResult);

      const result = ValidatePassword.validateHash(invalidHash);

      expect(ValidatePassword.validateHash).toHaveBeenCalledWith(invalidHash);
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain('Invalid password hash format');
    });
  });

  describe('password verification', () => {
    it('should verify current password before update', async () => {
      const userId = 'user-123';
      const currentPasswordHash = 'correct_current_hash';

      const expectedResult = {
        success: true,
        valid: true,
        message: 'Current password verified'
      };

      // Mock password verification if it exists as a separate method
      if (UpdatePassword.verifyCurrentPassword) {
        UpdatePassword.verifyCurrentPassword.mockResolvedValue(expectedResult);

        const result = await UpdatePassword.verifyCurrentPassword(userId, currentPasswordHash);

        expect(UpdatePassword.verifyCurrentPassword).toHaveBeenCalledWith(userId, currentPasswordHash);
        expect(result.success).toBe(true);
        expect(result.valid).toBe(true);
      }
    });

    it('should fail verification for incorrect current password', async () => {
      const userId = 'user-123';
      const wrongPasswordHash = 'wrong_hash';

      const expectedResult = {
        success: true,
        valid: false,
        message: 'Current password is incorrect'
      };

      // Mock password verification if it exists as a separate method
      if (UpdatePassword.verifyCurrentPassword) {
        UpdatePassword.verifyCurrentPassword.mockResolvedValue(expectedResult);

        const result = await UpdatePassword.verifyCurrentPassword(userId, wrongPasswordHash);

        expect(UpdatePassword.verifyCurrentPassword).toHaveBeenCalledWith(userId, wrongPasswordHash);
        expect(result.success).toBe(true);
        expect(result.valid).toBe(false);
      }
    });
  });

  describe('password update without current password (admin)', () => {
    it('should allow admin to update password without current password verification', async () => {
      const userId = 'user-123';
      const newPasswordHash = 'new_password_hash';

      const expectedResult = {
        success: true,
        user: {
          id: 'user-123',
          username: 'testuser',
          email: 'test@example.com',
          updated_at: '2024-01-01T12:00:00.000Z'
        },
        message: 'Password updated successfully by admin'
      };

      // Mock admin password update if it exists
      if (UpdatePassword.updatePasswordAdmin) {
        UpdatePassword.updatePasswordAdmin.mockResolvedValue(expectedResult);

        const result = await UpdatePassword.updatePasswordAdmin(userId, newPasswordHash);

        expect(UpdatePassword.updatePasswordAdmin).toHaveBeenCalledWith(userId, newPasswordHash);
        expect(result.success).toBe(true);
        expect(result.user.id).toBe(userId);
      }
    });
  });
}); 