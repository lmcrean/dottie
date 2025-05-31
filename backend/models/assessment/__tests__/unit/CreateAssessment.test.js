import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import CreateAssessment from '../../services/CreateAssessment.js';
import DbService from '../../../../services/dbService.js';
import TransformApiToDb from '../../transformers/TransformApiToDb.js';

// Mock dependencies
vi.mock('../../../../services/dbService.js');
vi.mock('../../transformers/TransformApiToDb.js');
vi.mock('uuid', () => ({
  v4: () => 'test-uuid-123'
}));

describe('CreateAssessment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('execute', () => {
    it('should create assessment successfully', async () => {
      const assessmentData = {
        age: 25,
        pattern: 'regular',
        cycle_length: 28,
        period_duration: 5,
        flow_heaviness: 'medium',
        pain_level: 3,
        physical_symptoms: ['cramps', 'bloating'],
        emotional_symptoms: ['mood_swings'],
        other_symptoms: 'headaches',
        recommendations: ['exercise', 'hydration']
      };
      const userId = 'test-user-123';
      const transformedData = {
        age: 25,
        pattern: 'regular',
        cycle_length: 28,
        period_duration: 5,
        flow_heaviness: 'medium',
        pain_level: 3,
        physical_symptoms: '["cramps","bloating"]',
        emotional_symptoms: '["mood_swings"]',
        other_symptoms: '["headaches"]',
        recommendations: '["exercise","hydration"]'
      };
      const expectedResult = {
        id: 'test-uuid-123',
        user_id: userId,
        created_at: expect.any(Date),
        ...transformedData
      };

      TransformApiToDb.transform.mockReturnValue(transformedData);
      DbService.create.mockResolvedValue(expectedResult);

      const result = await CreateAssessment.execute(assessmentData, userId);

      expect(TransformApiToDb.transform).toHaveBeenCalledWith(assessmentData);
      expect(DbService.create).toHaveBeenCalledWith('assessments', {
        id: 'test-uuid-123',
        user_id: userId,
        created_at: expect.any(Date),
        ...transformedData
      });
      expect(result).toEqual(expectedResult);
    });

    it('should handle database errors', async () => {
      const assessmentData = { age: 25 };
      const userId = 'test-user-123';
      const error = new Error('Database connection failed');

      TransformApiToDb.transform.mockReturnValue({});
      DbService.create.mockRejectedValue(error);

      await expect(CreateAssessment.execute(assessmentData, userId))
        .rejects.toThrow('Database connection failed');

      expect(DbService.create).toHaveBeenCalled();
    });

    it('should include all required metadata in database payload', async () => {
      const assessmentData = { age: 25 };
      const userId = 'test-user-123';
      const transformedData = { age: 25 };

      TransformApiToDb.transform.mockReturnValue(transformedData);
      DbService.create.mockResolvedValue({});

      await CreateAssessment.execute(assessmentData, userId);

      const expectedPayload = {
        id: 'test-uuid-123',
        user_id: userId,
        created_at: expect.any(Date),
        age: 25
      };

      expect(DbService.create).toHaveBeenCalledWith('assessments', expectedPayload);
    });

    it('should propagate errors from TransformApiToDb', async () => {
      const assessmentData = { age: 25 };
      const userId = 'test-user-123';
      const error = new Error('Transform failed');

      TransformApiToDb.transform.mockImplementation(() => {
        throw error;
      });

      await expect(CreateAssessment.execute(assessmentData, userId))
        .rejects.toThrow('Transform failed');
    });

    it('should handle unexpected errors gracefully', async () => {
      const assessmentData = { age: 25 };
      const userId = 'test-user-123';

      // Simulate unexpected error by mocking Date constructor
      const originalDate = global.Date;
      global.Date = class extends Date {
        constructor(...args) {
          if (args.length === 0) {
            throw new Error('Unexpected error');
          }
          return super(...args);
        }
      };

      await expect(CreateAssessment.execute(assessmentData, userId))
        .rejects.toThrow('Unexpected error');

      // Restore original Date
      global.Date = originalDate;
    });
  });
}); 