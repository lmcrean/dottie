import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { generateId } from '@/test-utilities/testFixtures.js';
import Assessment from '../../Assessment.js';
import DbService from '@/services/dbService.js';

// Mock dependencies
vi.mock('@/services/dbService.js');

describe('Delete Assessment By ID Tests', () => {
  let mockAssessmentId;
  let mockUserId;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Generate test data
    mockAssessmentId = generateId();
    mockUserId = generateId();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Successful Assessment Deletion', () => {
    it('should delete assessment by id and return true', async () => {
      // Mock successful deletion
      DbService.delete.mockResolvedValue(true);

      // Execute
      const result = await Assessment.delete(mockAssessmentId);

      // Verify
      expect(result).toBe(true);
      expect(DbService.delete).toHaveBeenCalledWith('assessments', mockAssessmentId);
    });

    it('should call DbService.delete with correct table and assessment ID', async () => {
      DbService.delete.mockResolvedValue(true);

      await Assessment.delete(mockAssessmentId);

      // Verify the correct service method was called with correct parameters
      expect(DbService.delete).toHaveBeenCalledTimes(1);
      expect(DbService.delete).toHaveBeenCalledWith('assessments', mockAssessmentId);
    });

    it('should handle deletion of existing assessment', async () => {
      DbService.delete.mockResolvedValue(true);

      const result = await Assessment.delete(mockAssessmentId);

      expect(result).toBe(true);
    });

    it('should handle deletion of non-existent assessment', async () => {
      // Some implementations return false for non-existent records
      DbService.delete.mockResolvedValue(false);

      const result = await Assessment.delete('non-existent-id');

      expect(result).toBe(false);
    });
  });

  describe('Error Handling', () => {
    it('should throw error when database deletion fails', async () => {
      const dbError = new Error('Database deletion failed');
      DbService.delete.mockRejectedValue(dbError);

      await expect(Assessment.delete(mockAssessmentId))
        .rejects.toThrow('Database deletion failed');
    });

    it('should throw error when assessment ID is invalid', async () => {
      const dbError = new Error('Invalid ID format');
      DbService.delete.mockRejectedValue(dbError);

      await expect(Assessment.delete('invalid-id'))
        .rejects.toThrow('Invalid ID format');
    });

    it('should handle database connection issues', async () => {
      const connectionError = new Error('Database connection lost');
      DbService.delete.mockRejectedValue(connectionError);

      await expect(Assessment.delete(mockAssessmentId))
        .rejects.toThrow('Database connection lost');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty assessment ID', async () => {
      const dbError = new Error('Empty ID not allowed');
      DbService.delete.mockRejectedValue(dbError);

      await expect(Assessment.delete(''))
        .rejects.toThrow('Empty ID not allowed');
    });

    it('should handle null assessment ID', async () => {
      const dbError = new Error('Null ID not allowed');
      DbService.delete.mockRejectedValue(dbError);

      await expect(Assessment.delete(null))
        .rejects.toThrow('Null ID not allowed');
    });

    it('should handle undefined assessment ID', async () => {
      const dbError = new Error('Undefined ID not allowed');
      DbService.delete.mockRejectedValue(dbError);

      await expect(Assessment.delete(undefined))
        .rejects.toThrow('Undefined ID not allowed');
    });
  });
}); 