import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import UpdateAssessment from '../../services/UpdateAssessment.js';
import DbService from '../../../../services/dbService.js';
import TransformApiToDb from '../../transformers/TransformApiToDb.js';

// Mock dependencies
vi.mock('../../../../services/dbService.js');
vi.mock('../../transformers/TransformApiToDb.js');

describe('UpdateAssessment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('execute', () => {
    it('should update assessment successfully', async () => {
      const assessmentId = 'db-assessment-123';
      const updateData = {
        age: 30,
        pattern: 'irregular',
        physical_symptoms: ['bloating', 'fatigue'],
        recommendations: [
          { title: 'Exercise', description: 'Regular exercise' }
        ]
      };

      const transformedData = {
        age: 30,
        pattern: 'irregular',
        physical_symptoms: '["bloating","fatigue"]',
        recommendations: '[{"title":"Exercise","description":"Regular exercise"}]'
      };

      const updatedRecord = {
        id: assessmentId,
        user_id: 'user-123',
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-02'),
        ...transformedData
      };

      TransformApiToDb.transform.mockReturnValue(transformedData);
      DbService.update.mockResolvedValue(updatedRecord);

      const result = await UpdateAssessment.execute(assessmentId, updateData);

      expect(TransformApiToDb.transform).toHaveBeenCalledWith(updateData);
      expect(DbService.update).toHaveBeenCalledWith('assessments', assessmentId, transformedData);
      expect(result).toEqual(updatedRecord);
    });

    it('should handle database errors', async () => {
      const assessmentId = 'error-assessment-123';
      const updateData = { age: 30 };
      const error = new Error('Database update failed');

      TransformApiToDb.transform.mockReturnValue({ age: 30 });
      DbService.update.mockRejectedValue(error);

      await expect(UpdateAssessment.execute(assessmentId, updateData))
        .rejects.toThrow('Database update failed');

      expect(DbService.update).toHaveBeenCalledWith('assessments', assessmentId, { age: 30 });
    });

    it('should handle transform errors', async () => {
      const assessmentId = 'transform-error-123';
      const updateData = { age: 30 };
      const transformError = new Error('Transform failed');

      TransformApiToDb.transform.mockImplementation(() => {
        throw transformError;
      });

      await expect(UpdateAssessment.execute(assessmentId, updateData))
        .rejects.toThrow('Transform failed');

      expect(TransformApiToDb.transform).toHaveBeenCalledWith(updateData);
      expect(DbService.update).not.toHaveBeenCalled();
    });

    it('should pass through minimal update data correctly', async () => {
      const assessmentId = 'minimal-update-123';
      const updateData = { pain_level: 1 };
      const transformedData = { pain_level: 1 };
      const updatedRecord = { id: assessmentId, pain_level: 1 };

      TransformApiToDb.transform.mockReturnValue(transformedData);
      DbService.update.mockResolvedValue(updatedRecord);

      const result = await UpdateAssessment.execute(assessmentId, updateData);

      expect(TransformApiToDb.transform).toHaveBeenCalledWith(updateData);
      expect(DbService.update).toHaveBeenCalledWith('assessments', assessmentId, transformedData);
      expect(result).toEqual(updatedRecord);
    });

    it('should handle complex nested data updates', async () => {
      const assessmentId = 'complex-update-123';
      const updateData = {
        physical_symptoms: ['cramps', 'bloating', 'fatigue'],
        emotional_symptoms: ['anxiety', 'depression', 'irritability'],
        other_symptoms: ['headaches', 'nausea'],
        recommendations: [
          { title: 'Exercise', description: 'Regular cardio', priority: 'high' },
          { title: 'Diet', description: 'Balanced nutrition', priority: 'medium' },
          { title: 'Sleep', description: 'Adequate rest', priority: 'high' }
        ]
      };

      const transformedData = {
        physical_symptoms: '["cramps","bloating","fatigue"]',
        emotional_symptoms: '["anxiety","depression","irritability"]',
        other_symptoms: '["headaches","nausea"]',
        recommendations: '[{"title":"Exercise","description":"Regular cardio","priority":"high"},{"title":"Diet","description":"Balanced nutrition","priority":"medium"},{"title":"Sleep","description":"Adequate rest","priority":"high"}]'
      };

      const updatedRecord = {
        id: assessmentId,
        ...transformedData
      };

      TransformApiToDb.transform.mockReturnValue(transformedData);
      DbService.update.mockResolvedValue(updatedRecord);

      const result = await UpdateAssessment.execute(assessmentId, updateData);

      expect(TransformApiToDb.transform).toHaveBeenCalledWith(updateData);
      expect(DbService.update).toHaveBeenCalledWith('assessments', assessmentId, transformedData);
      expect(result).toEqual(updatedRecord);
    });

    it('should handle unexpected errors gracefully', async () => {
      const assessmentId = 'error-assessment-123';
      const updateData = { age: 30 };

      // Simulate unexpected error in transform
      TransformApiToDb.transform.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      await expect(UpdateAssessment.execute(assessmentId, updateData))
        .rejects.toThrow('Unexpected error');
    });
  });
}); 