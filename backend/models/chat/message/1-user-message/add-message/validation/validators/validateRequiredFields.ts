import type { ExtendedValidationResult } from '../../../../../types.js';

/**
 * Validate required fields are present
 * @param data - Data object to validate
 * @param requiredFields - Required field names
 * @param context - Context for error messages
 * @returns Validation result
 */
export const validateRequiredFields = (
  data: any,
  requiredFields: string[],
  context: string = 'field validation'
): ExtendedValidationResult => {
  const errors: string[] = [];

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
