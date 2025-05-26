import logger from '../../../../../services/logger.js';

/**
 * Wrapper for validation functions with error handling
 * @param {Function} validationFunction - Async validation function
 * @param {string} context - Validation context
 * @param {*} data - Data to validate
 * @returns {Promise<Object>} - Validation result
 */
export const withValidation = async (validationFunction, context, data) => {
  try {
    const result = await validationFunction(data);
    return {
      isValid: true,
      result,
      context
    };
  } catch (error) {
    logger.error(`Validation error in ${context}:`, error);
    return {
      isValid: false,
      error: error.message,
      context
    };
  }
}; 