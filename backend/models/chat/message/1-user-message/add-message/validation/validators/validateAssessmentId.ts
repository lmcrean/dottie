import type { ExtendedValidationResult } from '../../../../../types.js';

/**
 * Validate assessment ID (optional field)
 * @param assessmentId - Assessment ID to validate
 * @param context - Context for error messages
 * @returns Validation result
 */
export const validateAssessmentId = (
  assessmentId: string | number | undefined | null,
  context: string = 'assessment validation'
): ExtendedValidationResult => {
  const errors: string[] = [];

  // Assessment ID is optional, so null/undefined is valid
  if (assessmentId !== null && assessmentId !== undefined) {
    if (typeof assessmentId !== 'string' && typeof assessmentId !== 'number') {
      errors.push('Assessment ID must be a string or number');
    } else if (typeof assessmentId === 'string' && assessmentId.trim().length === 0) {
      errors.push('Assessment ID cannot be empty string');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    context
  };
};
