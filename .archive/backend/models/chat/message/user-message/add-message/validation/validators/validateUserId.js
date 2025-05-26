/**
 * Validate user ID format and presence
 * @param {string} userId - User ID to validate
 * @param {string} [context] - Context for error messages
 * @returns {Object} - Validation result
 */
export const validateUserId = (userId, context = 'operation') => {
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
}; 