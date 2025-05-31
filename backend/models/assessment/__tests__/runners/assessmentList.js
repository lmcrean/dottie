import { describe, it, expect, beforeEach } from 'vitest';
import Assessment from '../../Assessment.js';
import DbService from '@/services/dbService.js';

/**
 * Tests for assessment list retrieval scenarios - specifically testing that
 * list of assessments contains assessment_pattern and all other fields
 */
export const runAssessmentListTests = (mockData) => {
  const { mockUserId, mockAssessmentData1, mockAssessmentData2, mockAssessmentData3 } = mockData;

  describe('Assessment List Workflow - Pattern and All Fields', () => {
    beforeEach(() => {
      // Setup mocks for successful list retrieval scenarios
      const mockAssessments = [mockAssessmentData1, mockAssessmentData2, mockAssessmentData3];
      DbService.findBy.mockResolvedValue(mockAssessments);
    });

    it('should retrieve list of assessments with assessment_pattern for each', async () => {
      const result = await Assessment.listByUser(mockUserId);
      
      // Verify list contains assessments with patterns
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(3);
      
      // Verify each assessment has pattern field (assessment_pattern)
      expect(result[0].pattern).toBe('irregular');
      expect(result[1].pattern).toBe('regular');
      expect(result[2].pattern).toBe('short');
      
      // Ensure all assessments have pattern field defined
      result.forEach(assessment => {
        expect(assessment.pattern).toBeDefined();
        expect(typeof assessment.pattern).toBe('string');
      });
    });

    it('should retrieve list with all required fields for each assessment', async () => {
      const result = await Assessment.listByUser(mockUserId);
      
      // Verify all assessments have all required fields
      result.forEach((assessment, index) => {
        expect(assessment.id).toBeDefined();
        expect(assessment.user_id).toBe(mockUserId);
        expect(assessment.created_at).toBeDefined();
        expect(assessment.age).toBeDefined();
        expect(assessment.pattern).toBeDefined(); // assessment_pattern
        expect(assessment.cycle_length).toBeDefined();
        expect(assessment.period_duration).toBeDefined();
        expect(assessment.flow_heaviness).toBeDefined();
        expect(assessment.pain_level).toBeDefined();
        expect(assessment.other_symptoms).toBeDefined();
      });
    });

    it('should retrieve list with physical_symptoms arrays for each assessment', async () => {
      const result = await Assessment.listByUser(mockUserId);
      
      // Verify all assessments have physical_symptoms as arrays
      result.forEach(assessment => {
        expect(Array.isArray(assessment.physical_symptoms)).toBe(true);
        expect(assessment.physical_symptoms.length).toBeGreaterThan(0);
      });
      
      // Verify specific symptoms for each assessment
      expect(result[0].physical_symptoms).toContain('bloating');
      expect(result[0].physical_symptoms).toContain('fatigue');
      expect(result[0].physical_symptoms).toContain('headaches');
      
      expect(result[1].physical_symptoms).toContain('cramps');
      expect(result[1].physical_symptoms).toContain('bloating');
      
      expect(result[2].physical_symptoms).toContain('fatigue');
    });

    it('should retrieve list with emotional_symptoms arrays for each assessment', async () => {
      const result = await Assessment.listByUser(mockUserId);
      
      // Verify all assessments have emotional_symptoms as arrays
      result.forEach(assessment => {
        expect(Array.isArray(assessment.emotional_symptoms)).toBe(true);
        expect(assessment.emotional_symptoms.length).toBeGreaterThan(0);
      });
      
      // Verify specific symptoms for each assessment
      expect(result[0].emotional_symptoms).toContain('mood-swings');
      expect(result[0].emotional_symptoms).toContain('anxiety');
      
      expect(result[1].emotional_symptoms).toContain('irritability');
      
      expect(result[2].emotional_symptoms).toContain('mood-swings');
    });

    it('should retrieve list with recommendations arrays for each assessment', async () => {
      const result = await Assessment.listByUser(mockUserId);
      
      // Verify all assessments have recommendations as arrays of objects
      result.forEach(assessment => {
        expect(Array.isArray(assessment.recommendations)).toBe(true);
        expect(assessment.recommendations.length).toBeGreaterThan(0);
        
        // Verify each recommendation has title and description
        assessment.recommendations.forEach(rec => {
          expect(rec).toHaveProperty('title');
          expect(rec).toHaveProperty('description');
          expect(typeof rec.title).toBe('string');
          expect(typeof rec.description).toBe('string');
        });
      });
      
      // Verify specific recommendations
      expect(result[0].recommendations[0]).toHaveProperty('title', 'Exercise');
      expect(result[1].recommendations[0]).toHaveProperty('title', 'Pain Management');
      expect(result[2].recommendations[0]).toHaveProperty('title', 'Monitoring');
    });

    it('should retrieve list with different assessment patterns', async () => {
      const result = await Assessment.listByUser(mockUserId);
      
      // Verify we have different patterns in the list
      const patterns = result.map(assessment => assessment.pattern);
      expect(patterns).toContain('irregular');
      expect(patterns).toContain('regular');
      expect(patterns).toContain('short');
      
      // Verify patterns are unique in this test case
      const uniquePatterns = [...new Set(patterns)];
      expect(uniquePatterns).toHaveLength(3);
    });

    it('should retrieve list ordered by created_at', async () => {
      const result = await Assessment.listByUser(mockUserId);
      
      // Verify timestamps exist and are valid
      result.forEach(assessment => {
        expect(assessment.created_at).toBeDefined();
        expect(() => new Date(assessment.created_at)).not.toThrow();
      });
      
      // In our test data, they should be in chronological order
      expect(new Date(result[0].created_at)).toEqual(new Date('2024-01-15T10:00:00.000Z'));
      expect(new Date(result[1].created_at)).toEqual(new Date('2024-01-16T10:00:00.000Z'));
      expect(new Date(result[2].created_at)).toEqual(new Date('2024-01-17T10:00:00.000Z'));
    });

    it('should call database service with correct user_id filter', async () => {
      await Assessment.listByUser(mockUserId);
      
      // Verify DbService.findBy was called with correct parameters
      expect(DbService.findBy).toHaveBeenCalledWith('assessments', 'user_id', mockUserId);
    });

    it('should return empty array when user has no assessments', async () => {
      DbService.findBy.mockResolvedValue([]);
      
      const result = await Assessment.listByUser('user-with-no-assessments');
      
      expect(Array.isArray(result)).toBe(true);
      expect(result).toHaveLength(0);
    });
  });
}; 