import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import User from '../User.js';
import AuthenticateUser from '../services/AuthenticateUser.js';

// Mock the AuthenticateUser service
vi.mock('../services/AuthenticateUser.js');

describe('User Authentication Tests (TDD Plan)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('authenticate user', () => {
    it('should successfully authenticate user with valid credentials', async () => {
      const email = 'test@example.com';
      const passwordHash = 'correct_password_hash';

      const expectedResult = {
        success: true,
        user: {
          id: 'user-123',
          username: 'testuser',
          email: 'test@example.com',
          age: 25,
          created_at: '2024-01-01T00:00:00.000Z',
          updated_at: '2024-01-01T00:00:00.000Z'
        }
      };

      AuthenticateUser.authenticate.mockResolvedValue(expectedResult);

      const result = await User.authenticate(email, passwordHash);

      expect(AuthenticateUser.authenticate).toHaveBeenCalledWith(email, passwordHash);
      expect(result.success).toBe(true);
      expect(result.user).toBeDefined();
      expect(result.user.id).toBe('user-123');
      expect(result.user.email).toBe(email);
      // Password hash should not be in response
      expect(result.user.password_hash).toBeUndefined();
    });

    it('should fail authentication with invalid password', async () => {
      const email = 'test@example.com';
      const passwordHash = 'wrong_password_hash';

      const expectedResult = {
        success: false,
        errors: ['Invalid credentials']
      };

      AuthenticateUser.authenticate.mockResolvedValue(expectedResult);

      const result = await User.authenticate(email, passwordHash);

      expect(AuthenticateUser.authenticate).toHaveBeenCalledWith(email, passwordHash);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Invalid credentials');
    });

    it('should fail authentication with non-existent email', async () => {
      const email = 'nonexistent@example.com';
      const passwordHash = 'any_password_hash';

      const expectedResult = {
        success: false,
        errors: ['User not found']
      };

      AuthenticateUser.authenticate.mockResolvedValue(expectedResult);

      const result = await User.authenticate(email, passwordHash);

      expect(AuthenticateUser.authenticate).toHaveBeenCalledWith(email, passwordHash);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('User not found');
    });

    it('should fail authentication with empty credentials', async () => {
      const email = '';
      const passwordHash = '';

      const expectedResult = {
        success: false,
        errors: ['Email is required', 'Password is required']
      };

      AuthenticateUser.authenticate.mockResolvedValue(expectedResult);

      const result = await User.authenticate(email, passwordHash);

      expect(AuthenticateUser.authenticate).toHaveBeenCalledWith(email, passwordHash);
      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should fail authentication with inactive user account', async () => {
      const email = 'inactive@example.com';
      const passwordHash = 'correct_password_hash';

      const expectedResult = {
        success: false,
        errors: ['Account is inactive']
      };

      AuthenticateUser.authenticate.mockResolvedValue(expectedResult);

      const result = await User.authenticate(email, passwordHash);

      expect(AuthenticateUser.authenticate).toHaveBeenCalledWith(email, passwordHash);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Account is inactive');
    });
  });

  describe('verify credentials', () => {
    it('should verify valid credentials', async () => {
      const email = 'test@example.com';
      const passwordHash = 'correct_password_hash';

      const expectedResult = {
        success: true,
        valid: true,
        user: {
          id: 'user-123',
          username: 'testuser',
          email: 'test@example.com'
        }
      };

      AuthenticateUser.verifyCredentials.mockResolvedValue(expectedResult);

      const result = await User.verifyCredentials(email, passwordHash);

      expect(AuthenticateUser.verifyCredentials).toHaveBeenCalledWith(email, passwordHash);
      expect(result.success).toBe(true);
      expect(result.valid).toBe(true);
      expect(result.user).toBeDefined();
    });

    it('should reject invalid credentials', async () => {
      const email = 'test@example.com';
      const passwordHash = 'wrong_password_hash';

      const expectedResult = {
        success: true,
        valid: false,
        user: null
      };

      AuthenticateUser.verifyCredentials.mockResolvedValue(expectedResult);

      const result = await User.verifyCredentials(email, passwordHash);

      expect(AuthenticateUser.verifyCredentials).toHaveBeenCalledWith(email, passwordHash);
      expect(result.success).toBe(true);
      expect(result.valid).toBe(false);
      expect(result.user).toBeNull();
    });
  });

  describe('check user status', () => {
    it('should return user status for existing email', async () => {
      const email = 'test@example.com';

      const expectedResult = {
        success: true,
        exists: true,
        active: true,
        user: {
          id: 'user-123',
          email: 'test@example.com',
          username: 'testuser'
        }
      };

      AuthenticateUser.checkUserStatus.mockResolvedValue(expectedResult);

      const result = await User.checkUserStatus(email);

      expect(AuthenticateUser.checkUserStatus).toHaveBeenCalledWith(email);
      expect(result.success).toBe(true);
      expect(result.exists).toBe(true);
      expect(result.active).toBe(true);
    });

    it('should return status for non-existent email', async () => {
      const email = 'nonexistent@example.com';

      const expectedResult = {
        success: true,
        exists: false,
        active: false,
        user: null
      };

      AuthenticateUser.checkUserStatus.mockResolvedValue(expectedResult);

      const result = await User.checkUserStatus(email);

      expect(AuthenticateUser.checkUserStatus).toHaveBeenCalledWith(email);
      expect(result.success).toBe(true);
      expect(result.exists).toBe(false);
      expect(result.active).toBe(false);
      expect(result.user).toBeNull();
    });

    it('should return status for inactive user', async () => {
      const email = 'inactive@example.com';

      const expectedResult = {
        success: true,
        exists: true,
        active: false,
        user: {
          id: 'user-123',
          email: 'inactive@example.com',
          username: 'inactiveuser'
        }
      };

      AuthenticateUser.checkUserStatus.mockResolvedValue(expectedResult);

      const result = await User.checkUserStatus(email);

      expect(AuthenticateUser.checkUserStatus).toHaveBeenCalledWith(email);
      expect(result.success).toBe(true);
      expect(result.exists).toBe(true);
      expect(result.active).toBe(false);
    });
  });
}); 