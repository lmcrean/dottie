import logger from '../../../../../../services/logger.js';

/**
 * Validate message content
 * @param {string} content - Message content to validate
 * @param {Object} [rules] - Validation rules
 * @returns {Object} - Validation result
 */
export const validateMessageContent = (content, rules = {}) => {
  const {
    minLength = 1,
    maxLength = 4000,
    allowEmpty = false,
    blockedPatterns = [],
    requiredPatterns = []
  } = rules;

  const result = {
    isValid: true,
    errors: [],
    warnings: []
  };

  try {
    // Check if content exists
    if (!content && !allowEmpty) {
      result.isValid = false;
      result.errors.push('Message content cannot be empty');
      return result;
    }

    if (content) {
      // Length checks
      if (content.length < minLength) {
        result.isValid = false;
        result.errors.push(`Message too short (minimum ${minLength} characters)`);
      }

      if (content.length > maxLength) {
        result.isValid = false;
        result.errors.push(`Message too long (maximum ${maxLength} characters)`);
      }

      // Check blocked patterns
      for (const pattern of blockedPatterns) {
        if (new RegExp(pattern, 'i').test(content)) {
          result.isValid = false;
          result.errors.push('Message contains blocked content');
          break;
        }
      }

      // Check required patterns
      for (const pattern of requiredPatterns) {
        if (!new RegExp(pattern, 'i').test(content)) {
          result.warnings.push(`Message should contain: ${pattern}`);
        }
      }
    }

    return result;

  } catch (error) {
    logger.error('Error validating message content:', error);
    result.isValid = false;
    result.errors.push('Validation error occurred');
    return result;
  }
}; 