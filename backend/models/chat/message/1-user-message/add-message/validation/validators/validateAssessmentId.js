/**
 * Validate assessment ID (optional field)
 * @param {string} assessmentId - Assessment ID to validate
 * @param {string} [context] - Context for error messages
 * @returns {Object} - Validation result
 */
export const validateAssessmentId = (assessmentId, context = 'assessment validation') => {
  const errors = [];
  
  // Assessment ID is optional, so null/undefined is valid
  if (assessmentId !== null && assessmentId !== undefined) {
    if (typeof assessmentId !== 'string') {
      errors.push('Assessment ID must be a string');
    } else if (assessmentId.trim().length === 0) {
      errors.push('Assessment ID cannot be empty string');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    context
  };
}; 