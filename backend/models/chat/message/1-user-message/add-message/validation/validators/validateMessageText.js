import { validateMessageLength } from './validateMessageLength.js';
import { validateSimpleMessageContent } from './validateSimpleMessageContent.js';

/**
 * Combined message text validation
 * @param {string} content - Message content to validate
 * @returns {Object} - Validation result
 */
export const validateMessageText = (content) => {
    // Combined message text validation
    const lengthValidation = validateMessageLength(content);
    if (!lengthValidation.isValid) {
        return lengthValidation;
    }
    
    const contentValidation = validateSimpleMessageContent(content);
    if (!contentValidation.isValid) {
        return contentValidation;
    }
    
    return { isValid: true };
}; 