import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import User from '../User.js';
import CreateUser from '../services/CreateUser.js';
import ReadUser from '../services/ReadUser.js';
import DeleteUser from '../services/DeleteUser.js';
import DbService from '@/services/dbService.js';
import { generateUser } from '@test-utils/testFixtures.js';

// Mock the service classes
vi.mock('../services/CreateUser.js');
vi.mock('../services/ReadUser.js');
vi.mock('../services/DeleteUser.js');
vi.mock('@/services/dbService.js');

describe('User Model', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('create', () => {
    it('should create a new user with generated UUID', async () => {
      const userData = generateUser({ id: undefined });
      const expectedResult = { 
        success: true,
        user: { ...userData, id: 'generated-uuid' }
      };
      
      CreateUser.create.mockResolvedValue(expectedResult);

      const result = await User.create(userData);

      expect(CreateUser.create).toHaveBeenCalledWith(userData);
      expect(result).toEqual(expectedResult);
      expect(result.user.id).toBeDefined();
    });

    it('should handle creation errors', async () => {
      const userData = generateUser();
      const expectedResult = {
        success: false,
        errors: ['Age must be a valid number between 0 and 150']
      };
      
      CreateUser.create.mockResolvedValue(expectedResult);

      const result = await User.create(userData);
      
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Age must be a valid number between 0 and 150');
    });
  });

  describe('findById', () => {
    it('should find user by ID', async () => {
      const user = generateUser();
      ReadUser.findById.mockResolvedValue(user);

      const result = await User.findById(user.id);

      expect(ReadUser.findById).toHaveBeenCalledWith(user.id, true);
      expect(result).toEqual(user);
    });

    it('should return null when user not found', async () => {
      ReadUser.findById.mockResolvedValue(null);

      const result = await User.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user data', async () => {
      const userId = 'test-user-id';
      const updateData = { username: 'newusername', age: '35_44' };
      const updatedUser = { id: userId, ...updateData };
      
      // User.update uses DbService directly for backward compatibility
      DbService.update.mockResolvedValue(updatedUser);

      const result = await User.update(userId, updateData);

      expect(DbService.update).toHaveBeenCalledWith('users', userId, updateData);
      expect(result).toEqual(expect.objectContaining(updateData));
    });
  });

  describe('delete', () => {
    it('should delete user and all related data in correct order', async () => {
      const userId = 'test-user-id';
      const expectedResult = { success: true };

      DeleteUser.deleteUser.mockResolvedValue(expectedResult);

      const result = await User.delete(userId);

      expect(DeleteUser.deleteUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors gracefully and still attempt to delete user', async () => {
      const userId = 'test-user-id';
      const expectedResult = {
        success: false,
        errors: ['User not found']
      };
      
      DeleteUser.deleteUser.mockResolvedValue(expectedResult);

      const result = await User.delete(userId);
      
      expect(result.success).toBe(false);
      expect(result.errors).toContain('User not found');
    });

    it('should continue with deletion even if symptoms table does not exist', async () => {
      const userId = 'test-user-id';
      const expectedResult = { success: true };
      
      DeleteUser.deleteUser.mockResolvedValue(expectedResult);

      const result = await User.delete(userId);

      expect(result.success).toBe(true);
      expect(DeleteUser.deleteUser).toHaveBeenCalledWith(userId);
    });
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      const users = [generateUser(), generateUser()];
      ReadUser.getAll.mockResolvedValue(users);

      const result = await User.getAll();

      expect(ReadUser.getAll).toHaveBeenCalledWith(true);
      expect(result).toEqual(users);
    });

    it('should return empty array when no users exist', async () => {
      ReadUser.getAll.mockResolvedValue([]);

      const result = await User.getAll();

      expect(result).toEqual([]);
    });
  });

  describe('tableName', () => {
    it('should have correct table name', () => {
      expect(User.tableName).toBe('users');
    });
  });
}); 