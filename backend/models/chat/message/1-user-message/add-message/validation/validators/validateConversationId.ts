import type { ExtendedValidationResult } from '../../../../../types.js';

/**
 * Validate conversation ID format and presence
 * @param conversationId - Conversation ID to validate
 * @param context - Context for error messages
 * @returns Validation result
 */
export const validateConversationId = (
  conversationId: string | number | undefined | null,
  context: string = 'operation'
): ExtendedValidationResult => {
  const errors: string[] = [];

  if (!conversationId) {
    errors.push('Conversation ID is required');
  } else if (typeof conversationId !== 'string' && typeof conversationId !== 'number') {
    errors.push('Conversation ID must be a string or number');
  } else if (typeof conversationId === 'string' && conversationId.trim().length === 0) {
    errors.push('Conversation ID cannot be empty');
  }

  return {
    isValid: errors.length === 0,
    errors,
    context
  };
};
