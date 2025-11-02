import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import User from '../User.js';
import DeleteUser from '../services/DeleteUser.js';

// Mock the DeleteUser service
vi.mock('../services/DeleteUser.js');

describe('Delete User By ID Tests (TDD Plan)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('delete user by id', () => {
    it('should successfully delete user and all related data', async () => {
      const userId = 'user-123';

      const expectedResult = {
        success: true,
        deleted: {
          user: true,
          conversations: 2,
          messages: 15,
          assessments: 1,
          period_logs: 5,
          symptoms: 10
        },
        message: 'User and all related data deleted successfully'
      };

      DeleteUser.deleteUser.mockResolvedValue(expectedResult);

      const result = await User.delete(userId);

      expect(DeleteUser.deleteUser).toHaveBeenCalledWith(userId);
      expect(result.success).toBe(true);
      expect(result.deleted).toBeDefined();
      expect(result.deleted.user).toBe(true);
      expect(result.deleted.conversations).toBeGreaterThan(0);
      expect(result.deleted.messages).toBeGreaterThan(0);
    });

    it('should handle deletion of user without related data', async () => {
      const userId = 'user-456';

      const expectedResult = {
        success: true,
        deleted: {
          user: true,
          conversations: 0,
          messages: 0,
          assessments: 0,
          period_logs: 0,
          symptoms: 0
        },
        message: 'User deleted successfully'
      };

      DeleteUser.deleteUser.mockResolvedValue(expectedResult);

      const result = await User.delete(userId);

      expect(DeleteUser.deleteUser).toHaveBeenCalledWith(userId);
      expect(result.success).toBe(true);
      expect(result.deleted.user).toBe(true);
      expect(result.deleted.conversations).toBe(0);
      expect(result.deleted.messages).toBe(0);
    });

    it('should fail to delete non-existent user', async () => {
      const userId = 'non-existent-user';

      const expectedResult = {
        success: false,
        errors: ['User not found']
      };

      DeleteUser.deleteUser.mockResolvedValue(expectedResult);

      const result = await User.delete(userId);

      expect(DeleteUser.deleteUser).toHaveBeenCalledWith(userId);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('User not found');
    });

    it('should handle database errors during deletion', async () => {
      const userId = 'user-123';

      const expectedResult = {
        success: false,
        errors: ['Database error during deletion'],
        partialDeletion: {
          user: false,
          conversations: 1,
          messages: 5
        }
      };

      DeleteUser.deleteUser.mockResolvedValue(expectedResult);

      const result = await User.delete(userId);

      expect(DeleteUser.deleteUser).toHaveBeenCalledWith(userId);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('Database error during deletion');
      expect(result.partialDeletion).toBeDefined();
    });

    it('should handle empty or invalid user ID', async () => {
      const invalidIds = ['', null, undefined];

      for (const invalidId of invalidIds) {
        const expectedResult = {
          success: false,
          errors: ['Invalid user ID']
        };

        DeleteUser.deleteUser.mockResolvedValue(expectedResult);

        const result = await User.delete(invalidId);

        expect(DeleteUser.deleteUser).toHaveBeenCalledWith(invalidId);
        expect(result.success).toBe(false);
        expect(result.errors).toContain('Invalid user ID');
      }
    });
  });

  describe('soft delete user', () => {
    it('should successfully soft delete user', async () => {
      const userId = 'user-123';

      const expectedResult = {
        success: true,
        user: {
          id: 'user-123',
          username: 'testuser',
          email: 'test@example.com',
          deleted_at: '2024-01-01T12:00:00.000Z',
          active: false
        },
        message: 'User soft deleted successfully'
      };

      DeleteUser.softDeleteUser.mockResolvedValue(expectedResult);

      const result = await User.softDelete(userId);

      expect(DeleteUser.softDeleteUser).toHaveBeenCalledWith(userId);
      expect(result.success).toBe(true);
      expect(result.user.deleted_at).toBeDefined();
      expect(result.user.active).toBe(false);
    });

    it('should fail to soft delete non-existent user', async () => {
      const userId = 'non-existent-user';

      const expectedResult = {
        success: false,
        errors: ['User not found']
      };

      DeleteUser.softDeleteUser.mockResolvedValue(expectedResult);

      const result = await User.softDelete(userId);

      expect(DeleteUser.softDeleteUser).toHaveBeenCalledWith(userId);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('User not found');
    });

    it('should fail to soft delete already deleted user', async () => {
      const userId = 'already-deleted-user';

      const expectedResult = {
        success: false,
        errors: ['User is already deleted']
      };

      DeleteUser.softDeleteUser.mockResolvedValue(expectedResult);

      const result = await User.softDelete(userId);

      expect(DeleteUser.softDeleteUser).toHaveBeenCalledWith(userId);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('User is already deleted');
    });
  });

  describe('get deletion preview', () => {
    it('should provide preview of what would be deleted', async () => {
      const userId = 'user-123';

      const expectedResult = {
        success: true,
        preview: {
          user: {
            id: 'user-123',
            username: 'testuser',
            email: 'test@example.com'
          },
          relatedData: {
            conversations: 2,
            messages: 15,
            assessments: 1,
            period_logs: 5,
            symptoms: 10
          },
          warning: 'This action cannot be undone'
        }
      };

      DeleteUser.getDeletionPreview.mockResolvedValue(expectedResult);

      const result = await User.getDeletionPreview(userId);

      expect(DeleteUser.getDeletionPreview).toHaveBeenCalledWith(userId);
      expect(result.success).toBe(true);
      expect(result.preview).toBeDefined();
      expect(result.preview.user).toBeDefined();
      expect(result.preview.relatedData).toBeDefined();
      expect(result.preview.relatedData.conversations).toBeGreaterThan(0);
    });

    it('should show preview for user without related data', async () => {
      const userId = 'user-456';

      const expectedResult = {
        success: true,
        preview: {
          user: {
            id: 'user-456',
            username: 'newuser',
            email: 'new@example.com'
          },
          relatedData: {
            conversations: 0,
            messages: 0,
            assessments: 0,
            period_logs: 0,
            symptoms: 0
          },
          warning: 'This action cannot be undone'
        }
      };

      DeleteUser.getDeletionPreview.mockResolvedValue(expectedResult);

      const result = await User.getDeletionPreview(userId);

      expect(DeleteUser.getDeletionPreview).toHaveBeenCalledWith(userId);
      expect(result.success).toBe(true);
      expect(result.preview.relatedData.conversations).toBe(0);
      expect(result.preview.relatedData.messages).toBe(0);
    });

    it('should fail to get preview for non-existent user', async () => {
      const userId = 'non-existent-user';

      const expectedResult = {
        success: false,
        errors: ['User not found']
      };

      DeleteUser.getDeletionPreview.mockResolvedValue(expectedResult);

      const result = await User.getDeletionPreview(userId);

      expect(DeleteUser.getDeletionPreview).toHaveBeenCalledWith(userId);
      expect(result.success).toBe(false);
      expect(result.errors).toContain('User not found');
    });
  });
}); 