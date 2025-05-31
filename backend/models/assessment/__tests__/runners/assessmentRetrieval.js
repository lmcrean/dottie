import { describe, it, expect, beforeEach } from 'vitest';
import Assessment from '../../Assessment.js';
import DbService from '@/services/dbService.js';

/**
 * Tests for assessment retrieval scenarios
 */
export const runAssessmentRetrievalTests = (mockData) => {
  const { mockAssessmentId1, mockAssessmentData1 } = mockData;

  describe('Assessment Retrieval Workflow', () => {
    beforeEach(() => {
      // Setup mocks for successful retrieval scenarios
      DbService.findById.mockResolvedValue(mockAssessmentData1);
    });

    it('should retrieve assessment by ID with all required fields', async () => {
      const result = await Assessment.findById(mockAssessmentId1);
      
      // Verify assessment was retrieved with all required fields
      expect(result).toBeDefined();
      expect(result.id).toBe(mockAssessmentId1);
      expect(result.user_id).toBe(mockAssessmentData1.user_id);
      expect(result.age).toBe(mockAssessmentData1.age);
      expect(result.pattern).toBe(mockAssessmentData1.pattern);
      expect(result.cycle_length).toBe(mockAssessmentData1.cycle_length);
      expect(result.period_duration).toBe(mockAssessmentData1.period_duration);
      expect(result.flow_heaviness).toBe(mockAssessmentData1.flow_heaviness);
      expect(result.pain_level).toBe(mockAssessmentData1.pain_level);
      expect(result.created_at).toBe(mockAssessmentData1.created_at);
    });

    it('should retrieve assessment with assessment_pattern field', async () => {
      const result = await Assessment.findById(mockAssessmentId1);
      
      // Verify the pattern field (assessment_pattern) is included
      expect(result.pattern).toBe('irregular');
      expect(result.pattern).toBeDefined();
    });

    it('should retrieve assessment with physical_symptoms array', async () => {
      const result = await Assessment.findById(mockAssessmentId1);
      
      // Verify physical_symptoms is properly retrieved as array
      expect(Array.isArray(result.physical_symptoms)).toBe(true);
      expect(result.physical_symptoms).toContain('bloating');
      expect(result.physical_symptoms).toContain('fatigue');
      expect(result.physical_symptoms).toContain('headaches');
      expect(result.physical_symptoms).toHaveLength(3);
    });

    it('should retrieve assessment with emotional_symptoms array', async () => {
      const result = await Assessment.findById(mockAssessmentId1);
      
      // Verify emotional_symptoms is properly retrieved as array
      expect(Array.isArray(result.emotional_symptoms)).toBe(true);
      expect(result.emotional_symptoms).toContain('mood-swings');
      expect(result.emotional_symptoms).toContain('anxiety');
      expect(result.emotional_symptoms).toHaveLength(2);
    });

    it('should retrieve assessment with recommendations array', async () => {
      const result = await Assessment.findById(mockAssessmentId1);
      
      // Verify recommendations is properly retrieved as array of objects
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.recommendations).toHaveLength(2);
      expect(result.recommendations[0]).toHaveProperty('title', 'Exercise');
      expect(result.recommendations[0]).toHaveProperty('description', 'Regular exercise can help');
      expect(result.recommendations[1]).toHaveProperty('title', 'Diet');
      expect(result.recommendations[1]).toHaveProperty('description', 'Balanced diet recommendations');
    });

    it('should retrieve assessment with other_symptoms field', async () => {
      const result = await Assessment.findById(mockAssessmentId1);
      
      // Verify other_symptoms field is included
      // Note: The actual implementation may return this as an array due to parsing
      if (Array.isArray(result.other_symptoms)) {
        expect(result.other_symptoms).toContain('cramping');
      } else {
        expect(result.other_symptoms).toBe('cramping');
      }
      expect(result.other_symptoms).toBeDefined();
    });

    it('should call database service with correct parameters', async () => {
      await Assessment.findById(mockAssessmentId1);
      
      // Verify DbService.findById was called with correct table and ID
      expect(DbService.findById).toHaveBeenCalledWith('assessments', mockAssessmentId1);
    });

    it('should return null for non-existent assessment', async () => {
      DbService.findById.mockResolvedValue(null);
      
      const result = await Assessment.findById('non-existent-id');
      
      expect(result).toBeNull();
    });

    it('should handle assessment with created_at timestamp', async () => {
      const result = await Assessment.findById(mockAssessmentId1);
      
      expect(result.created_at).toBe('2024-01-15T10:00:00.000Z');
      expect(() => new Date(result.created_at)).not.toThrow();
    });
  });
}; 