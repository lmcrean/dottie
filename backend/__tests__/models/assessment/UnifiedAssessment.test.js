import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import UnifiedAssessment from '../../../models/assessment/UnifiedAssessment.js';
import CleanAssessmentOperations from '../../../models/assessment/assessment-base/CleanAssessmentOperations.js';

// Mock the operations class
vi.mock('../../../models/assessment/assessment-base/CleanAssessmentOperations.js');

describe('UnifiedAssessment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('findById', () => {
    it('should delegate to CleanAssessmentOperations.findById', async () => {
      const testId = 'test-assessment-123';
      const mockAssessment = { id: testId, user_id: 'test-user' };

      CleanAssessmentOperations.findById.mockResolvedValue(mockAssessment);

      const result = await UnifiedAssessment.findById(testId);

      expect(CleanAssessmentOperations.findById).toHaveBeenCalledWith(testId);
      expect(result).toEqual(mockAssessment);
    });

    it('should return null when assessment not found', async () => {
      CleanAssessmentOperations.findById.mockResolvedValue(null);

      const result = await UnifiedAssessment.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should delegate to CleanAssessmentOperations.create', async () => {
      const assessmentData = { age: 30, pattern: 'regular' };
      const userId = 'test-user-123';
      const mockCreated = { id: 'new-assessment', ...assessmentData, user_id: userId };

      CleanAssessmentOperations.create.mockResolvedValue(mockCreated);

      const result = await UnifiedAssessment.create(assessmentData, userId);

      expect(CleanAssessmentOperations.create).toHaveBeenCalledWith(assessmentData, userId);
      expect(result).toEqual(mockCreated);
    });
  });

  describe('update', () => {
    it('should delegate to CleanAssessmentOperations.update', async () => {
      const assessmentId = 'test-assessment-123';
      const updateData = { age: 31, pattern: 'irregular' };
      const mockUpdated = { id: assessmentId, ...updateData };

      CleanAssessmentOperations.update.mockResolvedValue(mockUpdated);

      const result = await UnifiedAssessment.update(assessmentId, updateData);

      expect(CleanAssessmentOperations.update).toHaveBeenCalledWith(assessmentId, updateData);
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('listByUser', () => {
    it('should delegate to CleanAssessmentOperations.listByUser', async () => {
      const userId = 'test-user-123';
      const mockAssessments = [
        { id: 'assessment-1', user_id: userId },
        { id: 'assessment-2', user_id: userId }
      ];

      CleanAssessmentOperations.listByUser.mockResolvedValue(mockAssessments);

      const result = await UnifiedAssessment.listByUser(userId);

      expect(CleanAssessmentOperations.listByUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockAssessments);
    });
  });

  describe('delete', () => {
    it('should delegate to CleanAssessmentOperations.delete', async () => {
      const assessmentId = 'test-assessment-123';

      CleanAssessmentOperations.delete.mockResolvedValue(true);

      const result = await UnifiedAssessment.delete(assessmentId);

      expect(CleanAssessmentOperations.delete).toHaveBeenCalledWith(assessmentId);
      expect(result).toBe(true);
    });
  });

  describe('validateOwnership', () => {
    it('should delegate to CleanAssessmentOperations.validateOwnership', async () => {
      const assessmentId = 'test-assessment-123';
      const userId = 'test-user-123';

      CleanAssessmentOperations.validateOwnership.mockResolvedValue(true);

      const result = await UnifiedAssessment.validateOwnership(assessmentId, userId);

      expect(CleanAssessmentOperations.validateOwnership).toHaveBeenCalledWith(assessmentId, userId);
      expect(result).toBe(true);
    });

    it('should return false for non-owner', async () => {
      const assessmentId = 'test-assessment-123';
      const userId = 'different-user';

      CleanAssessmentOperations.validateOwnership.mockResolvedValue(false);

      const result = await UnifiedAssessment.validateOwnership(assessmentId, userId);

      expect(result).toBe(false);
    });
  });
}); 