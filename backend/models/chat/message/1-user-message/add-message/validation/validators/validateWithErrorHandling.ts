import { withValidation, type ValidationWrapperResult } from '../errorHandler.js';

/**
 * Validate with async function using error handling wrapper
 * @param validationFunction - Async validation function
 * @param context - Validation context
 * @param data - Data to validate
 * @returns Validation result
 */
export const validateWithErrorHandling = async <T = any>(
  validationFunction: (data: any) => Promise<T>,
  context: string,
  data: any
): Promise<ValidationWrapperResult<T>> => {
  return withValidation(validationFunction, context, data);
};
