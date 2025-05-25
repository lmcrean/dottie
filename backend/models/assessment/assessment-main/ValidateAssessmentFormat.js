class ValidateAssessmentFormat {
  /**
   * Check if this record is in the current (non-legacy) format
   * @param {Object} record - Database record
   * @returns {boolean} True if this is current format
   */
  static canProcessRecord(record) {
    // Current format has direct fields and NO assessment_data
    const hasDirectFields = record.age || record.pattern || record.cycle_length;
    const isCurrentFormat = !record.assessment_data && hasDirectFields;
    
    return isCurrentFormat;
  }
}

export default ValidateAssessmentFormat; 