import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import Assessment from '../../Assessment.js';
import RouteAssessment from '../../services/RouteAssessment.js';

// Mock the operations class
vi.mock('../../services/RouteAssessment.js');

describe('Assessment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('findById', () => {
    it('should delegate to RouteAssessment.findById', async () => {
      const testId = 'test-assessment-123';
      const mockAssessment = { id: testId, user_id: 'test-user' };

      RouteAssessment.findById.mockResolvedValue(mockAssessment);

      const result = await Assessment.findById(testId);

      expect(RouteAssessment.findById).toHaveBeenCalledWith(testId);
      expect(result).toEqual(mockAssessment);
    });

    it('should return null when assessment not found', async () => {
      RouteAssessment.findById.mockResolvedValue(null);

      const result = await Assessment.findById('non-existent');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should delegate to RouteAssessment.create', async () => {
      const assessmentData = { age: 30, pattern: 'regular' };
      const userId = 'test-user-123';
      const mockCreated = { id: 'new-assessment', ...assessmentData, user_id: userId };

      RouteAssessment.create.mockResolvedValue(mockCreated);

      const result = await Assessment.create(assessmentData, userId);

      expect(RouteAssessment.create).toHaveBeenCalledWith(assessmentData, userId);
      expect(result).toEqual(mockCreated);
    });
  });

  describe('update', () => {
    it('should delegate to RouteAssessment.update', async () => {
      const assessmentId = 'test-assessment-123';
      const updateData = { age: 31, pattern: 'irregular' };
      const mockUpdated = { id: assessmentId, ...updateData };

      RouteAssessment.update.mockResolvedValue(mockUpdated);

      const result = await Assessment.update(assessmentId, updateData);

      expect(RouteAssessment.update).toHaveBeenCalledWith(assessmentId, updateData);
      expect(result).toEqual(mockUpdated);
    });
  });

  describe('listByUser', () => {
    it('should delegate to RouteAssessment.listByUser', async () => {
      const userId = 'test-user-123';
      const mockAssessments = [
        { id: 'assessment-1', user_id: userId },
        { id: 'assessment-2', user_id: userId }
      ];

      RouteAssessment.listByUser.mockResolvedValue(mockAssessments);

      const result = await Assessment.listByUser(userId);

      expect(RouteAssessment.listByUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockAssessments);
    });
  });

  describe('delete', () => {
    it('should delegate to RouteAssessment.delete', async () => {
      const assessmentId = 'test-assessment-123';

      RouteAssessment.delete.mockResolvedValue(true);

      const result = await Assessment.delete(assessmentId);

      expect(RouteAssessment.delete).toHaveBeenCalledWith(assessmentId);
      expect(result).toBe(true);
    });
  });

  describe('validateOwnership', () => {
    it('should delegate to RouteAssessment.validateOwnership', async () => {
      const assessmentId = 'test-assessment-123';
      const userId = 'test-user-123';

      RouteAssessment.validateOwnership.mockResolvedValue(true);

      const result = await Assessment.validateOwnership(assessmentId, userId);

      expect(RouteAssessment.validateOwnership).toHaveBeenCalledWith(assessmentId, userId);
      expect(result).toBe(true);
    });

    it('should return false for non-owner', async () => {
      const assessmentId = 'test-assessment-123';
      const userId = 'different-user';

      RouteAssessment.validateOwnership.mockResolvedValue(false);

      const result = await Assessment.validateOwnership(assessmentId, userId);

      expect(result).toBe(false);
    });
  });
}); 