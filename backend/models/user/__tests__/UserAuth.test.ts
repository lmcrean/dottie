import { TestRequestBody, TestOptions, MockResponse, TestUserOverrides, TestCycleOverrides, TestSymptomOverrides, TestAssessmentOverrides } from '../../types/common';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import UserAuth from '';
import DbService from '';
import { generateUser } from '';

// Mock DbService
vi.mock('@/services/dbService.ts');

describe('UserAuth Model', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const user = generateUser({ email: 'test@example.com' });
      DbService.findBy.mockResolvedValue([user]);

      const result = await UserAuth.findByEmail('test@example.com');

      expect(DbService.findBy).toHaveBeenCalledWith('users', 'email', 'test@example.com');
      expect(result).toEqual(user);
    });

    it('should return null when no user found', async () => {
      DbService.findBy.mockResolvedValue([]);

      const result = await UserAuth.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });

    it('should return first user when multiple users found', async () => {
      const users = [
        generateUser({ email: 'test@example.com' }),
        generateUser({ email: 'test@example.com' })
      ];
      DbService.findBy.mockResolvedValue(users);

      const result = await UserAuth.findByEmail('test@example.com');

      expect(result).toEqual(users[0]);
    });
  });

  describe('findByUsername', () => {
    it('should find user by username', async () => {
      const user = generateUser({ username: 'testuser' });
      DbService.findBy.mockResolvedValue([user]);

      const result = await UserAuth.findByUsername('testuser');

      expect(DbService.findBy).toHaveBeenCalledWith('users', 'username', 'testuser');
      expect(result).toEqual(user);
    });

    it('should return null when no user found', async () => {
      DbService.findBy.mockResolvedValue([]);

      const result = await UserAuth.findByUsername('nonexistentuser');

      expect(result).toBeNull();
    });
  });

  describe('updatePassword', () => {
    it('should update user password', async () => {
      const userId = 'test-user-id';
      const newPasswordHash = 'new-hashed-password';
      const updatedUser = { id: userId, password_hash: newPasswordHash };
      
      DbService.update.mockResolvedValue(updatedUser);

      const result = await UserAuth.updatePassword(userId, newPasswordHash);

      expect(DbService.update).toHaveBeenCalledWith('users', userId, { 
        password_hash: newPasswordHash 
      });
      expect(result).toEqual(updatedUser);
    });
  });

  describe('verifyCredentials', () => {
    it('should return user when credentials are valid', async () => {
      const user = generateUser({ 
        email: 'test@example.com',
        password_hash: 'correct-hash'
      });
      DbService.findBy.mockResolvedValue([user]);

      const result = await UserAuth.verifyCredentials('test@example.com', 'correct-hash');

      expect(result).toEqual(user);
    });

    it('should return null when user not found', async () => {
      DbService.findBy.mockResolvedValue([]);

      const result = await UserAuth.verifyCredentials('test@example.com', 'any-hash');

      expect(result).toBeNull();
    });

    it('should return null when password hash does not match', async () => {
      const user = generateUser({ 
        email: 'test@example.com',
        password_hash: 'correct-hash'
      });
      DbService.findBy.mockResolvedValue([user]);

      const result = await UserAuth.verifyCredentials('test@example.com', 'wrong-hash');

      expect(result).toBeNull();
    });

    it('should return null when user exists but has no password hash', async () => {
      const user = generateUser({ 
        email: 'test@example.com',
        password_hash: null
      });
      DbService.findBy.mockResolvedValue([user]);

      const result = await UserAuth.verifyCredentials('test@example.com', 'any-hash');

      expect(result).toBeNull();
    });
  });

  describe('emailExists', () => {
    it('should return true when email exists', async () => {
      const user = generateUser({ email: 'test@example.com' });
      DbService.findBy.mockResolvedValue([user]);

      const result = await UserAuth.emailExists('test@example.com');

      expect(result).toBe(true);
    });

    it('should return false when email does not exist', async () => {
      DbService.findBy.mockResolvedValue([]);

      const result = await UserAuth.emailExists('nonexistent@example.com');

      expect(result).toBe(false);
    });
  });

  describe('usernameExists', () => {
    it('should return true when username exists', async () => {
      const user = generateUser({ username: 'testuser' });
      DbService.findBy.mockResolvedValue([user]);

      const result = await UserAuth.usernameExists('testuser');

      expect(result).toBe(true);
    });

    it('should return false when username does not exist', async () => {
      DbService.findBy.mockResolvedValue([]);

      const result = await UserAuth.usernameExists('nonexistentuser');

      expect(result).toBe(false);
    });
  });

  describe('tableName', () => {
    it('should have correct table name', () => {
      expect(UserAuth.tableName).toBe('users');
    });
  });
}); 

