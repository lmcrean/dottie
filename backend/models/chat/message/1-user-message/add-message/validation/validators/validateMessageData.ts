import type { ExtendedValidationResult, MessageRole } from '../../../../../types.js';
import { validateRequiredFields } from './validateRequiredFields.js';
import { validateMessageContent } from './validateMessageContent.js';
import { validateUserId } from './validateUserId.js';

/**
 * Message data for validation
 */
interface MessageData {
  role?: MessageRole | string;
  content?: string;
  user_id?: string | number;
  [key: string]: any;
}

/**
 * Validate message data for creation
 * @param messageData - Message data to validate
 * @param context - Context for error messages
 * @returns Validation result
 */
export const validateMessageData = (
  messageData: MessageData,
  context: string = 'message creation'
): ExtendedValidationResult => {
  const allErrors: string[] = [];
  const allWarnings: string[] = [];

  // Validate required fields
  const requiredValidation = validateRequiredFields(
    messageData,
    ['role', 'content'],
    context
  );
  allErrors.push(...requiredValidation.errors);

  // Validate content specifically
  if (messageData.content) {
    const contentValidation = validateMessageContent(messageData.content, {});
    allErrors.push(...contentValidation.errors);
    if (contentValidation.warnings) {
      allWarnings.push(...contentValidation.warnings);
    }
  }

  // Validate role
  if (messageData.role && !['user', 'assistant', 'system'].includes(messageData.role)) {
    allErrors.push('Message role must be user, assistant, or system');
  }

  // Validate user_id if present
  if (messageData.user_id) {
    const userIdValidation = validateUserId(messageData.user_id, context);
    allErrors.push(...userIdValidation.errors);
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    context
  };
};
