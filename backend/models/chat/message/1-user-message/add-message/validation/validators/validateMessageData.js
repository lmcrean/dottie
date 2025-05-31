import { validateRequiredFields } from './validateRequiredFields.js';
import { validateMessageContent } from './validateMessageContent.js';
import { validateUserId } from './validateUserId.js';

/**
 * Validate message data for creation
 * @param {Object} messageData - Message data to validate
 * @param {string} [context] - Context for error messages
 * @returns {Object} - Validation result
 */
export const validateMessageData = (messageData, context = 'message creation') => {
  const allErrors = [];
  const allWarnings = [];

  // Validate required fields
  const requiredValidation = validateRequiredFields(
    messageData, 
    ['role', 'content'], 
    context
  );
  allErrors.push(...requiredValidation.errors);

  // Validate content specifically
  if (messageData.content) {
    const contentValidation = validateMessageContent(messageData.content, { context });
    allErrors.push(...contentValidation.errors);
    allWarnings.push(...contentValidation.warnings);
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