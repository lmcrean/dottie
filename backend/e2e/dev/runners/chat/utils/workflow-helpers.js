/**
 * Workflow Helper Utilities
 * Common operations used across chat workflows
 */

/**
 * Log workflow step with emoji and message
 * @param {string} step - Step description
 * @param {string} emoji - Emoji for the step
 */
export function logWorkflowStep(step, emoji = '✅') {
    console.log(`${emoji} ${step}`);
}

/**
 * Create expectation validator for conversation properties
 * @param {Function} expect - Playwright expect function
 * @param {Object} conversation - Conversation object to validate
 * @param {string} expectedConversationId - Expected conversation ID
 * @param {string} expectedAssessmentId - Expected assessment ID
 * @returns {void}
 */
export function validateConversationExpectations(expect, conversation, expectedConversationId, expectedAssessmentId) {
    expect(conversation).toHaveProperty('id', expectedConversationId);
    expect(conversation).toHaveProperty('assessment_id', expectedAssessmentId);
    expect(conversation).toHaveProperty('messages');
    expect(Array.isArray(conversation.messages)).toBe(true);
    expect(conversation.messages.length).toBeGreaterThan(0);
}

/**
 * Validate conversation creation result
 * @param {Function} expect - Playwright expect function
 * @param {Object} result - Conversation creation result
 * @param {string} expectedAssessmentId - Expected assessment ID
 * @returns {string} Conversation ID
 */
export function validateConversationCreation(expect, result, expectedAssessmentId) {
    expect(result).toHaveProperty('conversationId');
    expect(result.conversationId).toBeTruthy();
    expect(result.assessment_id).toBe(expectedAssessmentId);
    return result.conversationId;
}

/**
 * Validate message send result
 * @param {Function} expect - Playwright expect function
 * @param {Object} result - Message send result
 * @param {string} expectedConversationId - Expected conversation ID
 * @returns {void}
 */
export function validateMessageSendResult(expect, result, expectedConversationId) {
    expect(result.success).toBe(true);
    expect(result.conversationId).toBe(expectedConversationId);
    expect(result).toHaveProperty('message');
}

/**
 * Validate conversation appears in history
 * @param {Function} expect - Playwright expect function
 * @param {Array} conversations - Array of conversations from history
 * @param {string} conversationId - Conversation ID to find
 * @param {string} assessmentId - Expected assessment ID
 * @returns {Object} Found conversation
 */
export function validateConversationInHistory(expect, conversations, conversationId, assessmentId) {
    const foundConversation = conversations.find(conv => conv.id === conversationId);
    expect(foundConversation).toBeTruthy();
    expect(foundConversation.assessment_id).toBe(assessmentId);
    return foundConversation;
} 