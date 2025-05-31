class ValidateAssessmentData {
  /**
   * Check if this class can process the given record format
   * Must be implemented by subclasses
   * @param {Object} record - Database record
   * @returns {boolean} True if this class can process the record
   */
  static _canProcessRecord(record) {
    // Base implementation always returns false
    // Subclasses should override with specific format checks
    return false;
  }

  /**
   * Validate assessment data structure
   * @param {Object} assessmentData - Assessment data to validate
   * @returns {Object} Validation result with isValid boolean and errors array
   */
  static validateData(assessmentData) {
    const errors = [];

    if (!assessmentData) {
      errors.push('Assessment data is required');
      return { isValid: false, errors };
    }

    // Validate required fields
    if (!assessmentData.age || isNaN(assessmentData.age)) {
      errors.push('Valid age is required');
    }

    if (!assessmentData.pattern) {
      errors.push('Pattern is required');
    }

    // Validate numeric fields
    const numericFields = ['cycle_length', 'period_duration', 'pain_level'];
    numericFields.forEach(field => {
      if (assessmentData[field] !== undefined && isNaN(assessmentData[field])) {
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