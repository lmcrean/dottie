/**
 * Combine multiple validation results
 * @param {Array<Object>} validationResults - Array of validation result objects
 * @param {string} [context] - Overall context
 * @returns {Object} - Combined validation result
 */
export const combineValidationResults = (validationResults, context = 'combined validation') => {
  const allErrors = [];
  const allWarnings = [];

  for (const result of validationResults) {
    if (result.errors) {
      allErrors.push(...result.errors);
    }
    if (result.warnings) {
      allWarnings.push(...result.warnings);
    }
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    context,
    validationCount: validationResults.length
  };
}; 