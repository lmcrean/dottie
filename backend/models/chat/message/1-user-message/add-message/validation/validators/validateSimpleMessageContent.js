/**
 * Simple message content validation
 * @param {string} content - Message content to validate
 * @returns {Object} - Validation result
 */
export const validateSimpleMessageContent = (content) => {
    if (typeof content !== 'string') {
        return {
            isValid: false,
            error: 'Message content must be a string'
        };
    }
    
    // Check for only whitespace
    if (/^\s*$/.test(content)) {
        return {
            isValid: false,
            error: 'Message cannot contain only whitespace'
        };
    }
    
    // Check for excessive repeated characters
    if (/(.)\1{50,}/.test(content)) {
        return {
            isValid: false,
            error: 'Message contains excessive repeated characters'
        };
    }
    
    return { isValid: true };
}; 