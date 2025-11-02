import logger from '../../../../../../services/logger.js';

/**
 * Validation wrapper result
 */
export interface ValidationWrapperResult<T = any> {
  isValid: boolean;
  result?: T;
  error?: string;
  context?: string;
}

/**
 * Wrapper for validation functions with error handling
 * @param validationFunction - Async validation function
 * @param context - Validation context
 * @param data - Data to validate
 * @returns Validation result
 */
export const withValidation = async <T = any>(
  validationFunction: (data: any) => Promise<T>,
  context: string,
  data: any
): Promise<ValidationWrapperResult<T>> => {
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
      error: error instanceof Error ? error.message : String(error),
      context
    };
  }
};
