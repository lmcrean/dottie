import { validateRequiredFields } from './validateRequiredFields.js';
import { validateUserId } from './validateUserId.js';
import { validateAssessmentId } from './validateAssessmentId.js';

/**
 * Validate conversation creation data
 * @param {Object} conversationData - Conversation data to validate
 * @param {string} [context] - Context for error messages
 * @returns {Object} - Validation result
 */
export const validateConversationData = (conversationData, context = 'conversation creation') => {
  const allErrors = [];
  const allWarnings = [];

  // Validate required fields
  const requiredValidation = validateRequiredFields(
    conversationData, 
    ['user_id'], 
    context
  );
  allErrors.push(...requiredValidation.errors);

  // Validate user_id specifically
  if (conversationData.user_id) {
    const userIdValidation = validateUserId(conversationData.user_id, context);
    allErrors.push(...userIdValidation.errors);
  }

  // Validate assessment_id if present
  if (conversationData.assessment_id) {
    const assessmentValidation = validateAssessmentId(conversationData.assessment_id, context);
    allErrors.push(...assessmentValidation.errors);
  }

  return {
    isValid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    context
  };
}; 