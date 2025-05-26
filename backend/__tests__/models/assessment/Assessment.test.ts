import CreateAssessment from '../types/common'
import Assessment from '../types/common'
import { TestRequestBody, TestOptions, MockResponse, TestUserOverrides, TestCycleOverrides, TestSymptomOverrides, TestAssessmentOverrides } from '../../../types/common';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

// Mock the operations class
vi.mock('../../../models/assessment/assessment-base/CreateAssessment.ts');

describe('Assessment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('findById', () => {
    it('should delegate to CreateAssessment.findById', async () => {
      const testId = 'test-assessment-123';
      const mockAssessment = { id: testId, user_id: 'test-user' };

      CreateAssessment.findById.mockResolvedValue(mockAssessment);

      const result = await Assessment.findById(testId);

      expect(CreateAssessment.findById).toHaveBeenCalledWith(testId);
      expect(result).toEqual(mockAssessment);
    });

    it('should return null when assessment not found', async () => {
      CreateAssessment.findById.mockResolvedValue(null);

      const result = await Assessment.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should delegate to CreateAssessment.create', async () => {
      const assessmentData = { age: 30, pattern: 'regular' };
      const userId = 'test-user-123';
      const mockCreated = { id: 'new-assessment', ...assessmentData, user_id: userId };

      CreateAssessment.create.mockResolvedValue(mockCreated);

      const result = await Assessment.create(assessmentData, userId);

      expect(CreateAssessment.create).toHaveBeenCalledWith(assessmentData, userId);
      expect(result).toEqual(mockCreated);
    });
  });

  describe('update', () => {
    it('should delegate to CreateAssessment.update', async () => {
      const assessmentId = 'test-assessment-123';
      const updateData = { age: 31, pattern: 'irregular' };
      const mockUpdated = { id: assessmentId, ...updateData };

      CreateAssessment.update.mockResolvedValue(mockUpdated);

      const result = await Assessment.update(assessmentId, updateData);

      expect(CreateAssessment.update).toHaveBeenCalledWith(assessmentId, updateData);
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('listByUser', () => {
    it('should delegate to CreateAssessment.listByUser', async () => {
      const userId = 'test-user-123';
      const mockAssessments = [
        { id: 'assessment-1', user_id: userId },
        { id: 'assessment-2', user_id: userId }
      ];

      CreateAssessment.listByUser.mockResolvedValue(mockAssessments);

      const result = await Assessment.listByUser(userId);

      expect(CreateAssessment.listByUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockAssessments);
    });
  });

  describe('delete', () => {
    it('should delegate to CreateAssessment.delete', async () => {
      const assessmentId = 'test-assessment-123';

      CreateAssessment.delete.mockResolvedValue(true);

      const result = await Assessment.delete(assessmentId);

      expect(CreateAssessment.delete).toHaveBeenCalledWith(assessmentId);
      expect(result).toBe(true);
    });
  });

  describe('validateOwnership', () => {
    it('should delegate to CreateAssessment.validateOwnership', async () => {
      const assessmentId = 'test-assessment-123';
      const userId = 'test-user-123';

      CreateAssessment.validateOwnership.mockResolvedValue(true);

      const result = await Assessment.validateOwnership(assessmentId, userId);

      expect(CreateAssessment.validateOwnership).toHaveBeenCalledWith(assessmentId, userId);
      expect(result).toBe(true);
    });

    it('should return false for non-owner', async () => {
      const assessmentId = 'test-assessment-123';
      const userId = 'different-user';

      CreateAssessment.validateOwnership.mockResolvedValue(false);

      const result = await Assessment.validateOwnership(assessmentId, userId);

      expect(result).toBe(false);
    });
  });
}); 

