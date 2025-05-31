/**
 * Message length validation
 * @param {string} content - Message content to validate
 * @returns {Object} - Validation result
 */
export const validateMessageLength = (content) => {
    const minLength = 1;
    const maxLength = 4000;
    
    if (!content || content.trim().length < minLength) {
        return {
            isValid: false,
            error: 'Message cannot be empty'
        };
    }
    
    if (content.length > maxLength) {
        return {
            isValid: false,
            error: `Message too long (max ${maxLength} characters)`
        };
    }
    
    return { isValid: true };
}; 