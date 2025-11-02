import type { ExtendedValidationResult } from '../../../../../types.js';

/**
 * Create a validation summary for logging
 * @param validationResult - Validation result
 * @returns Summary string
 */
export const createValidationSummary = (validationResult: ExtendedValidationResult): string => {
  const { isValid, errors, warnings, context } = validationResult;

  let summary = `${context || 'validation'}: ${isValid ? 'VALID' : 'INVALID'}`;

  if (errors && errors.length > 0) {
    summary += ` (${errors.length} errors)`;
  }

  if (warnings && warnings.length > 0) {
    summary += ` (${warnings.length} warnings)`;
  }

  return summary;
};
