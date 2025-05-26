/**
 * Message content and length validation
 * Focused on validating message text properties
 */

function validateMessageLength(content) {
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
}

function validateMessageContent(content) {
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
}

function validateMessageText(content) {
    // Combined message text validation
    const lengthValidation = validateMessageLength(content);
    if (!lengthValidation.isValid) {
        return lengthValidation;
    }
    
    const contentValidation = validateMessageContent(content);
    if (!contentValidation.isValid) {
        return contentValidation;
    }
    
    return { isValid: true };
}

module.exports = {
    validateMessageLength,
    validateMessageContent,
    validateMessageText
}; 