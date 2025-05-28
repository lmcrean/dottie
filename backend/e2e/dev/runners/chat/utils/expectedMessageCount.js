/**
 * Message Count and Pattern Validation Utility
 * Handles conversation structure validation for chat testing
 */

/**
 * Validate message count matches expectation
 * @param {Array} messages - Array of message objects
 * @param {number} expectedCount - Expected message count
 * @returns {Object} Validation result
 */
export function validateMessageCount(messages, expectedCount) {
    const actualCount = messages.length;
    return {
        success: actualCount === expectedCount,
        expected: expectedCount,
        actual: actualCount,
        error: actualCount !== expectedCount ? 
            `Expected ${expectedCount} messages, got ${actualCount}` : null
    };
}

/**
 * Validate alternating user/assistant pattern
 * @param {Array} messages - Array of message objects
 * @returns {boolean} True if messages alternate correctly
 */
export function validateAlternatingPattern(messages) {
    if (messages.length === 0) return true;
    
    for (let i = 1; i < messages.length; i++) {
        if (messages[i].role === messages[i-1].role) {
            return false;
        }
    }
    
    return true;
}

/**
 * Validate conversation has expected structure
 * @param {Object} conversation - Conversation object
 * @param {number} expectedMessageCount - Expected message count (default 4)
 * @returns {Object} Validation result
 */
export function validateConversationStructure(conversation, expectedMessageCount = 4) {
    const messages = conversation.messages || [];
    
    // Check message count
    const countValidation = validateMessageCount(messages, expectedMessageCount);
    if (!countValidation.success) {
        return {
            success: false,
            error: countValidation.error,
            type: 'message_count',
            details: countValidation
        };
    }

    // Check alternating pattern
    const alternatingValid = validateAlternatingPattern(messages);
    if (!alternatingValid) {
        return {
            success: false,
            error: 'Messages do not follow alternating user/assistant pattern',
            type: 'alternating_pattern',
            actual_pattern: messages.map(m => m.role)
        };
    }

    // Check first message is user
    if (messages.length > 0 && messages[0].role !== 'user') {
        return {
            success: false,
            error: 'First message must be from user',
            type: 'first_message_role',
            first_message_role: messages[0].role
        };
    }

    return {
        success: true,
        message_count: messages.length,
        pattern_valid: true,
        first_message_role: messages[0]?.role
    };
}

/**
 * Get expected message pattern for given count
 * @param {number} messageCount - Total message count
 * @returns {Array} Expected role pattern
 */
export function getExpectedPattern(messageCount) {
    const pattern = [];
    for (let i = 0; i < messageCount; i++) {
        pattern.push(i % 2 === 0 ? 'user' : 'assistant');
    }
    return pattern;
}
