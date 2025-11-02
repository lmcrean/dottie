import type { AssessmentApiInput, AssessmentDbRecord, ValidationResult } from '../types.js';

class ValidateAssessmentData {
  /**
   * Check if this class can process the given record format
   * Must be implemented by subclasses
   * @param record - Database record
   * @returns True if this class can process the record
   */
  static _canProcessRecord(record: AssessmentDbRecord): boolean {
    // Base implementation always returns false
    // Subclasses should override with specific format checks
    return false;
  }

  /**
   * Validate assessment data structure
   * @param assessmentData - Assessment data to validate
   * @returns Validation result with isValid boolean and errors array
   */
  static validateData(assessmentData: AssessmentApiInput): ValidationResult {
    const errors: string[] = [];

    if (!assessmentData) {
      errors.push('Assessment data is required');
      return { isValid: false, errors };
    }

    // Validate required fields
    if (!assessmentData.age || isNaN(Number(assessmentData.age))) {
      errors.push('Valid age is required');
    }

    if (!assessmentData.pattern) {
      errors.push('Pattern is required');
    }

    // Validate numeric fields
    const numericFields: (keyof AssessmentApiInput)[] = ['cycle_length', 'period_duration', 'pain_level'];
    numericFields.forEach(field => {
      const value = assessmentData[field];
      if (value !== undefined && isNaN(Number(value))) {
        errors.push(`${field} must be a valid number`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

export default ValidateAssessmentData;
