import DbService from '../../../db/index.ts'
import { TestRequestBody, TestOptions, MockResponse, TestUserOverrides, TestCycleOverrides, TestSymptomOverrides, TestAssessmentOverrides } from '../../../types/common';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import User from '../../../models/user/User.ts';
// TODO: Fix empty import
// TODO: Fix empty import

// Mock DbService
vi.mock('@/services/dbService.ts');

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
      const expectedUser = { ...userData, id: 'generated-uuid' };
      
      DbService.create.mockResolvedValue(expectedUser);

      const result = await User.create(userData);

      expect(DbService.create).toHaveBeenCalledWith('users', expect.objectContaining({
        ...userData,
        id: expect.any(String)
      }));
      expect(result).toEqual(expectedUser);
      expect(result.id).toBeDefined();
    });

    it('should handle creation errors', async () => {
      const userData = generateUser();
      const error = new Error('Database error');
      
      DbService.create.mockRejectedValue(error);

      await expect(User.create(userData)).rejects.toThrow('Database error');
    });
  });

  describe('findById', () => {
    it('should find user by ID', async () => {
      const user = generateUser();
      DbService.findById.mockResolvedValue(user);

      const result = await User.findById(user.id);

      expect(DbService.findById).toHaveBeenCalledWith('users', user.id);
      expect(result).toEqual(user);
    });

    it('should return null when user not found', async () => {
      DbService.findById.mockResolvedValue(null);

      const result = await User.findById('non-existent-id');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user data', async () => {
      const userId = 'test-user-id';
      const updateData = { username: 'newusername', age: '35_44' };
      const updatedUser = { id: userId, ...updateData };
      
      DbService.update.mockResolvedValue(updatedUser);

      const result = await User.update(userId, updateData);

      expect(DbService.update).toHaveBeenCalledWith('users', userId, updateData);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('delete', () => {
    it('should delete user and all related data in correct order', async () => {
      const userId = 'test-user-id';
      const conversations = [
        { id: 'conv-1', user_id: userId },
        { id: 'conv-2', user_id: userId }
      ];

      // Mock the cascade delete operations
      DbService.findBy.mockResolvedValue(conversations);
      DbService.delete.mockResolvedValue(true);

      const result = await User.delete(userId);

      // Verify the correct order of deletions
      expect(DbService.findBy).toHaveBeenCalledWith('conversations', 'user_id', userId);
      
      // Chat messages for each conversation
      expect(DbService.delete).toHaveBeenCalledWith('chat_messages', { conversation_id: 'conv-1' });
      expect(DbService.delete).toHaveBeenCalledWith('chat_messages', { conversation_id: 'conv-2' });
      
      // Conversations
      expect(DbService.delete).toHaveBeenCalledWith('conversations', { user_id: userId });
      
      // Other related data
      expect(DbService.delete).toHaveBeenCalledWith('assessments', { user_id: userId });
      expect(DbService.delete).toHaveBeenCalledWith('period_logs', { user_id: userId });
      expect(DbService.delete).toHaveBeenCalledWith('symptoms', { user_id: userId });
      
      // Finally the user
      expect(DbService.delete).toHaveBeenCalledWith('users', userId);
      
      expect(result).toBe(true);
    });

    it('should handle errors gracefully and still attempt to delete user', async () => {
      const userId = 'test-user-id';
      
      // Mock findBy to throw an error
      DbService.findBy.mockRejectedValue(new Error('Database error'));

      await expect(User.delete(userId)).rejects.toThrow('Database error');
    });

    it('should continue with deletion even if symptoms table does not exist', async () => {
      const userId = 'test-user-id';
      
      DbService.findBy.mockResolvedValue([]);
      DbService.delete.mockImplementation((table, conditions) => {
        if (table === 'symptoms') {
          throw new Error('Table does not exist');
        }
        return Promise.resolve(true);
      });

      const result = await User.delete(userId);

      expect(result).toBe(true);
      expect(DbService.delete).toHaveBeenCalledWith('users', userId);
    });
  });

  describe('getAll', () => {
    it('should return all users', async () => {
      const users = [generateUser(), generateUser()];
      DbService.getAll.mockResolvedValue(users);

      const result = await User.getAll();

      expect(DbService.getAll).toHaveBeenCalledWith('users');
      expect(result).toEqual(users);
    });

    it('should return empty array when no users exist', async () => {
      DbService.getAll.mockResolvedValue([]);

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

