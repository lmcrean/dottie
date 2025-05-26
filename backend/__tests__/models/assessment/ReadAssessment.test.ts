import FormatDetector from '../types/common'
import TransformDbToApi from '../types/common'
import ReadAssessment from '../types/common'
import DbService from '../../../../db/index.js'
import { TestRequestBody, TestOptions, MockResponse, TestUserOverrides, TestCycleOverrides, TestSymptomOverrides, TestAssessmentOverrides } from '../../../types/common';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import

// Mock dependencies
vi.mock('../../../services/dbService.ts');
vi.mock('../../../models/assessment/assessment-main/TransformDbToApi.ts');
vi.mock('../../../models/assessment/assessment-base/FormatDetector.ts');

describe('ReadAssessment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Spy on console.error
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  describe('findById', () => {
    it('should find and transform assessment from database', async () => {
      const testId = 'db-assessment-123';
      const dbAssessment = {
        id: testId,
        user_id: 'test-user-123',
        age: 30,
        pattern: 'irregular',
        cycle_length: 25,
        physical_symptoms: '["bloating", "cramps"]',
        emotional_symptoms: '["anxiety"]',
        other_symptoms: '["headaches"]',
        recommendations: '[{"title": "Exercise", "description": "Regular exercise"}]'
      };
      const transformedAssessment = {
        id: testId,
        user_id: 'test-user-123',
        age: 30,
        pattern: 'irregular',
        cycle_length: 25,
        physical_symptoms: ['bloating', 'cramps'],
        emotional_symptoms: ['anxiety'],
        other_symptoms: ['headaches'],
        recommendations: [{ title: 'Exercise', description: 'Regular exercise' }]
      };

      DbService.findById.mockResolvedValue(dbAssessment);
      FormatDetector.isCurrentFormat.mockReturnValue(true);
      TransformDbToApi.transform.mockReturnValue(transformedAssessment);

      const result = await ReadAssessment.findById(testId);

      expect(DbService.findById).toHaveBeenCalledWith('assessments', testId);
      expect(FormatDetector.isCurrentFormat).toHaveBeenCalledWith(dbAssessment);
      expect(TransformDbToApi.transform).toHaveBeenCalledWith(dbAssessment);
      expect(result).toEqual(transformedAssessment);
    });

    it('should return null when assessment not found in database', async () => {
      const testId = 'non-existent-id';

      DbService.findById.mockResolvedValue(null);

      const result = await ReadAssessment.findById(testId);

      expect(DbService.findById).toHaveBeenCalledWith('assessments', testId);
      expect(FormatDetector.isCurrentFormat).not.toHaveBeenCalled();
      expect(TransformDbToApi.transform).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when assessment format cannot be processed', async () => {
      const testId = 'legacy-assessment-123';
      const legacyAssessment = {
        id: testId,
        assessment_data: '{"some": "legacy data"}' // Legacy format
      };

      DbService.findById.mockResolvedValue(legacyAssessment);
      FormatDetector.isCurrentFormat.mockReturnValue(false);

      const result = await ReadAssessment.findById(testId);

      expect(DbService.findById).toHaveBeenCalledWith('assessments', testId);
      expect(FormatDetector.isCurrentFormat).toHaveBeenCalledWith(legacyAssessment);
      expect(TransformDbToApi.transform).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should handle database errors gracefully', async () => {
      const testId = 'error-assessment-123';
      const error = new Error('Database connection failed');

      DbService.findById.mockRejectedValue(error);

      await expect(ReadAssessment.findById(testId))
        .rejects.toThrow('Database connection failed');

      expect(console.error).toHaveBeenCalledWith(
        'Error finding assessment by ID error-assessment-123:',
        error
      );
    });

    it('should handle transform errors gracefully', async () => {
      const testId = 'transform-error-123';
      const dbAssessment = { id: testId, age: 25 };
      const transformError = new Error('Transform failed');

      DbService.findById.mockResolvedValue(dbAssessment);
      FormatDetector.isCurrentFormat.mockReturnValue(true);
      TransformDbToApi.transform.mockImplementation(() => {
        throw transformError;
      });

      await expect(ReadAssessment.findById(testId))
        .rejects.toThrow('Transform failed');

      expect(console.error).toHaveBeenCalledWith(
        'Error finding assessment by ID transform-error-123:',
        transformError
      );
    });
  });

  describe('transformDbRecordToApiResponse', () => {
    it('should call TransformDbToApi.transform', () => {
      const record = {
        id: 'test-123',
        age: 25,
        physical_symptoms: '["cramps"]'
      };
      const transformed = {
        id: 'test-123',
        age: 25,
        physical_symptoms: ['cramps']
      };

      TransformDbToApi.transform.mockReturnValue(transformed);

      const result = ReadAssessment.transformDbRecordToApiResponse(record);

      expect(TransformDbToApi.transform).toHaveBeenCalledWith(record);
      expect(result).toEqual(transformed);
    });

    it('should handle null record', () => {
      TransformDbToApi.transform.mockReturnValue(null);

      const result = ReadAssessment.transformDbRecordToApiResponse(null);

      expect(TransformDbToApi.transform).toHaveBeenCalledWith(null);
      expect(result).toBeNull();
    });
  });

  describe('canProcessRecord', () => {
    it('should call FormatDetector.isCurrentFormat', () => {
      const record = {
        id: 'test-123',
        age: 25,
        pattern: 'regular'
      };

      FormatDetector.isCurrentFormat.mockReturnValue(true);

      const result = ReadAssessment.canProcessRecord(record);

      expect(FormatDetector.isCurrentFormat).toHaveBeenCalledWith(record);
      expect(result).toBe(true);
    });

    it('should return false for legacy format', () => {
      const legacyRecord = {
        id: 'test-123',
        assessment_data: '{"legacy": "data"}'
      };

      FormatDetector.isCurrentFormat.mockReturnValue(false);

      const result = ReadAssessment.canProcessRecord(legacyRecord);

      expect(FormatDetector.isCurrentFormat).toHaveBeenCalledWith(legacyRecord);
      expect(result).toBe(false);
    });
  });
}); 

