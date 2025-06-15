import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { generateAssessment, generateUser, generateId } from '@/test-utilities/testFixtures.js';
import DbService from '@/services/dbService.js';
import Assessment from '../../Assessment.js';

// Mock dependencies
vi.mock('@/services/dbService.js');

describe('Assessment Creation Tests', () => {
  let mockUserId;
  let mockAssessmentData;
  let mockAssessmentId;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Generate test data
    mockUserId = generateId();
    mockAssessmentId = generateId();
    
    mockAssessmentData = {
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
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Successful Assessment Creation', () => {
    it('should create new assessment object with all required fields', async () => {
      // Setup mock
      const expectedCreatedAssessment = {
        id: mockAssessmentId,
        user_id: mockUserId,
        created_at: new Date().toISOString(),
        ...mockAssessmentData
      };

      DbService.create.mockResolvedValue(expectedCreatedAssessment);

      // Execute
      const result = await Assessment.create(mockAssessmentData, mockUserId);

      // Verify
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.user_id).toBe(mockUserId);
      expect(result.age).toBe(mockAssessmentData.age);
      expect(result.pattern).toBe(mockAssessmentData.pattern);
      expect(result.cycle_length).toBe(mockAssessmentData.cycle_length);
      expect(result.period_duration).toBe(mockAssessmentData.period_duration);
      expect(result.flow_heaviness).toBe(mockAssessmentData.flow_heaviness);
      expect(result.pain_level).toBe(mockAssessmentData.pain_level);
      expect(result.created_at).toBeDefined();
    });

    it('should include assessment_pattern in created assessment', async () => {
      const expectedCreatedAssessment = {
        id: mockAssessmentId,
        user_id: mockUserId,
        pattern: mockAssessmentData.pattern,
        created_at: new Date().toISOString(),
        ...mockAssessmentData
      };

      DbService.create.mockResolvedValue(expectedCreatedAssessment);

      const result = await Assessment.create(mockAssessmentData, mockUserId);

      expect(result.pattern).toBe('irregular');
      expect(result.pattern).toBeDefined();
    });

    it('should include physical_symptoms array in created assessment', async () => {
      const expectedCreatedAssessment = {
        id: mockAssessmentId,
        user_id: mockUserId,
        physical_symptoms: mockAssessmentData.physical_symptoms,
        created_at: new Date().toISOString(),
        ...mockAssessmentData
      };

      DbService.create.mockResolvedValue(expectedCreatedAssessment);

      const result = await Assessment.create(mockAssessmentData, mockUserId);

      expect(Array.isArray(result.physical_symptoms)).toBe(true);
      expect(result.physical_symptoms).toContain('bloating');
      expect(result.physical_symptoms).toContain('fatigue');
      expect(result.physical_symptoms).toContain('headaches');
    });

    it('should include emotional_symptoms array in created assessment', async () => {
      const expectedCreatedAssessment = {
        id: mockAssessmentId,
        user_id: mockUserId,
        emotional_symptoms: mockAssessmentData.emotional_symptoms,
        created_at: new Date().toISOString(),
        ...mockAssessmentData
      };

      DbService.create.mockResolvedValue(expectedCreatedAssessment);

      const result = await Assessment.create(mockAssessmentData, mockUserId);

      expect(Array.isArray(result.emotional_symptoms)).toBe(true);
      expect(result.emotional_symptoms).toContain('mood-swings');
      expect(result.emotional_symptoms).toContain('anxiety');
    });

    it('should call DbService.create with correct table and data', async () => {
      const expectedCreatedAssessment = {
        id: mockAssessmentId,
        user_id: mockUserId,
        created_at: new Date().toISOString(),
        ...mockAssessmentData
      };

      DbService.create.mockResolvedValue(expectedCreatedAssessment);

      await Assessment.create(mockAssessmentData, mockUserId);

      // Verify DbService.create was called with correct parameters
      expect(DbService.create).toHaveBeenCalledWith('assessments', expect.objectContaining({
        id: expect.any(String),
        user_id: mockUserId,
        created_at: expect.any(Date),
        age: mockAssessmentData.age,
        pattern: mockAssessmentData.pattern,
        cycle_length: mockAssessmentData.cycle_length,
        period_duration: mockAssessmentData.period_duration,
        flow_heaviness: mockAssessmentData.flow_heaviness,
        pain_level: mockAssessmentData.pain_level
      }));
    });
  });

  describe('Error Handling', () => {
    it('should throw error when DbService.create fails', async () => {
      const dbError = new Error('Database connection failed');
      DbService.create.mockRejectedValue(dbError);

      await expect(Assessment.create(mockAssessmentData, mockUserId))
        .rejects.toThrow('Database connection failed');
    });

    it('should handle missing user_id by creating assessment with null user_id', async () => {
      const expectedCreatedAssessment = {
        id: mockAssessmentId,
        user_id: null,
        created_at: new Date().toISOString(),
        ...mockAssessmentData
      };

      DbService.create.mockResolvedValue(expectedCreatedAssessment);

      const result = await Assessment.create(mockAssessmentData, null);
      
      expect(result.user_id).toBeNull();
    });
  });
}); 