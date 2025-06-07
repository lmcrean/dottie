import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import ParseAssessmentJson from '../ParseAssessmentJson.js';

describe('ParseAssessmentJson', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Spy on console.error to test error logging
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('parseArrayField', () => {
    it('should return empty array for null or undefined field', () => {
      expect(ParseAssessmentJson.parseArrayField(null, 'test', 'id-123')).toEqual([]);
      expect(ParseAssessmentJson.parseArrayField(undefined, 'test', 'id-123')).toEqual([]);
      expect(ParseAssessmentJson.parseArrayField('', 'test', 'id-123')).toEqual([]);
    });

    it('should return array as-is if already an array', () => {
      const testArray = ['item1', 'item2', 'item3'];
      const result = ParseAssessmentJson.parseArrayField(testArray, 'test', 'id-123');
      expect(result).toEqual(testArray);
      expect(result).toBe(testArray); // Should be the same reference
    });

    it('should parse valid JSON string to array', () => {
      const jsonString = '["cramps", "bloating", "headaches"]';
      const result = ParseAssessmentJson.parseArrayField(jsonString, 'physical_symptoms', 'id-123');
      expect(result).toEqual(['cramps', 'bloating', 'headaches']);
    });

    it('should parse empty JSON array', () => {
      const jsonString = '[]';
      const result = ParseAssessmentJson.parseArrayField(jsonString, 'emotional_symptoms', 'id-123');
      expect(result).toEqual([]);
    });

    it('should parse JSON array with complex objects', () => {
      const jsonString = '[{"title": "Exercise", "description": "Regular exercise"}, {"title": "Sleep", "description": "Get enough sleep"}]';
      const result = ParseAssessmentJson.parseArrayField(jsonString, 'recommendations', 'id-123');
      expect(result).toEqual([
        { title: 'Exercise', description: 'Regular exercise' },
        { title: 'Sleep', description: 'Get enough sleep' }
      ]);
    });

    it('should handle invalid JSON gracefully and log error', () => {
      const invalidJson = '["invalid", json}';
      const result = ParseAssessmentJson.parseArrayField(invalidJson, 'physical_symptoms', 'assessment-123');
      
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalledWith(
        'Failed to parse physical_symptoms for assessment assessment-123:',
        expect.any(Error)
      );
      expect(console.error).toHaveBeenCalledWith(
        'Raw value was: ["invalid", json}'
      );
    });

    it('should handle non-JSON string gracefully', () => {
      const nonJsonString = 'just a plain string';
      const result = ParseAssessmentJson.parseArrayField(nonJsonString, 'test_field', 'test-id');
      
      expect(result).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('parseOtherSymptoms', () => {
    it('should return empty array for null, undefined, or empty field', () => {
      expect(ParseAssessmentJson.parseOtherSymptoms(null)).toEqual([]);
      expect(ParseAssessmentJson.parseOtherSymptoms(undefined)).toEqual([]);
      expect(ParseAssessmentJson.parseOtherSymptoms('')).toEqual([]);
    });

    it('should parse JSON array successfully', () => {
      const jsonArray = '["headaches", "nausea", "fatigue"]';
      const result = ParseAssessmentJson.parseOtherSymptoms(jsonArray);
      expect(result).toEqual(['headaches', 'nausea', 'fatigue']);
    });

    it('should filter out non-string elements from JSON array', () => {
      const jsonArray = '["headaches", null, "nausea", 123, "fatigue"]';
      const result = ParseAssessmentJson.parseOtherSymptoms(jsonArray);
      expect(result).toEqual(['headaches', 'nausea', 'fatigue']);
    });

    it('should handle JSON string as single item array', () => {
      const jsonString = '"just a single symptom"';
      const result = ParseAssessmentJson.parseOtherSymptoms(jsonString);
      expect(result).toEqual(['just a single symptom']);
    });

    it('should handle plain string as single item array', () => {
      const plainString = 'back pain';
      const result = ParseAssessmentJson.parseOtherSymptoms(plainString);
      expect(result).toEqual(['back pain']);
    });

    it('should trim whitespace from plain strings', () => {
      const stringWithWhitespace = '   muscle aches   ';
      const result = ParseAssessmentJson.parseOtherSymptoms(stringWithWhitespace);
      expect(result).toEqual(['muscle aches']);
    });

    it('should return empty array for whitespace-only string', () => {
      const whitespaceString = '   ';
      const result = ParseAssessmentJson.parseOtherSymptoms(whitespaceString);
      expect(result).toEqual([]);
    });

    it('should handle invalid JSON by treating as plain string', () => {
      const invalidJson = '["invalid", json}';
      const result = ParseAssessmentJson.parseOtherSymptoms(invalidJson);
      expect(result).toEqual(['["invalid", json}']);
    });

    it('should return empty array for JSON empty string', () => {
      const jsonEmptyString = '""';
      const result = ParseAssessmentJson.parseOtherSymptoms(jsonEmptyString);
      expect(result).toEqual([]);
    });
  });

  describe('serializeArrayField', () => {
    it('should return null for null or undefined field', () => {
      expect(ParseAssessmentJson.serializeArrayField(null)).toBe(null);
      expect(ParseAssessmentJson.serializeArrayField(undefined)).toBe(null);
    });

    it('should serialize array to JSON string', () => {
      const testArray = ['cramps', 'bloating', 'headaches'];
      const result = ParseAssessmentJson.serializeArrayField(testArray);
      expect(result).toBe('["cramps","bloating","headaches"]');
    });

    it('should serialize empty array', () => {
      const emptyArray = [];
      const result = ParseAssessmentJson.serializeArrayField(emptyArray);
      expect(result).toBe('[]');
    });

    it('should serialize array with objects', () => {
      const complexArray = [
        { title: 'Exercise', description: 'Regular exercise' },
        { title: 'Sleep', description: 'Get enough sleep' }
      ];
      const result = ParseAssessmentJson.serializeArrayField(complexArray);
      expect(result).toBe('[{"title":"Exercise","description":"Regular exercise"},{"title":"Sleep","description":"Get enough sleep"}]');
    });

    it('should handle mixed type arrays', () => {
      const mixedArray = ['string', 123, null, { key: 'value' }];
      const result = ParseAssessmentJson.serializeArrayField(mixedArray);
      expect(result).toBe('["string",123,null,{"key":"value"}]');
    });
  });

  describe('serializeOtherSymptoms', () => {
    it('should return null for null or undefined field', () => {
      expect(ParseAssessmentJson.serializeOtherSymptoms(null)).toBe(null);
      expect(ParseAssessmentJson.serializeOtherSymptoms(undefined)).toBe(null);
    });

    it('should serialize non-empty string as single-item array', () => {
      const symptom = 'back pain';
      const result = ParseAssessmentJson.serializeOtherSymptoms(symptom);
      expect(result).toBe('["back pain"]');
    });

    it('should trim whitespace from string and serialize', () => {
      const symptomWithWhitespace = '   muscle aches   ';
      const result = ParseAssessmentJson.serializeOtherSymptoms(symptomWithWhitespace);
      expect(result).toBe('["muscle aches"]');
    });

    it('should return null for empty or whitespace-only string', () => {
      expect(ParseAssessmentJson.serializeOtherSymptoms('')).toBe(null);
      expect(ParseAssessmentJson.serializeOtherSymptoms('   ')).toBe(null);
    });

    it('should serialize non-empty array', () => {
      const symptoms = ['headaches', 'nausea', 'fatigue'];
      const result = ParseAssessmentJson.serializeOtherSymptoms(symptoms);
      expect(result).toBe('["headaches","nausea","fatigue"]');
    });

    it('should return null for empty array', () => {
      const emptyArray = [];
      const result = ParseAssessmentJson.serializeOtherSymptoms(emptyArray);
      expect(result).toBe(null);
    });

    it('should handle array with mixed content', () => {
      const mixedArray = ['headaches', '', 'nausea', null, 'fatigue'];
      const result = ParseAssessmentJson.serializeOtherSymptoms(mixedArray);
      expect(result).toBe('["headaches","","nausea",null,"fatigue"]');
    });
  });
}); 