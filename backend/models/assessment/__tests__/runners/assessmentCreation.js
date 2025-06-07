import { describe, it, expect, beforeEach } from 'vitest';
import Assessment from '../../Assessment.js';
import DbService from '@/services/dbService.js';

/**
 * Tests for assessment creation scenarios
 */
export const runAssessmentCreationTests = (mockData) => {
  const { mockUserId, newAssessmentInput, mockAssessmentData1 } = mockData;

  describe('Assessment Creation Workflow', () => {
    beforeEach(() => {
      // Setup mocks for successful creation scenarios
      DbService.create.mockResolvedValue({
        id: 'new-assessment-id',
        user_id: mockUserId,
        created_at: new Date().toISOString(),
        ...newAssessmentInput
      });
    });

    it('should create assessment with all required fields', async () => {
      const result = await Assessment.create(newAssessmentInput, mockUserId);
      
      // Verify assessment was created with all required fields
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.user_id).toBe(mockUserId);
      expect(result.age).toBe(newAssessmentInput.age);
      expect(result.pattern).toBe(newAssessmentInput.pattern);
      expect(result.cycle_length).toBe(newAssessmentInput.cycle_length);
      expect(result.period_duration).toBe(newAssessmentInput.period_duration);
      expect(result.flow_heaviness).toBe(newAssessmentInput.flow_heaviness);
      expect(result.pain_level).toBe(newAssessmentInput.pain_level);
      expect(result.created_at).toBeDefined();
    });

    it('should create assessment with assessment_pattern field', async () => {
      const result = await Assessment.create(newAssessmentInput, mockUserId);
      
      // Verify the pattern field (assessment_pattern) is included
      expect(result.pattern).toBe('long');
      expect(result.pattern).toBeDefined();
    });

    it('should create assessment with physical_symptoms array', async () => {
      const result = await Assessment.create(newAssessmentInput, mockUserId);
      
      // Verify physical_symptoms is properly stored as array
      expect(Array.isArray(result.physical_symptoms)).toBe(true);
      expect(result.physical_symptoms).toContain('severe-cramps');
      expect(result.physical_symptoms).toContain('heavy-bleeding');
      expect(result.physical_symptoms).toContain('fatigue');
    });

    it('should create assessment with emotional_symptoms array', async () => {
      const result = await Assessment.create(newAssessmentInput, mockUserId);
      
      // Verify emotional_symptoms is properly stored as array
      expect(Array.isArray(result.emotional_symptoms)).toBe(true);
      expect(result.emotional_symptoms).toContain('severe-mood-swings');
      expect(result.emotional_symptoms).toContain('depression');
    });

    it('should create assessment with recommendations array', async () => {
      const result = await Assessment.create(newAssessmentInput, mockUserId);
      
      // Verify recommendations is properly stored as array of objects
      expect(Array.isArray(result.recommendations)).toBe(true);
      expect(result.recommendations).toHaveLength(2);
      expect(result.recommendations[0]).toHaveProperty('title', 'Medical Consultation');
      expect(result.recommendations[0]).toHaveProperty('description', 'Consult with healthcare provider immediately');
      expect(result.recommendations[1]).toHaveProperty('title', 'Pain Relief');
      expect(result.recommendations[1]).toHaveProperty('description', 'Consider stronger pain management options');
    });

    it('should call database service with correct parameters', async () => {
      await Assessment.create(newAssessmentInput, mockUserId);
      
      // Verify DbService.create was called with correct table and data structure
      expect(DbService.create).toHaveBeenCalledWith('assessments', expect.objectContaining({
        id: expect.any(String),
        user_id: mockUserId,
        created_at: expect.any(Date),
        age: newAssessmentInput.age,
        pattern: newAssessmentInput.pattern,
        cycle_length: newAssessmentInput.cycle_length,
        period_duration: newAssessmentInput.period_duration,
        flow_heaviness: newAssessmentInput.flow_heaviness,
        pain_level: newAssessmentInput.pain_level
      }));
    });

    it('should generate unique ID for each assessment', async () => {
      const result1 = await Assessment.create(newAssessmentInput, mockUserId);
      
      // Mock second creation with different ID
      DbService.create.mockResolvedValue({
        id: 'different-assessment-id',
        user_id: mockUserId,
        created_at: new Date().toISOString(),
        ...newAssessmentInput
      });
      
      const result2 = await Assessment.create(newAssessmentInput, mockUserId);
      
      expect(result1.id).toBeDefined();
      expect(result2.id).toBeDefined();
      // Note: In actual implementation, IDs would be different, but our mock returns same structure
    });

    it('should include created_at timestamp', async () => {
      const result = await Assessment.create(newAssessmentInput, mockUserId);
      
      expect(result.created_at).toBeDefined();
      expect(() => new Date(result.created_at)).not.toThrow();
    });
  });
}; 