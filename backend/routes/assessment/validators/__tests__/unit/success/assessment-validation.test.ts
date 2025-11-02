// @ts-check
import { describe, test, expect } from 'vitest';
import { validateAssessmentData } from '../../../index.js';

describe('Assessment Validation - Success Cases', () => {
  test('should validate a complete assessment in nested format', () => {
    const validNestedAssessment = {
      assessment_data: {
        age: "18-24",
        cycleLength: "26-30",
        periodDuration: "4-5",
        flowHeaviness: "moderate",
        painLevel: "moderate",
        symptoms: {
          physical: ["Bloating", "Headaches"],
          emotional: ["Mood swings"]
        }
      }
    };
    
    const result = validateAssessmentData(validNestedAssessment);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
  
  test('should validate a complete assessment in flattened format', () => {
    const validFlattenedAssessment = {
      age: "18-24",
      cycle_length: "26-30",
      period_duration: "4-5",
      flow_heaviness: "moderate",
      pain_level: "moderate",
      physical_symptoms: ["Bloating", "Headaches"],
      emotional_symptoms: ["Mood swings"]
    };
    
    const result = validateAssessmentData(validFlattenedAssessment);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
  
  test('should validate assessment with minimum required fields in nested format', () => {
    const minimalNestedAssessment = {
      assessment_data: {
        age: "18-24",
        cycleLength: "26-30"
      }
    };
    
    const result = validateAssessmentData(minimalNestedAssessment);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
  
  test('should validate assessment with minimum required fields in flattened format', () => {
    const minimalFlattenedAssessment = {
      age: "18-24",
      cycle_length: "26-30"
    };
    
    const result = validateAssessmentData(minimalFlattenedAssessment);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
}); 