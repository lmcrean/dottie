import type { ValidationResult } from '../../../../../types.js';

/**
 * Message length validation
 * @param content - Message content to validate
 * @returns Validation result
 */
export const validateMessageLength = (content: string | undefined | null): ValidationResult => {
  const minLength = 1;
  const maxLength = 4000;

  if (!content || content.trim().length < minLength) {
    return {
      isValid: false,
      error: 'Message cannot be empty'
    };
  }

  if (content.length > maxLength) {
    return {
      isValid: false,
      error: `Message too long (max ${maxLength} characters)`
    };
  }

  return { isValid: true };
};
