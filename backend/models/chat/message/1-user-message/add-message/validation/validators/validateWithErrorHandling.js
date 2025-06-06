import { withValidation } from '../errorHandler.js';

/**
 * Validate with async function using error handling wrapper
 * @param {Function} validationFunction - Async validation function
 * @param {string} context - Validation context
 * @param {*} data - Data to validate
 * @returns {Promise<Object>} - Validation result
 */
export const validateWithErrorHandling = async (validationFunction, context, data) => {
  return withValidation(validationFunction, context, data);
}; 