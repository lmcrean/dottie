/**
 * User Message String Utility
 * Handles test message generation and selection for chat testing
 */

/**
 * Predefined test messages for chat scenarios
 */
const TEST_MESSAGES = [
    "I've been experiencing irregular periods lately. Can you help me understand what might be causing this?",
    "My cramps have been really painful this month. I'm wondering if there's anything I can do to manage the pain better.",
    "I noticed my flow seems heavier than usual. Should I be concerned about this change in my cycle?",
    "I'm trying to track my cycle more accurately. What are the most important things I should be monitoring?",
    "I've been feeling really moody before my period starts. Is this normal and are there ways to cope with it?",
    "My cycle length keeps changing each month. How much variation is considered normal?"
];

/**
 * Get test user message by index
 * @param {number} index - Message index (defaults to 0)
 * @returns {string} Test message string
 */
export function getTestUserMessage(index = 0) {
    return TEST_MESSAGES[index] || TEST_MESSAGES[0];
}

/**
 * Get random test user message
 * @returns {string} Random test message string
 */
export function getRandomTestUserMessage() {
    return TEST_MESSAGES[Math.floor(Math.random() * TEST_MESSAGES.length)];
}

/**
 * Get all available test messages
 * @returns {Array} Array of all test messages
 */
export function getAllTestMessages() {
    return [...TEST_MESSAGES];
}

/**
 * Get test message count
 * @returns {number} Total number of available test messages
 */
export function getTestMessageCount() {
    return TEST_MESSAGES.length;
}

/**
 * Prepare user message strings with utility functions
 * @returns {Object} Message utilities object
 */
export function prepareUserMessageStrings() {
    return {
        messages: TEST_MESSAGES,
        getRandomMessage: getRandomTestUserMessage,
        getMessageByIndex: getTestUserMessage,
        totalMessages: TEST_MESSAGES.length
    };
}
