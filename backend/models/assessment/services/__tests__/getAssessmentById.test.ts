import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { generateId } from '@/test-utilities/testFixtures.js';
import Assessment from '../../Assessment.js';
import DbService from '@/services/dbService.js';

// Mock dependencies
vi.mock('@/services/dbService.js');

describe('Get Assessment By ID Tests', () => {
  let mockAssessmentId;
  let mockUserId;
  let mockAssessmentData;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Generate test data
    mockAssessmentId = generateId();
    mockUserId = generateId();
    
    mockAssessmentData = {
      id: mockAssessmentId,
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
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Successful Assessment Retrieval', () => {
    it('should get assessment object by id with all required fields', async () => {
      // Mock the full transformation flow
      DbService.findById.mockResolvedValue(mockAssessmentData);

      // Execute
      const result = await Assessment.findById(mockAssessmentId);

      // Verify
      expect(result).toBeDefined();
      expect(result.id).toBe(mockAssessmentId);
      expect(result.user_id).toBe(mockUserId);
      expect(result.age).toBe('25-34');
      expect(result.pattern).toBe('irregular');
      expect(result.cycle_length).toBe('28-30');
      expect(result.period_duration).toBe('4-5');
      expect(result.flow_heaviness).toBe('medium');
      expect(result.pain_level).toBe('moderate');
      expect(result.created_at).toBe('2024-01-15T10:00:00.000Z');
    });

    it('should include assessment_pattern in retrieved assessment', async () => {
      DbService.findById.mockResolvedValue(mockAssessmentData);

      const result = await Assessment.findById(mockAssessmentId);

      expect(result.pattern).toBe('irregular');
      expect(result.pattern).toBeDefined();
    });

    it('should include physical_symptoms array in retrieved assessment', async () => {
      DbService.findById.mockResolvedValue(mockAssessmentData);

      const result = await Assessment.findById(mockAssessmentId);

      expect(Array.isArray(result.physical_symptoms)).toBe(true);
      expect(result.physical_symptoms).toContain('bloating');
      expect(result.physical_symptoms).toContain('fatigue');
      expect(result.physical_symptoms).toContain('headaches');
    });

    it('should include emotional_symptoms array in retrieved assessment', async () => {
      DbService.findById.mockResolvedValue(mockAssessmentData);

      const result = await Assessment.findById(mockAssessmentId);

      expect(Array.isArray(result.emotional_symptoms)).toBe(true);
      expect(result.emotional_symptoms).toContain('mood-swings');
      expect(result.emotional_symptoms).toContain('anxiety');
    });

    it('should include recommendations array in retrieved assessment', async () => {
      DbService.findById.mockResolvedValue(mockAssessmentData);

      const result = await Assessment.findById(mockAssessmentId);

      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.recommendations).toHaveLength(2);
      expect(result.recommendations[0]).toHaveProperty('title', 'Exercise');
      expect(result.recommendations[0]).toHaveProperty('description', 'Regular exercise can help');
      expect(result.recommendations[1]).toHaveProperty('title', 'Diet');
      expect(result.recommendations[1]).toHaveProperty('description', 'Balanced diet recommendations');
    });

    it('should call DbService with correct assessment ID', async () => {
      DbService.findById.mockResolvedValue(mockAssessmentData);

      await Assessment.findById(mockAssessmentId);

      // The actual implementation uses RouteAssessment which eventually calls DbService
      // through the transformation pipeline, so we verify the final DbService call
      expect(DbService.findById).toHaveBeenCalledWith('assessments', mockAssessmentId);
    });
  });

  describe('Assessment Not Found Cases', () => {
    it('should return null when assessment does not exist', async () => {
      DbService.findById.mockResolvedValue(null);

      const result = await Assessment.findById('non-existent-id');

      expect(result).toBeNull();
    });

    it('should return null for invalid assessment ID format', async () => {
      DbService.findById.mockResolvedValue(null);

      const result = await Assessment.findById('invalid-id');

      expect(result).toBeNull();
    });
  });

  describe('Error Handling', () => {
    it('should throw error when database operation fails', async () => {
      const dbError = new Error('Database connection failed');
      DbService.findById.mockRejectedValue(dbError);

      await expect(Assessment.findById(mockAssessmentId))
        .rejects.toThrow('Database connection failed');
    });

    it('should handle malformed assessment data gracefully', async () => {
      const malformedData = { 
        id: mockAssessmentId,
        // Missing required fields
      };
      DbService.findById.mockResolvedValue(malformedData);

      const result = await Assessment.findById(mockAssessmentId);

      // The actual implementation transforms malformed data and returns an object with undefined fields
      expect(result).not.toBeNull();
      expect(result.id).toBe(mockAssessmentId);
      expect(result.age).toBeUndefined();
      expect(result.pattern).toBeUndefined();
      expect(result.physical_symptoms).toEqual([]);
      expect(result.emotional_symptoms).toEqual([]);
      expect(result.recommendations).toEqual([]);
    });
  });
}); 