/**
 * Validate conversation ID format and presence
 * @param {string} conversationId - Conversation ID to validate
 * @param {string} [context] - Context for error messages
 * @returns {Object} - Validation result
 */
export const validateConversationId = (conversationId, context = 'operation') => {
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
}; 