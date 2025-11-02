import type { CombinedValidationResult, ExtendedValidationResult } from '../../../../../types.js';

/**
 * Combine multiple validation results
 * @param validationResults - Array of validation result objects
 * @param context - Overall context
 * @returns Combined validation result
 */
export const combineValidationResults = (
  validationResults: ExtendedValidationResult[],
  context: string = 'combined validation'
): CombinedValidationResult => {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

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
