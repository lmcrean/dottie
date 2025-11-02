import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import TransformApiToDb from '../TransformApiToDb.js';
import ParseAssessmentJson from '../ParseAssessmentJson.js';

// Mock dependencies
vi.mock('../../transformers/ParseAssessmentJson.js');

describe('TransformApiToDb', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('transform', () => {
    it('should transform complete assessment data correctly', () => {
      const assessmentData = {
        age: 25,
        pattern: 'regular',
        cycle_length: 28,
        period_duration: 5,
        flow_heaviness: 'medium',
        pain_level: 3,
        physical_symptoms: ['cramps', 'bloating'],
        emotional_symptoms: ['mood_swings', 'anxiety'],
        other_symptoms: 'headaches',
        recommendations: [
          { title: 'Exercise', description: 'Regular exercise' },
          { title: 'Hydration', description: 'Drink more water' }
        ]
      };

      // Mock the serialization functions
      ParseAssessmentJson.serializeOtherSymptoms.mockReturnValue('["headaches"]');
      ParseAssessmentJson.serializeArrayField
        .mockReturnValueOnce('["cramps","bloating"]') // physical_symptoms
        .mockReturnValueOnce('["mood_swings","anxiety"]') // emotional_symptoms
        .mockReturnValueOnce('[{"title":"Exercise","description":"Regular exercise"},{"title":"Hydration","description":"Drink more water"}]'); // recommendations

      const result = TransformApiToDb.transform(assessmentData);

      expect(ParseAssessmentJson.serializeOtherSymptoms).toHaveBeenCalledWith('headaches');
      expect(ParseAssessmentJson.serializeArrayField).toHaveBeenCalledWith(['cramps', 'bloating']);
      expect(ParseAssessmentJson.serializeArrayField).toHaveBeenCalledWith(['mood_swings', 'anxiety']);
      expect(ParseAssessmentJson.serializeArrayField).toHaveBeenCalledWith([
        { title: 'Exercise', description: 'Regular exercise' },
        { title: 'Hydration', description: 'Drink more water' }
      ]);

      expect(result).toEqual({
        age: 25,
        pattern: 'regular',
        cycle_length: 28,
        period_duration: 5,
        flow_heaviness: 'medium',
        pain_level: 3,
        other_symptoms: '["headaches"]',
        physical_symptoms: '["cramps","bloating"]',
        emotional_symptoms: '["mood_swings","anxiety"]',
        recommendations: '[{"title":"Exercise","description":"Regular exercise"},{"title":"Hydration","description":"Drink more water"}]'
      });
    });

    it('should handle minimal assessment data', () => {
      const assessmentData = {
        age: 30,
        pattern: 'irregular'
      };

      // Mock the serialization functions to return null for undefined fields
      ParseAssessmentJson.serializeOtherSymptoms.mockReturnValue(null);
      ParseAssessmentJson.serializeArrayField.mockReturnValue(null);

      const result = TransformApiToDb.transform(assessmentData);

      expect(ParseAssessmentJson.serializeOtherSymptoms).toHaveBeenCalledWith(undefined);
      expect(ParseAssessmentJson.serializeArrayField).toHaveBeenCalledWith(undefined);
      expect(ParseAssessmentJson.serializeArrayField).toHaveBeenCalledWith(undefined);
      expect(ParseAssessmentJson.serializeArrayField).toHaveBeenCalledWith(undefined);

      expect(result).toEqual({
        age: 30,
        pattern: 'irregular',
        cycle_length: undefined,
        period_duration: undefined,
        flow_heaviness: undefined,
        pain_level: undefined,
        other_symptoms: null,
        physical_symptoms: null,
        emotional_symptoms: null,
        recommendations: null
      });
    });

    it('should handle empty arrays and empty strings', () => {
      const assessmentData = {
        age: 28,
        pattern: 'regular',
        cycle_length: 30,
        period_duration: 4,
        flow_heaviness: 'light',
        pain_level: 1,
        physical_symptoms: [],
        emotional_symptoms: [],
        other_symptoms: '',
        recommendations: []
      };

      // Mock the serialization functions
      ParseAssessmentJson.serializeOtherSymptoms.mockReturnValue(null);
      ParseAssessmentJson.serializeArrayField.mockReturnValue('[]');

      const result = TransformApiToDb.transform(assessmentData);

      expect(ParseAssessmentJson.serializeOtherSymptoms).toHaveBeenCalledWith('');
      expect(ParseAssessmentJson.serializeArrayField).toHaveBeenCalledWith([]);
      expect(ParseAssessmentJson.serializeArrayField).toHaveBeenCalledWith([]);
      expect(ParseAssessmentJson.serializeArrayField).toHaveBeenCalledWith([]);

      expect(result).toEqual({
        age: 28,
        pattern: 'regular',
        cycle_length: 30,
        period_duration: 4,
        flow_heaviness: 'light',
        pain_level: 1,
        other_symptoms: null,
        physical_symptoms: '[]',
        emotional_symptoms: '[]',
        recommendations: '[]'
      });
    });

    it('should handle null and undefined values gracefully', () => {
      const assessmentData = {
        age: null,
        pattern: undefined,
        cycle_length: 0,
        physical_symptoms: null,
        emotional_symptoms: undefined,
        other_symptoms: null,
        recommendations: null
      };

      // Mock the serialization functions
      ParseAssessmentJson.serializeOtherSymptoms.mockReturnValue(null);
      ParseAssessmentJson.serializeArrayField.mockReturnValue(null);

      const result = TransformApiToDb.transform(assessmentData);

      expect(ParseAssessmentJson.serializeOtherSymptoms).toHaveBeenCalledWith(null);
      expect(ParseAssessmentJson.serializeArrayField).toHaveBeenCalledWith(null);
      expect(ParseAssessmentJson.serializeArrayField).toHaveBeenCalledWith(undefined);
      expect(ParseAssessmentJson.serializeArrayField).toHaveBeenCalledWith(null);

      expect(result).toEqual({
        age: null,
        pattern: undefined,
        cycle_length: 0,
        period_duration: undefined,
        flow_heaviness: undefined,
        pain_level: undefined,
        other_symptoms: null,
        physical_symptoms: null,
        emotional_symptoms: null,
        recommendations: null
      });
    });

    it('should preserve all numeric values including zero', () => {
      const assessmentData = {
        age: 0,
        cycle_length: 0,
        period_duration: 0,
        pain_level: 0,
        pattern: 'unknown'
      };

      // Mock the serialization functions
      ParseAssessmentJson.serializeOtherSymptoms.mockReturnValue(null);
      ParseAssessmentJson.serializeArrayField.mockReturnValue(null);

      const result = TransformApiToDb.transform(assessmentData);

      expect(result.age).toBe(0);
      expect(result.cycle_length).toBe(0);
      expect(result.period_duration).toBe(0);
      expect(result.pain_level).toBe(0);
      expect(result.pattern).toBe('unknown');
    });

    it('should handle complex recommendations with nested objects', () => {
      const assessmentData = {
        age: 25,
        pattern: 'regular',
        recommendations: [
          {
            title: 'Diet',
            description: 'Eat healthy foods',
            priority: 'high',
            metadata: { category: 'nutrition' }
          },
          {
            title: 'Exercise',
            description: 'Regular physical activity',
            priority: 'medium',
            metadata: { category: 'fitness', duration: '30min' }
          }
        ]
      };

      const expectedSerializedRec = '[{"title":"Diet","description":"Eat healthy foods","priority":"high","metadata":{"category":"nutrition"}},{"title":"Exercise","description":"Regular physical activity","priority":"medium","metadata":{"category":"fitness","duration":"30min"}}]';

      ParseAssessmentJson.serializeOtherSymptoms.mockReturnValue(null);
      ParseAssessmentJson.serializeArrayField
        .mockReturnValueOnce(null) // physical_symptoms
        .mockReturnValueOnce(null) // emotional_symptoms
        .mockReturnValueOnce(expectedSerializedRec); // recommendations

      const result = TransformApiToDb.transform(assessmentData);

      expect(ParseAssessmentJson.serializeArrayField).toHaveBeenCalledWith(assessmentData.recommendations);
      expect(result.recommendations).toBe(expectedSerializedRec);
    });

    it('should handle string array symptoms', () => {
      const assessmentData = {
        age: 22,
        pattern: 'regular',
        physical_symptoms: ['cramps', 'bloating', 'fatigue'],
        emotional_symptoms: ['irritability'],
        other_symptoms: ['headaches', 'nausea']
      };

      ParseAssessmentJson.serializeOtherSymptoms.mockReturnValue('["headaches","nausea"]');
      ParseAssessmentJson.serializeArrayField
        .mockReturnValueOnce('["cramps","bloating","fatigue"]')
        .mockReturnValueOnce('["irritability"]')
        .mockReturnValueOnce(null);

      const result = TransformApiToDb.transform(assessmentData);

      expect(ParseAssessmentJson.serializeOtherSymptoms).toHaveBeenCalledWith(['headaches', 'nausea']);
      expect(ParseAssessmentJson.serializeArrayField).toHaveBeenCalledWith(['cramps', 'bloating', 'fatigue']);
      expect(ParseAssessmentJson.serializeArrayField).toHaveBeenCalledWith(['irritability']);

      expect(result.physical_symptoms).toBe('["cramps","bloating","fatigue"]');
      expect(result.emotional_symptoms).toBe('["irritability"]');
      expect(result.other_symptoms).toBe('["headaches","nausea"]');
    });
  });
}); 