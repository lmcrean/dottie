import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import TransformDbToApi from '../TransformDbToApi.js';
import ParseAssessmentJson from '../ParseAssessmentJson.js';

// Mock dependencies
vi.mock('../../transformers/ParseAssessmentJson.js');

describe('TransformDbToApi', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Spy on console.warn to test warning logs
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.resetAllMocks();
    vi.restoreAllMocks();
  });

  describe('transform', () => {
    it('should return null for null record', () => {
      const result = TransformDbToApi.transform(null);
      expect(result).toBeNull();
    });

    it('should return null for undefined record', () => {
      const result = TransformDbToApi.transform(undefined);
      expect(result).toBeNull();
    });

    it('should transform complete database record to API format', () => {
      const dbRecord = {
        id: 'test-123',
        user_id: 'user-456',
        created_at: new Date('2023-01-01'),
        age: 25,
        pattern: 'regular',
        cycle_length: 28,
        period_duration: 5,
        flow_heaviness: 'medium',
        pain_level: 3,
        physical_symptoms: '["cramps", "bloating"]',
        emotional_symptoms: '["mood_swings"]',
        other_symptoms: '["headaches"]',
        recommendations: '[{"title": "Exercise", "description": "Regular exercise"}]'
      };

      // Mock the parser functions
      ParseAssessmentJson.parseArrayField
        .mockReturnValueOnce(['cramps', 'bloating']) // physical_symptoms
        .mockReturnValueOnce(['mood_swings']) // emotional_symptoms
        .mockReturnValueOnce([{ title: 'Exercise', description: 'Regular exercise' }]); // recommendations
      ParseAssessmentJson.parseOtherSymptoms.mockReturnValue(['headaches']);

      const result = TransformDbToApi.transform(dbRecord);

      expect(ParseAssessmentJson.parseArrayField).toHaveBeenCalledWith('["cramps", "bloating"]', 'physical_symptoms', 'test-123');
      expect(ParseAssessmentJson.parseArrayField).toHaveBeenCalledWith('["mood_swings"]', 'emotional_symptoms', 'test-123');
      expect(ParseAssessmentJson.parseArrayField).toHaveBeenCalledWith('[{"title": "Exercise", "description": "Regular exercise"}]', 'recommendations', 'test-123');
      expect(ParseAssessmentJson.parseOtherSymptoms).toHaveBeenCalledWith('["headaches"]');

      expect(result).toEqual({
        id: 'test-123',
        user_id: 'user-456',
        created_at: new Date('2023-01-01'),
        age: 25,
        pattern: 'regular',
        cycle_length: 28,
        period_duration: 5,
        flow_heaviness: 'medium',
        pain_level: 3,
        physical_symptoms: ['cramps', 'bloating'],
        emotional_symptoms: ['mood_swings'],
        other_symptoms: ['headaches'],
        recommendations: [{ title: 'Exercise', description: 'Regular exercise' }]
      });
    });

    it('should remove updated_at field from result', () => {
      const dbRecord = {
        id: 'test-123',
        user_id: 'user-456',
        created_at: new Date('2023-01-01'),
        updated_at: new Date('2023-01-02'),
        age: 25,
        pattern: 'regular'
      };

      // Mock the parser functions
      ParseAssessmentJson.parseArrayField.mockReturnValue([]);
      ParseAssessmentJson.parseOtherSymptoms.mockReturnValue([]);

      const result = TransformDbToApi.transform(dbRecord);

      expect(result.updated_at).toBeUndefined();
      expect(result.id).toBe('test-123');
      expect(result.created_at).toEqual(new Date('2023-01-01'));
    });

    it('should handle null/undefined array fields gracefully', () => {
      const dbRecord = {
        id: 'test-123',
        user_id: 'user-456',
        created_at: new Date(),
        age: 25,
        pattern: 'regular',
        physical_symptoms: null,
        emotional_symptoms: undefined,
        other_symptoms: null,
        recommendations: null
      };

      // Mock the parser functions
      ParseAssessmentJson.parseArrayField.mockReturnValue([]);
      ParseAssessmentJson.parseOtherSymptoms.mockReturnValue([]);

      const result = TransformDbToApi.transform(dbRecord);

      expect(result.physical_symptoms).toEqual([]);
      expect(result.emotional_symptoms).toEqual([]);
      expect(result.other_symptoms).toEqual([]);
      expect(result.recommendations).toEqual([]);
    });

    it('should convert string recommendations to objects with title and description', () => {
      const dbRecord = {
        id: 'test-123',
        user_id: 'user-456',
        created_at: new Date(),
        age: 25,
        pattern: 'regular',
        recommendations: '["Exercise", "Hydration", "Sleep"]'
      };

      // Mock the parser functions
      ParseAssessmentJson.parseArrayField
        .mockReturnValueOnce([]) // physical_symptoms
        .mockReturnValueOnce([]) // emotional_symptoms
        .mockReturnValueOnce(['Exercise', 'Hydration', 'Sleep']); // recommendations as strings
      ParseAssessmentJson.parseOtherSymptoms.mockReturnValue([]);

      const result = TransformDbToApi.transform(dbRecord);

      expect(result.recommendations).toEqual([
        { title: 'Exercise', description: '' },
        { title: 'Hydration', description: '' },
        { title: 'Sleep', description: '' }
      ]);
    });

    it('should keep object recommendations as-is', () => {
      const dbRecord = {
        id: 'test-123',
        user_id: 'user-456',
        created_at: new Date(),
        age: 25,
        pattern: 'regular',
        recommendations: '[{"title": "Exercise", "description": "Regular exercise"}, {"title": "Diet", "description": "Healthy eating"}]'
      };

      const objectRecommendations = [
        { title: 'Exercise', description: 'Regular exercise' },
        { title: 'Diet', description: 'Healthy eating' }
      ];

      // Mock the parser functions
      ParseAssessmentJson.parseArrayField
        .mockReturnValueOnce([]) // physical_symptoms
        .mockReturnValueOnce([]) // emotional_symptoms
        .mockReturnValueOnce(objectRecommendations); // recommendations as objects
      ParseAssessmentJson.parseOtherSymptoms.mockReturnValue([]);

      const result = TransformDbToApi.transform(dbRecord);

      expect(result.recommendations).toEqual(objectRecommendations);
    });

    it('should handle invalid array parsing with warnings', () => {
      const dbRecord = {
        id: 'test-123',
        user_id: 'user-456',
        created_at: new Date(),
        age: 25,
        pattern: 'regular',
        physical_symptoms: 'invalid json',
        emotional_symptoms: '["valid"]'
      };

      // Mock the parser functions to return non-arrays for invalid data
      ParseAssessmentJson.parseArrayField
        .mockReturnValueOnce('not an array') // physical_symptoms - invalid
        .mockReturnValueOnce(['valid']) // emotional_symptoms - valid
        .mockReturnValueOnce([]); // recommendations
      ParseAssessmentJson.parseOtherSymptoms.mockReturnValue([]);

      const result = TransformDbToApi.transform(dbRecord);

      expect(console.warn).toHaveBeenCalledWith(
        'physical_symptoms is not an array after parsing for assessment test-123, setting to empty array'
      );
      expect(result.physical_symptoms).toEqual([]);
      expect(result.emotional_symptoms).toEqual(['valid']);
    });

    it('should handle empty string and zero values correctly', () => {
      const dbRecord = {
        id: 'test-123',
        user_id: 'user-456',
        created_at: new Date(),
        age: 0,
        pattern: '',
        cycle_length: 0,
        period_duration: null,
        flow_heaviness: '',
        pain_level: 0,
        physical_symptoms: '[]',
        emotional_symptoms: '',
        other_symptoms: '',
        recommendations: '[]'
      };

      // Mock the parser functions
      ParseAssessmentJson.parseArrayField.mockReturnValue([]);
      ParseAssessmentJson.parseOtherSymptoms.mockReturnValue([]);

      const result = TransformDbToApi.transform(dbRecord);

      expect(result.age).toBe(0);
      expect(result.pattern).toBe('');
      expect(result.cycle_length).toBe(0);
      expect(result.period_duration).toBeNull();
      expect(result.flow_heaviness).toBe('');
      expect(result.pain_level).toBe(0);
      expect(result.physical_symptoms).toEqual([]);
      expect(result.emotional_symptoms).toEqual([]);
      expect(result.other_symptoms).toEqual([]);
      expect(result.recommendations).toEqual([]);
    });

    it('should handle mixed content in arrays', () => {
      const dbRecord = {
        id: 'test-123',
        user_id: 'user-456',
        created_at: new Date(),
        age: 25,
        pattern: 'regular',
        physical_symptoms: '["cramps", null, "bloating", "", "fatigue"]',
        emotional_symptoms: '["anxiety", "depression"]',
        other_symptoms: '["headaches", "nausea"]',
        recommendations: '[{"title": "Exercise"}, "Just a string", {"title": "Diet", "description": "Eat well"}]'
      };

      // Mock the parser functions
      ParseAssessmentJson.parseArrayField
        .mockReturnValueOnce(['cramps', null, 'bloating', '', 'fatigue']) // physical_symptoms
        .mockReturnValueOnce(['anxiety', 'depression']) // emotional_symptoms
        .mockReturnValueOnce([{ title: 'Exercise' }, 'Just a string', { title: 'Diet', description: 'Eat well' }]); // recommendations
      ParseAssessmentJson.parseOtherSymptoms.mockReturnValue(['headaches', 'nausea']);

      const result = TransformDbToApi.transform(dbRecord);

      expect(result.physical_symptoms).toEqual(['cramps', null, 'bloating', '', 'fatigue']);
      expect(result.emotional_symptoms).toEqual(['anxiety', 'depression']);
      expect(result.other_symptoms).toEqual(['headaches', 'nausea']);
      expect(result.recommendations).toEqual([{ title: 'Exercise' }, 'Just a string', { title: 'Diet', description: 'Eat well' }]);
    });
  });
}); 