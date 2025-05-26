import logger from '../../../../../services/logger.js';
import { withValidation } from './errorHandler.js';

/**
 * Unified validation helper for chat operations
 * Consolidates common validation patterns and provides standardized interfaces
 */
export class ValidationHelper {
  
  /**
   * Validate user ID format and presence
   * @param {string} userId - User ID to validate
   * @param {string} [context] - Context for error messages
   * @returns {Object} - Validation result
   */
  static validateUserId(userId, context = 'operation') {
    const errors = [];
    
    if (!userId) {
      errors.push('User ID is required');
    } else if (typeof userId !== 'string') {
      errors.push('User ID must be a string');
    } else if (userId.trim().length === 0) {
      errors.push('User ID cannot be empty');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      context
    };
  }

  /**
   * Validate conversation ID format and presence
   * @param {string} conversationId - Conversation ID to validate
   * @param {string} [context] - Context for error messages
   * @returns {Object} - Validation result
   */
  static validateConversationId(conversationId, context = 'operation') {
    const errors = [];
    
    if (!conversationId) {
      errors.push('Conversation ID is required');
    } else if (typeof conversationId !== 'string') {
      errors.push('Conversation ID must be a string');
    } else if (conversationId.trim().length === 0) {
      errors.push('Conversation ID cannot be empty');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      context
    };
  }

  /**
   * Validate message content
   * @param {string} content - Message content to validate
   * @param {Object} [rules] - Validation rules
   * @returns {Object} - Validation result
   */
  static validateMessageContent(content, rules = {}) {
    const {
      minLength = 1,
      maxLength = 4000,
      allowEmpty = false,
      context = 'message validation'
    } = rules;

    const errors = [];
    const warnings = [];

    if (!content && !allowEmpty) {
      errors.push('Message content is required');
      return { isValid: false, errors, warnings, context };
    }

    if (content) {
      if (typeof content !== 'string') {
        errors.push('Message content must be a string');
      } else {
        const trimmed = content.trim();
        
        if (trimmed.length < minLength) {
          errors.push(`Message too short (minimum ${minLength} characters)`);
        }
        
        if (trimmed.length > maxLength) {
          errors.push(`Message too long (maximum ${maxLength} characters)`);
        }
        
        // Check for potentially problematic content
        if (trimmed.length > maxLength * 0.8) {
          warnings.push('Message is quite long');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      context
    };
  }

  /**
   * Validate assessment ID (optional field)
   * @param {string} assessmentId - Assessment ID to validate
   * @param {string} [context] - Context for error messages
   * @returns {Object} - Validation result
   */
  static validateAssessmentId(assessmentId, context = 'assessment validation') {
    const errors = [];
    
    // Assessment ID is optional, so null/undefined is valid
    if (assessmentId !== null && assessmentId !== undefined) {
      if (typeof assessmentId !== 'string') {
        errors.push('Assessment ID must be a string');
      } else if (assessmentId.trim().length === 0) {
        errors.push('Assessment ID cannot be empty string');
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      context
    };
  }

  /**
   * Validate required fields are present
   * @param {Object} data - Data object to validate
   * @param {Array<string>} requiredFields - Required field names
   * @param {string} [context] - Context for error messages
   * @returns {Object} - Validation result
   */
  static validateRequiredFields(data, requiredFields, context = 'field validation') {
    const errors = [];
    
    if (!data || typeof data !== 'object') {
      errors.push('Data object is required');
      return { isValid: false, errors, context };
    }
    
    for (const field of requiredFields) {
      if (data[field] === undefined || data[field] === null) {
        errors.push(`Field '${field}' is required`);
      } else if (typeof data[field] === 'string' && data[field].trim().length === 0) {
        errors.push(`Field '${field}' cannot be empty`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      context
    };
  }

  /**
   * Validate message data for creation
   * @param {Object} messageData - Message data to validate
   * @param {string} [context] - Context for error messages
   * @returns {Object} - Validation result
   */
  static validateMessageData(messageData, context = 'message creation') {
    const allErrors = [];
    const allWarnings = [];

    // Validate required fields
    const requiredValidation = this.validateRequiredFields(
      messageData, 
      ['role', 'content'], 
      context
    );
    allErrors.push(...requiredValidation.errors);

    // Validate content specifically
    if (messageData.content) {
      const contentValidation = this.validateMessageContent(messageData.content, { context });
      allErrors.push(...contentValidation.errors);
      allWarnings.push(...contentValidation.warnings);
    }

    // Validate role
    if (messageData.role && !['user', 'assistant', 'system'].includes(messageData.role)) {
      allErrors.push('Message role must be user, assistant, or system');
    }

    // Validate user_id if present
    if (messageData.user_id) {
      const userIdValidation = this.validateUserId(messageData.user_id, context);
      allErrors.push(...userIdValidation.errors);
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      context
    };
  }

  /**
   * Validate conversation creation data
   * @param {Object} conversationData - Conversation data to validate
   * @param {string} [context] - Context for error messages
   * @returns {Object} - Validation result
   */
  static validateConversationData(conversationData, context = 'conversation creation') {
    const allErrors = [];
    const allWarnings = [];

    // Validate required fields
    const requiredValidation = this.validateRequiredFields(
      conversationData, 
      ['user_id'], 
      context
    );
    allErrors.push(...requiredValidation.errors);

    // Validate user_id specifically
    if (conversationData.user_id) {
      const userIdValidation = this.validateUserId(conversationData.user_id, context);
      allErrors.push(...userIdValidation.errors);
    }

    // Validate assessment_id if present
    if (conversationData.assessment_id) {
      const assessmentValidation = this.validateAssessmentId(conversationData.assessment_id, context);
      allErrors.push(...assessmentValidation.errors);
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      warnings: allWarnings,
      context
    };
  }

  /**
   * Combine multiple validation results
   * @param {Array<Object>} validationResults - Array of validation result objects
   * @param {string} [context] - Overall context
   * @returns {Object} - Combined validation result
   */
  static combineValidationResults(validationResults, context = 'combined validation') {
    const allErrors = [];
    const allWarnings = [];

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
  }

  /**
   * Validate with async function using error handling wrapper
   * @param {Function} validationFunction - Async validation function
   * @param {string} context - Validation context
   * @param {*} data - Data to validate
   * @returns {Promise<Object>} - Validation result
   */
  static async validateWithErrorHandling(validationFunction, context, data) {
    return withValidation(validationFunction, context, data);
  }

  /**
   * Create a validation summary for logging
   * @param {Object} validationResult - Validation result
   * @returns {string} - Summary string
   */
  static createValidationSummary(validationResult) {
    const { isValid, errors, warnings, context } = validationResult;
    
    let summary = `${context}: ${isValid ? 'VALID' : 'INVALID'}`;
    
    if (errors && errors.length > 0) {
      summary += ` (${errors.length} errors)`;
    }
    
    if (warnings && warnings.length > 0) {
      summary += ` (${warnings.length} warnings)`;
    }
    
    return summary;
  }
} 