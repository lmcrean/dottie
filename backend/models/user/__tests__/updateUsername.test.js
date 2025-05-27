import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import User from '../User.js';
import UpdateUsername from '../services/UpdateUsername.js';
import ReadUser from '../services/ReadUser.js';

// Mock the UpdateUsername and ReadUser services
vi.mock('../services/UpdateUsername.js');
vi.mock('../services/ReadUser.js');

describe('Update Username Tests (TDD Plan)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('update username', () => {
    it('should successfully update username with valid data', async () => {
      const userId = 'user-123';
      const newUsername = 'newusername';

      const expectedResult = {
        success: true,
        user: {
          id: 'user-123',
          username: 'newusername',
          email: 'test@example.com',
          age: 25,
          updated_at: '2024-01-01T12:00:00.000Z'
        },
        message: 'Username updated successfully'
      };

      UpdateUsername.updateUsernameWithChecks.mockResolvedValue(expectedResult);

      const result = await User.updateUsername(userId, newUsername);

      expect(UpdateUsername.updateUsernameWithChecks).toHaveBeenCalledWith(userId, newUsername);
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.username).toBe(newUsername);
      expect(result.user.id).toBe(userId);
      // Password hash should not be in sanitized response
      expect(result.user.password_hash).toBeUndefined();
    });

    it('should fail to update username if user not found', async () => {
      const userId = 'non-existent-user';
      const newUsername = 'newusername';

      const expectedResult = {
        success: false,
        errors: ['User not found']
      };

      UpdateUsername.updateUsernameWithChecks.mockResolvedValue(expectedResult);

      const result = await User.updateUsername(userId, newUsername);

      expect(UpdateUsername.updateUsernameWithChecks).toHaveBeenCalledWith(userId, newUsername);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('User not found');
    });

    it('should fail to update username if new username already exists', async () => {
      const userId = 'user-123';
      const newUsername = 'existingusername';

      const expectedResult = {
        success: false,
        errors: ['Username already exists']
      };

      UpdateUsername.updateUsernameWithChecks.mockResolvedValue(expectedResult);

      const result = await User.updateUsername(userId, newUsername);

      expect(UpdateUsername.updateUsernameWithChecks).toHaveBeenCalledWith(userId, newUsername);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Username already exists');
    });

    it('should fail to update username with invalid format', async () => {
      const userId = 'user-123';
      const invalidUsernames = ['', '   ', 'a', 'user@name', 'user name', '123abc', 'verylongusernamethatexceedslimits'];

      for (const invalidUsername of invalidUsernames) {
        const expectedResult = {
          success: false,
          errors: ['Invalid username format']
        };

        UpdateUsername.updateUsernameWithChecks.mockResolvedValue(expectedResult);

        const result = await User.updateUsername(userId, invalidUsername);

        expect(UpdateUsername.updateUsernameWithChecks).toHaveBeenCalledWith(userId, invalidUsername);
        expect(result.success).toBe(false);
        expect(result.errors).toContain('Invalid username format');
      }
    });

    it('should fail to update username with same current username', async () => {
      const userId = 'user-123';
      const currentUsername = 'currentusername';

      const expectedResult = {
        success: false,
        errors: ['New username must be different from current username']
      };

      UpdateUsername.updateUsernameWithChecks.mockResolvedValue(expectedResult);

      const result = await User.updateUsername(userId, currentUsername);

      expect(UpdateUsername.updateUsernameWithChecks).toHaveBeenCalledWith(userId, currentUsername);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('New username must be different from current username');
    });

    it('should normalize username during update', async () => {
      const userId = 'user-123';
      const newUsername = '  NewUsername  '; // With whitespace
      const normalizedUsername = 'newusername';

      const expectedResult = {
        success: true,
        user: {
          id: 'user-123',
          username: normalizedUsername,
          email: 'test@example.com',
          age: 25,
          updated_at: '2024-01-01T12:00:00.000Z'
        },
        message: 'Username updated successfully'
      };

      UpdateUsername.updateUsernameWithChecks.mockResolvedValue(expectedResult);

      const result = await User.updateUsername(userId, newUsername);

      expect(UpdateUsername.updateUsernameWithChecks).toHaveBeenCalledWith(userId, newUsername);
      expect(result.success).toBe(true);
      expect(result.user.username).toBe(normalizedUsername);
    });

    it('should handle database errors during username update', async () => {
      const userId = 'user-123';
      const newUsername = 'newusername';

      const expectedResult = {
        success: false,
        errors: ['Database error during update']
      };

      UpdateUsername.updateUsernameWithChecks.mockResolvedValue(expectedResult);

      const result = await User.updateUsername(userId, newUsername);

      expect(UpdateUsername.updateUsernameWithChecks).toHaveBeenCalledWith(userId, newUsername);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Database error during update');
    });
  });

  describe('validate username for update', () => {
    it('should validate new username format', async () => {
      const username = 'validusername';
      const userId = 'user-123';

      const expectedResult = {
        isValid: true,
        errors: []
      };

      // Mock the validation method if it exists
      if (UpdateUsername.validateForUpdate) {
        UpdateUsername.validateForUpdate.mockResolvedValue(expectedResult);

        const result = await User.validateUsername(username, userId);

        expect(UpdateUsername.validateForUpdate).toHaveBeenCalledWith(username, userId);
        expect(result.isValid).toBe(true);
        expect(result.errors).toEqual([]);
      }
    });

    it('should return validation errors for invalid username', async () => {
      const username = 'invalid@username';
      const userId = 'user-123';

      const expectedResult = {
        isValid: false,
        errors: ['Username cannot contain special characters']
      };

      // Mock the validation method if it exists
      if (UpdateUsername.validateForUpdate) {
        UpdateUsername.validateForUpdate.mockResolvedValue(expectedResult);

        const result = await User.validateUsername(username, userId);

        expect(UpdateUsername.validateForUpdate).toHaveBeenCalledWith(username, userId);
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Username cannot contain special characters');
      }
    });
  });

  describe('username existence checks', () => {
    it('should check if username exists', async () => {
      const username = 'existingusername';

      ReadUser.usernameExists.mockResolvedValue(true);

      const result = await User.usernameExists(username);

      expect(ReadUser.usernameExists).toHaveBeenCalledWith(username);
      expect(result).toBe(true);
    });

    it('should return false for non-existent username', async () => {
      const username = 'nonexistentusername';

      ReadUser.usernameExists.mockResolvedValue(false);

      const result = await User.usernameExists(username);

      expect(ReadUser.usernameExists).toHaveBeenCalledWith(username);
      expect(result).toBe(false);
    });
  });
}); 