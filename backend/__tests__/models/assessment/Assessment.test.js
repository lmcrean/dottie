import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import Assessment from '../../../models/assessment/assessment-main/Assessment.js';
import CreateAssessment from '../../../models/assessment/assessment-main/CreateAssessment.js';
import UpdateAssessment from '../../../models/assessment/assessment-main/UpdateAssessment.js';
import ReadAssessment from '../../../models/assessment/assessment-main/ReadAssessment.js';

// Mock the dependencies
vi.mock('../../../models/assessment/assessment-main/CreateAssessment.js');
vi.mock('../../../models/assessment/assessment-main/UpdateAssessment.js');
vi.mock('../../../models/assessment/assessment-main/ReadAssessment.js');

describe('Assessment', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('create', () => {
    it('should create a new assessment successfully', async () => {
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
      const mockResponse = {
        id: 'test-assessment-123',
        user_id: userId,
        created_at: new Date(),
        ...assessmentData
      };

      CreateAssessment.execute.mockResolvedValue(mockResponse);

      const result = await Assessment.create(assessmentData, userId);

      expect(CreateAssessment.execute).toHaveBeenCalledWith(assessmentData, userId);
      expect(result).toEqual(mockResponse);
    });

    it('should transform database response and remove updated_at fields', async () => {
      const assessmentData = {
        age: 25,
        pattern: 'regular',
        cycle_length: 28
      };
      const userId = 'test-user-123';
      const mockDbResponse = {
        id: 'test-assessment-123',
        created_at: new Date(),
        updated_at: new Date(),
        age: 25,
        pattern: 'regular',
        cycle_length: 28,
        physical_symptoms: '["cramps"]',
        emotional_symptoms: '["mood_swings"]'
      };
      const mockTransformed = {
        id: 'test-assessment-123',
        user_id: userId,
        created_at: mockDbResponse.created_at,
        age: 25,
        pattern: 'regular',
        cycle_length: 28,
        physical_symptoms: ['cramps'],
        emotional_symptoms: ['mood_swings'],
        updated_at: new Date(),
        updatedAt: new Date()
      };

      CreateAssessment.execute.mockResolvedValue(mockDbResponse);
      ReadAssessment.transformDbRecordToApiResponse.mockReturnValue(mockTransformed);

      const result = await Assessment.create(assessmentData, userId);

      expect(ReadAssessment.transformDbRecordToApiResponse).toHaveBeenCalledWith(mockDbResponse);
      expect(result.updated_at).toBeUndefined();
      expect(result.updatedAt).toBeUndefined();
    });

    it('should handle errors during creation', async () => {
      const assessmentData = { age: 25 };
      const userId = 'test-user-123';
      const error = new Error('Database connection failed');

      CreateAssessment.execute.mockRejectedValue(error);

      await expect(Assessment.create(assessmentData, userId))
        .rejects.toThrow('Database connection failed');
    });
  });

  describe('update', () => {
    it('should update an assessment successfully', async () => {
      const id = 'test-assessment-123';
      const assessmentData = {
        age: 26,
        pattern: 'irregular',
        pain_level: 4
      };
      const mockResponse = {
        id,
        age: 26,
        pattern: 'irregular',
        pain_level: 4,
        physical_symptoms: ['cramps'],
        emotional_symptoms: []
      };

      UpdateAssessment.execute.mockResolvedValue(mockResponse);

      const result = await Assessment.update(id, assessmentData);

      expect(UpdateAssessment.execute).toHaveBeenCalledWith(id, assessmentData);
      expect(result).toEqual(mockResponse);
    });

    it('should transform database response when updating', async () => {
      const id = 'test-assessment-123';
      const assessmentData = { age: 26 };
      const mockDbResponse = {
        id,
        age: 26,
        physical_symptoms: '["cramps"]',
        emotional_symptoms: '[]'
      };
      const mockTransformed = {
        id,
        age: 26,
        physical_symptoms: ['cramps'],
        emotional_symptoms: []
      };

      UpdateAssessment.execute.mockResolvedValue(mockDbResponse);
      ReadAssessment.transformDbRecordToApiResponse.mockReturnValue(mockTransformed);

      const result = await Assessment.update(id, assessmentData);

      expect(ReadAssessment.transformDbRecordToApiResponse).toHaveBeenCalledWith(mockDbResponse);
      expect(result).toEqual(mockTransformed);
    });

    it('should handle errors during update', async () => {
      const id = 'test-assessment-123';
      const assessmentData = { age: 26 };
      const error = new Error('Assessment not found');

      UpdateAssessment.execute.mockRejectedValue(error);

      await expect(Assessment.update(id, assessmentData))
        .rejects.toThrow('Assessment not found');
    });
  });

  describe('findById', () => {
    it('should find an assessment by ID', async () => {
      const id = 'test-assessment-123';
      const mockAssessment = {
        id,
        age: 25,
        pattern: 'regular'
      };

      ReadAssessment.findById.mockResolvedValue(mockAssessment);

      const result = await Assessment.findById(id);

      expect(ReadAssessment.findById).toHaveBeenCalledWith(id);
      expect(result).toEqual(mockAssessment);
    });

    it('should return null when assessment not found', async () => {
      const id = 'non-existent-id';

      ReadAssessment.findById.mockResolvedValue(null);

      const result = await Assessment.findById(id);

      expect(result).toBeNull();
    });
  });

  describe('_transformDbRecordToApiResponse', () => {
    it('should call ReadAssessment transform method', () => {
      const record = { id: '123', age: 25 };
      const mockTransformed = { id: '123', age: 25, physical_symptoms: [] };

      ReadAssessment.transformDbRecordToApiResponse.mockReturnValue(mockTransformed);

      const result = Assessment._transformDbRecordToApiResponse(record);

      expect(ReadAssessment.transformDbRecordToApiResponse).toHaveBeenCalledWith(record);
      expect(result).toEqual(mockTransformed);
    });
  });

  describe('_canProcessRecord', () => {
    it('should call ReadAssessment canProcessRecord method', () => {
      const record = { id: '123', age: 25 };

      ReadAssessment.canProcessRecord.mockReturnValue(true);

      const result = Assessment._canProcessRecord(record);

      expect(ReadAssessment.canProcessRecord).toHaveBeenCalledWith(record);
      expect(result).toBe(true);
    });
  });
}); 