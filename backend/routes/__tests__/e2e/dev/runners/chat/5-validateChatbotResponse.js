/**
 * Validate Chatbot Response Utility for Development Tests
 * 
 * Validates that chatbot responses meet expected criteria after user messages
 */

/**
 * Validate that a chatbot message has proper structure and content
 * @param {Object} chatbotMessage - The chatbot message object to validate
 * @param {Object} expect - Playwright expect function
 * @returns {boolean} True if validation passes
 */
export function validateChatbotMessageStructure(chatbotMessage, expect) {
  // Validate basic message structure
  expect(chatbotMessage).toHaveProperty('role', 'assistant');
  expect(chatbotMessage).toHaveProperty('content');
  expect(chatbotMessage).toHaveProperty('created_at');
  expect(chatbotMessage).toHaveProperty('id');
  expect(chatbotMessage.content).toBeTruthy();
  expect(typeof chatbotMessage.content).toBe('string');
  expect(chatbotMessage.content.length).toBeGreaterThan(0);
  
  console.log('✅ Chatbot message structure validated (DEV)');
  return true;
}

/**
 * Validate that a chatbot response follows the user message in conversation
 * @param {Array} messages - Array of conversation messages
 * @param {Object} expect - Playwright expect function
 * @returns {boolean} True if validation passes
 */
export function validateChatbotFollowsUser(messages, expect) {
  expect(Array.isArray(messages)).toBe(true);
  expect(messages.length).toBeGreaterThanOrEqual(2);
  
  // Check that conversation follows proper alternating pattern
  for (let i = 0; i < messages.length; i++) {
    if (i === 0) {
      // First message should always be from user
      expect(messages[i].role).toBe('user');
    } else if (i % 2 === 1) {
      // Odd indices should be assistant responses
      expect(messages[i].role).toBe('assistant');
    } else {
      // Even indices should be user messages
      expect(messages[i].role).toBe('user');
    }
  }
  
  console.log('✅ Conversation alternating pattern validated (DEV)');
  return true;
}

/**
 * Validate that chatbot response is contextually appropriate for assessment
 * @param {string} chatbotContent - The chatbot's response content
 * @param {Object} expect - Playwright expect function
 * @returns {boolean} True if validation passes
 */
export function validateAssessmentAwareResponse(chatbotContent, expect) {
  expect(typeof chatbotContent).toBe('string');
  expect(chatbotContent.length).toBeGreaterThan(20); // Reasonable response length
  
  // Check for health-related or menstrual health keywords (basic validation)
  const healthKeywords = [
    'cycle', 'period', 'menstrual', 'symptoms', 'health', 'pain', 'flow',
    'assessment', 'recommend', 'suggest', 'advice', 'track', 'pattern',
    'doctor', 'medical', 'wellness', 'care', 'management', 'healthcare', 'provider',
    'guidance', 'information', 'situation', 'specific'
  ];
  
  const hasRelevantContent = healthKeywords.some(keyword => 
    chatbotContent.toLowerCase().includes(keyword)
  );
  
  expect(hasRelevantContent).toBe(true);
  console.log('✅ Chatbot response appears contextually appropriate (DEV)');
  return true;
}

/**
 * Comprehensive validation of chatbot response after user message
 * @param {Object} conversationDetails - Full conversation object
 * @param {Object} expect - Playwright expect function
 * @returns {boolean} True if all validations pass
 */
export function validateChatbotResponseAfterUserMessage(conversationDetails, expect) {
  expect(conversationDetails).toHaveProperty('messages');
  const messages = conversationDetails.messages;
  
  // Validate conversation structure
  validateChatbotFollowsUser(messages, expect);
  
  // Get the latest chatbot message (should be last in properly structured conversation)
  const latestMessage = messages[messages.length - 1];
  if (latestMessage.role === 'assistant') {
    validateChatbotMessageStructure(latestMessage, expect);
    validateAssessmentAwareResponse(latestMessage.content, expect);
  } else {
    throw new Error('Expected latest message to be from assistant (chatbot)');
  }
  
  console.log('✅ Complete chatbot response validation passed (DEV)');
  return true;
} 