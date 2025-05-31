import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import User from '../User.js';
import ReadUser from '../services/ReadUser.js';

// Mock the ReadUser service
vi.mock('../services/ReadUser.js');

describe('Get User By ID Tests (TDD Plan)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('get user by id', () => {
    it('should successfully find user by valid ID', async () => {
      const userId = 'user-123';
      const expectedUser = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        age: 25,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z'
      };

      ReadUser.findById.mockResolvedValue(expectedUser);

      const result = await User.findById(userId);

      expect(ReadUser.findById).toHaveBeenCalledWith(userId, true);
      expect(result).toEqual(expectedUser);
      expect(result.id).toBe(userId);
      // Password hash should not be in sanitized response
      expect(result.password_hash).toBeUndefined();
    });

    it('should return null for non-existent user ID', async () => {
      const userId = 'non-existent-id';

      ReadUser.findById.mockResolvedValue(null);

      const result = await User.findById(userId);

      expect(ReadUser.findById).toHaveBeenCalledWith(userId, true);
      expect(result).toBeNull();
    });

    it('should find user by ID without sanitization when specified', async () => {
      const userId = 'user-123';
      const expectedUser = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        password_hash: 'hashed_password',
        age: 25,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z'
      };

      ReadUser.findById.mockResolvedValue(expectedUser);

      const result = await User.findById(userId, false);

      expect(ReadUser.findById).toHaveBeenCalledWith(userId, false);
      expect(result).toEqual(expectedUser);
      expect(result.password_hash).toBeDefined();
    });

    it('should handle empty or invalid user ID', async () => {
      const invalidIds = ['', null, undefined, 123, {}];

      for (const invalidId of invalidIds) {
        ReadUser.findById.mockResolvedValue(null);

        const result = await User.findById(invalidId);

        expect(ReadUser.findById).toHaveBeenCalledWith(invalidId, true);
        expect(result).toBeNull();
      }
    });

    it('should check if user exists by ID', async () => {
      const userId = 'user-123';

      ReadUser.exists.mockResolvedValue(true);

      const result = await User.exists(userId);

      expect(ReadUser.exists).toHaveBeenCalledWith(userId);
      expect(result).toBe(true);
    });

    it('should return false for non-existent user when checking existence', async () => {
      const userId = 'non-existent-id';

      ReadUser.exists.mockResolvedValue(false);

      const result = await User.exists(userId);

      expect(ReadUser.exists).toHaveBeenCalledWith(userId);
      expect(result).toBe(false);
    });
  });

  describe('find user by email', () => {
    it('should successfully find user by email', async () => {
      const email = 'test@example.com';
      const expectedUser = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        age: 25,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z'
      };

      ReadUser.findByEmail.mockResolvedValue(expectedUser);

      const result = await User.findByEmail(email);

      expect(ReadUser.findByEmail).toHaveBeenCalledWith(email, true);
      expect(result).toEqual(expectedUser);
      expect(result.email).toBe(email);
    });

    it('should return null for non-existent email', async () => {
      const email = 'nonexistent@example.com';

      ReadUser.findByEmail.mockResolvedValue(null);

      const result = await User.findByEmail(email);

      expect(ReadUser.findByEmail).toHaveBeenCalledWith(email, true);
      expect(result).toBeNull();
    });

    it('should check if email exists', async () => {
      const email = 'test@example.com';

      ReadUser.emailExists.mockResolvedValue(true);

      const result = await User.emailExists(email);

      expect(ReadUser.emailExists).toHaveBeenCalledWith(email);
      expect(result).toBe(true);
    });

    it('should return false for non-existent email when checking existence', async () => {
      const email = 'nonexistent@example.com';

      ReadUser.emailExists.mockResolvedValue(false);

      const result = await User.emailExists(email);

      expect(ReadUser.emailExists).toHaveBeenCalledWith(email);
      expect(result).toBe(false);
    });
  });

  describe('find user by username', () => {
    it('should successfully find user by username', async () => {
      const username = 'testuser';
      const expectedUser = {
        id: 'user-123',
        username: 'testuser',
        email: 'test@example.com',
        age: 25,
        created_at: '2024-01-01T00:00:00.000Z',
        updated_at: '2024-01-01T00:00:00.000Z'
      };

      ReadUser.findByUsername.mockResolvedValue(expectedUser);

      const result = await User.findByUsername(username);

      expect(ReadUser.findByUsername).toHaveBeenCalledWith(username, true);
      expect(result).toEqual(expectedUser);
      expect(result.username).toBe(username);
    });

    it('should return null for non-existent username', async () => {
      const username = 'nonexistentuser';

      ReadUser.findByUsername.mockResolvedValue(null);

      const result = await User.findByUsername(username);

      expect(ReadUser.findByUsername).toHaveBeenCalledWith(username, true);
      expect(result).toBeNull();
    });

    it('should check if username exists', async () => {
      const username = 'testuser';

      ReadUser.usernameExists.mockResolvedValue(true);

      const result = await User.usernameExists(username);

      expect(ReadUser.usernameExists).toHaveBeenCalledWith(username);
      expect(result).toBe(true);
    });

    it('should return false for non-existent username when checking existence', async () => {
      const username = 'nonexistentuser';

      ReadUser.usernameExists.mockResolvedValue(false);

      const result = await User.usernameExists(username);

      expect(ReadUser.usernameExists).toHaveBeenCalledWith(username);
      expect(result).toBe(false);
    });
  });

  describe('get all users', () => {
    it('should return all users', async () => {
      const expectedUsers = [
        {
          id: 'user-1',
          username: 'user1',
          email: 'user1@example.com',
          age: 25
        },
        {
          id: 'user-2',
          username: 'user2',
          email: 'user2@example.com',
          age: 30
        }
      ];

      ReadUser.getAll.mockResolvedValue(expectedUsers);

      const result = await User.getAll();

      expect(ReadUser.getAll).toHaveBeenCalledWith(true);
      expect(result).toEqual(expectedUsers);
      expect(result.length).toBe(2);
    });

    it('should return empty array when no users exist', async () => {
      ReadUser.getAll.mockResolvedValue([]);

      const result = await User.getAll();

      expect(ReadUser.getAll).toHaveBeenCalledWith(true);
      expect(result).toEqual([]);
    });

    it('should get user count', async () => {
      const expectedCount = 5;

      ReadUser.getCount.mockResolvedValue(expectedCount);

      const result = await User.getCount();

      expect(ReadUser.getCount).toHaveBeenCalled();
      expect(result).toBe(expectedCount);
    });

    it('should return zero count when no users exist', async () => {
      ReadUser.getCount.mockResolvedValue(0);

      const result = await User.getCount();

      expect(ReadUser.getCount).toHaveBeenCalled();
      expect(result).toBe(0);
    });
  });
}); 