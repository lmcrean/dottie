class DetectAssessmentFormat {
  /**
   * Determine if a record is in legacy format
   * @param {Object} record - Database record
   * @returns {boolean} True if legacy format
   */
  static isLegacyFormat(record) {
    return !!(record && record.assessment_data);
  }

  /**
   * Determine if a record is in current format
   * @param {Object} record - Database record
   * @returns {boolean} True if current format
   */
  static isCurrentFormat(record) {
    if (!record) return false;
    
    // Current format has direct fields and NO assessment_data
    const hasDirectFields = record.age || record.pattern || record.cycle_length;
    return !record.assessment_data && hasDirectFields;
  }

  /**
   * Determine format from assessment data structure
   * @param {Object} assessmentData - Assessment data to be created/updated
   * @returns {string} 'legacy' or 'current'
   */
  static detectDataFormat(assessmentData) {
    return assessmentData.assessment_data ? 'legacy' : 'current';
  }
}

export default DetectAssessmentFormat; 
