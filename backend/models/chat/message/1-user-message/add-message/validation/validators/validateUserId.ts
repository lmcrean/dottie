import type { ExtendedValidationResult } from '../../../../../types.js';

/**
 * Validate user ID format and presence
 * @param userId - User ID to validate
 * @param context - Context for error messages
 * @returns Validation result
 */
export const validateUserId = (
  userId: string | number | undefined | null,
  context: string = 'operation'
): ExtendedValidationResult => {
  const errors: string[] = [];

  if (!userId) {
    errors.push('User ID is required');
  } else if (typeof userId !== 'string' && typeof userId !== 'number') {
    errors.push('User ID must be a string or number');
  } else if (typeof userId === 'string' && userId.trim().length === 0) {
    errors.push('User ID cannot be empty');
  }

  return {
    isValid: errors.length === 0,
    errors,
    context
  };
};
