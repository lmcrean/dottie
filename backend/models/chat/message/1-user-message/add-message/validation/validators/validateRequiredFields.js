/**
 * Validate required fields are present
 * @param {Object} data - Data object to validate
 * @param {Array<string>} requiredFields - Required field names
 * @param {string} [context] - Context for error messages
 * @returns {Object} - Validation result
 */
export const validateRequiredFields = (data, requiredFields, context = 'field validation') => {
  const errors = [];
  
  if (!data || typeof data !== 'object') {
    errors.push('Data object is required');
    return { isValid: false, errors, context };
  }
  
  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null) {
      errors.push(`Field '${field}' is required`);
    } else if (typeof data[field] === 'string' && data[field].trim().length === 0) {
      errors.push(`Field '${field}' cannot be empty`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    context
  };
}; 