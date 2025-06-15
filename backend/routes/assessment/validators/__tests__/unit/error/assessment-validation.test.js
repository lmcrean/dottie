// @ts-check
import { describe, test, expect } from 'vitest';
import { validateAssessmentData } from '../../../index.js';

describe('Assessment Validation - Error Cases', () => {
  test('should reject empty assessment object', () => {
    const emptyAssessment = {}; // Empty object has no fields
    
    const result = validateAssessmentData(emptyAssessment);
    expect(result.isValid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });
  
  test('should reject assessment with missing required fields', () => {
    // Test nested format with missing required fields
    const invalidNestedAssessment = {
      assessment_data: {
        // Missing age and cycleLength
        flowHeaviness: "moderate"
      }
    };
    
    const resultNested = validateAssessmentData(invalidNestedAssessment);
    expect(resultNested.isValid).toBe(false);
    expect(resultNested.errors.length).toBeGreaterThan(0);
    
    // Test flattened format with missing required fields
    const invalidFlattenedAssessment = {
      // Missing age and cycle_length
      flow_heaviness: "moderate"
    };
    
    const resultFlattened = validateAssessmentData(invalidFlattenedAssessment);
    expect(resultFlattened.isValid).toBe(false);
    expect(resultFlattened.errors.length).toBeGreaterThan(0);
  });
  
  test('should reject assessment with invalid age value', () => {
    // Test nested format with invalid age
    const invalidNestedAssessment = {
      assessment_data: {
        age: "invalid_age_range", // Invalid value
        cycleLength: "26-30"
      }
    };
    
    const resultNested = validateAssessmentData(invalidNestedAssessment);
    expect(resultNested.isValid).toBe(false);
    expect(resultNested.errors).toContain('Invalid age value');
    
    // Test flattened format with invalid age
    const invalidFlattenedAssessment = {
      age: "invalid_age_range", // Invalid value
      cycle_length: "26-30"
    };
    
    const resultFlattened = validateAssessmentData(invalidFlattenedAssessment);
    expect(resultFlattened.isValid).toBe(false);
    expect(resultFlattened.errors).toContain('Invalid age value');
  });
  
  test('should reject assessment with invalid cycle length value', () => {
    // Test nested format with invalid cycle length
    const invalidNestedAssessment = {
      assessment_data: {
        age: "18-24",
        cycleLength: "invalid_cycle_length" // Invalid value
      }
    };
    
    const resultNested = validateAssessmentData(invalidNestedAssessment);
    expect(resultNested.isValid).toBe(false);
    expect(resultNested.errors).toContain('Invalid cycle length value');
    
    // Test flattened format with invalid cycle length
    const invalidFlattenedAssessment = {
      age: "18-24",
      cycle_length: "invalid_cycle_length" // Invalid value
    };
    
    const resultFlattened = validateAssessmentData(invalidFlattenedAssessment);
    expect(resultFlattened.isValid).toBe(false);
    expect(resultFlattened.errors).toContain('Invalid cycle length value');
  });
}); 