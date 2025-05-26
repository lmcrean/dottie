import logger from '../../../../../services/logger.js';

/**
 * Standardized error handling wrapper for async operations
 * @param {Function} operation - Async operation to execute
 * @param {string} context - Context for logging (e.g., 'creating conversation')
 * @param {Object} [options] - Additional options
 * @param {boolean} [options.logSuccess=true] - Whether to log success
 * @param {boolean} [options.rethrow=true] - Whether to rethrow errors
 * @returns {Promise} - Operation result or error
 */
export const withErrorHandling = async (operation, context, options = {}) => {
  const { logSuccess = true, rethrow = true } = options;
  
  try {
    const result = await operation();
    
    if (logSuccess) {
      logger.info(`Successfully completed ${context}`);
    }
    
    return result;
  } catch (error) {
    logger.error(`Error ${context}:`, error);
    
    if (rethrow) {
      throw error;
    }
    
    return { error: error.message };
  }
};

/**
 * Validation wrapper with standardized error handling
 * @param {Function} validator - Validation function
 * @param {string} context - Validation context
 * @param {*} data - Data to validate
 * @returns {Object} - Validation result
 */
export const withValidation = async (validator, context, data) => {
  try {
    const result = await validator(data);
    
    if (!result.isValid && result.errors?.length > 0) {
      logger.warn(`Validation failed for ${context}:`, result.errors);
    }
    
    return result;
  } catch (error) {
    logger.error(`Validation error for ${context}:`, error);
    return {
      isValid: false,
      errors: [`Validation failed: ${error.message}`]
    };
  }
};

/**
 * Database operation wrapper with standardized error handling
 * @param {Function} dbOperation - Database operation function
 * @param {string} operation - Operation name (e.g., 'insert', 'update', 'delete')
 * @param {string} entity - Entity type (e.g., 'message', 'conversation')
 * @param {string} [id] - Entity ID for logging
 * @returns {Promise} - Operation result
 */
export const withDatabaseOperation = async (dbOperation, operation, entity, id = null) => {
  const context = id ? `${operation} ${entity} ${id}` : `${operation} ${entity}`;
  
  return withErrorHandling(dbOperation, context);
};

/**
 * Service operation wrapper for external service calls
 * @param {Function} serviceCall - Service call function  
 * @param {string} serviceName - Service name (e.g., 'AI', 'mock')
 * @param {string} operation - Operation description
 * @param {Function} fallback - Fallback function if service fails
 * @returns {Promise} - Service result or fallback result
 */
export const withServiceCall = async (serviceCall, serviceName, operation, fallback = null) => {
  try {
    const result = await serviceCall();
    logger.info(`${serviceName} ${operation} completed successfully`);
    return result;
  } catch (error) {
    logger.error(`${serviceName} ${operation} failed:`, error);
    
    if (fallback) {
      logger.info(`Falling back for ${serviceName} ${operation}`);
      return await fallback();
    }
    
    throw error;
  }
}; 