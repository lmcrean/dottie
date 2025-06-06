import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { generateId } from '@/test-utilities/testFixtures.js';
import Assessment from '../../Assessment.js';
import DbService from '@/services/dbService.js';

// Mock dependencies
vi.mock('@/services/dbService.js');

describe('Get Assessments By User ID Tests', () => {
  let mockUserId;
  let mockAssessmentData1;
  let mockAssessmentData2;
  let mockAssessmentData3;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Generate test data
    mockUserId = generateId();
    
    mockAssessmentData1 = {
      id: generateId(),
      user_id: mockUserId,
      created_at: '2024-01-15T10:00:00.000Z',
      age: '25-34',
      pattern: 'irregular',
      cycle_length: '28-30',
      period_duration: '4-5',
      flow_heaviness: 'medium',
      pain_level: 'moderate',
      physical_symptoms: ['bloating', 'fatigue', 'headaches'],
      emotional_symptoms: ['mood-swings', 'anxiety'],
      other_symptoms: 'cramping',
      recommendations: [
        { title: 'Exercise', description: 'Regular exercise can help' },
        { title: 'Diet', description: 'Balanced diet recommendations' }
      ]
    };

    mockAssessmentData2 = {
      id: generateId(),
      user_id: mockUserId,
      created_at: '2024-01-16T10:00:00.000Z',
      age: '25-34',
      pattern: 'regular',
      cycle_length: '28',
      period_duration: '5-6',
      flow_heaviness: 'heavy',
      pain_level: 'severe',
      physical_symptoms: ['cramps', 'bloating'],
      emotional_symptoms: ['irritability'],
      other_symptoms: 'nausea',
      recommendations: [
        { title: 'Pain Management', description: 'Consider pain relief options' }
      ]
    };

    mockAssessmentData3 = {
      id: generateId(),
      user_id: mockUserId,
      created_at: '2024-01-17T10:00:00.000Z',
      age: '25-34',
      pattern: 'short',
      cycle_length: '21',
      period_duration: '3-4',
      flow_heaviness: 'light',
      pain_level: 'mild',
      physical_symptoms: ['fatigue'],
      emotional_symptoms: ['mood-swings'],
      other_symptoms: 'none',
      recommendations: [
        { title: 'Monitoring', description: 'Continue tracking symptoms' }
      ]
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Successful Assessment List Retrieval', () => {
    it('should get list of assessments by user_id', async () => {
      const mockAssessments = [mockAssessmentData1, mockAssessmentData2, mockAssessmentData3];
      DbService.findBy.mockResolvedValue(mockAssessments);

      const result = await Assessment.listByUser(mockUserId);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(3);
      expect(result[0].user_id).toBe(mockUserId);
      expect(result[1].user_id).toBe(mockUserId);
      expect(result[2].user_id).toBe(mockUserId);
    });

    it('should include assessment_pattern for each assessment in list', async () => {
      const mockAssessments = [mockAssessmentData1, mockAssessmentData2, mockAssessmentData3];
      DbService.findBy.mockResolvedValue(mockAssessments);

      const result = await Assessment.listByUser(mockUserId);

      expect(result[0].pattern).toBe('irregular');
      expect(result[1].pattern).toBe('regular');
      expect(result[2].pattern).toBe('short');
      
      // Ensure all assessments have pattern field
      result.forEach(assessment => {
        expect(assessment.pattern).toBeDefined();
      });
    });

    it('should include all required fields for each assessment in list', async () => {
      const mockAssessments = [mockAssessmentData1, mockAssessmentData2, mockAssessmentData3];
      DbService.findBy.mockResolvedValue(mockAssessments);

      const result = await Assessment.listByUser(mockUserId);

      result.forEach(assessment => {
        expect(assessment.id).toBeDefined();
        expect(assessment.user_id).toBe(mockUserId);
        expect(assessment.created_at).toBeDefined();
        expect(assessment.age).toBeDefined();
        expect(assessment.pattern).toBeDefined();
        expect(assessment.cycle_length).toBeDefined();
        expect(assessment.period_duration).toBeDefined();
        expect(assessment.flow_heaviness).toBeDefined();
        expect(assessment.pain_level).toBeDefined();
        expect(Array.isArray(assessment.physical_symptoms)).toBe(true);
        expect(Array.isArray(assessment.emotional_symptoms)).toBe(true);
        expect(Array.isArray(assessment.recommendations)).toBe(true);
      });
    });

    it('should include physical_symptoms arrays for each assessment', async () => {
      const mockAssessments = [mockAssessmentData1, mockAssessmentData2, mockAssessmentData3];
      DbService.findBy.mockResolvedValue(mockAssessments);

      const result = await Assessment.listByUser(mockUserId);

      expect(Array.isArray(result[0].physical_symptoms)).toBe(true);
      expect(result[0].physical_symptoms).toContain('bloating');
      expect(result[0].physical_symptoms).toContain('fatigue');
      expect(result[0].physical_symptoms).toContain('headaches');

      expect(Array.isArray(result[1].physical_symptoms)).toBe(true);
      expect(result[1].physical_symptoms).toContain('cramps');
      expect(result[1].physical_symptoms).toContain('bloating');

      expect(Array.isArray(result[2].physical_symptoms)).toBe(true);
      expect(result[2].physical_symptoms).toContain('fatigue');
    });

    it('should include emotional_symptoms arrays for each assessment', async () => {
      const mockAssessments = [mockAssessmentData1, mockAssessmentData2, mockAssessmentData3];
      DbService.findBy.mockResolvedValue(mockAssessments);

      const result = await Assessment.listByUser(mockUserId);

      expect(Array.isArray(result[0].emotional_symptoms)).toBe(true);
      expect(result[0].emotional_symptoms).toContain('mood-swings');
      expect(result[0].emotional_symptoms).toContain('anxiety');

      expect(Array.isArray(result[1].emotional_symptoms)).toBe(true);
      expect(result[1].emotional_symptoms).toContain('irritability');

      expect(Array.isArray(result[2].emotional_symptoms)).toBe(true);
      expect(result[2].emotional_symptoms).toContain('mood-swings');
    });

    it('should call DbService.findBy with correct table and user_id', async () => {
      const mockAssessments = [mockAssessmentData1, mockAssessmentData2, mockAssessmentData3];
      DbService.findBy.mockResolvedValue(mockAssessments);

      await Assessment.listByUser(mockUserId);

      expect(DbService.findBy).toHaveBeenCalledWith('assessments', 'user_id', mockUserId);
    });
  });

  describe('Empty Results Cases', () => {
    it('should return empty array when user has no assessments', async () => {
      DbService.findBy.mockResolvedValue([]);

      const result = await Assessment.listByUser(mockUserId);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });

    it('should return empty array for non-existent user', async () => {
      DbService.findBy.mockResolvedValue([]);

      const result = await Assessment.listByUser('non-existent-user');

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should throw error when database operation fails', async () => {
      const dbError = new Error('Database connection failed');
      DbService.findBy.mockRejectedValue(dbError);

      await expect(Assessment.listByUser(mockUserId))
        .rejects.toThrow('Database connection failed');
    });

    it('should handle invalid user_id format', async () => {
      const dbError = new Error('Invalid user ID format');
      DbService.findBy.mockRejectedValue(dbError);

      await expect(Assessment.listByUser('invalid-user-id'))
        .rejects.toThrow('Invalid user ID format');
    });
  });

  describe('Single Assessment Cases', () => {
    it('should return single assessment in array format', async () => {
      const mockAssessments = [mockAssessmentData1];
      DbService.findBy.mockResolvedValue(mockAssessments);

      const result = await Assessment.listByUser(mockUserId);

      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(mockAssessmentData1.id);
      expect(result[0].pattern).toBe('irregular');
    });
  });
}); 