// @ts-check
import { describe, test, expect } from 'vitest';
import { validateAssessmentData } from '../../../validators/index.js';

describe('Assessment Validation - Success Cases', () => {
  test('should validate a complete assessment', () => {
    const validAssessment = {
      userId: 'test-user-id',
      assessmentData: {
        age: "18_24",
        cycleLength: "26_30",
        periodDuration: "4-5",
        flowHeaviness: "moderate",
        painLevel: "moderate",
        symptoms: {
          physical: ["Bloating", "Headaches"],
          emotional: ["Mood swings"]
        }
      }
    };
    
    const result = validateAssessmentData(validAssessment);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
  
  test('should validate assessment with minimum required fields', () => {
    const minimalAssessment = {
      userId: 'test-user-id',
      assessmentData: {
        age: "25_29",
        cycleLength: "31_35"
      }
    };
    
    const result = validateAssessmentData(minimalAssessment);
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
}); 