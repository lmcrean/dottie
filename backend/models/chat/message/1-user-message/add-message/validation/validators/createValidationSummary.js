/**
 * Create a validation summary for logging
 * @param {Object} validationResult - Validation result
 * @returns {string} - Summary string
 */
export const createValidationSummary = (validationResult) => {
  const { isValid, errors, warnings, context } = validationResult;
  
  let summary = `${context}: ${isValid ? 'VALID' : 'INVALID'}`;
  
  if (errors && errors.length > 0) {
    summary += ` (${errors.length} errors)`;
  }
  
  if (warnings && warnings.length > 0) {
    summary += ` (${warnings.length} warnings)`;
  }
  
  return summary;
}; 