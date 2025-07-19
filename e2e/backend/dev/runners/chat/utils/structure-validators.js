/**
 * Structure Validators for Chat Tests
 * Validates conversation and message structures
 */

/**
 * Validate conversation structure meets expectations
 * @param {Object} conversation - Conversation object to validate
 * @param {number} expectedMessageCount - Expected number of messages
 * @returns {Object} Validation result
 */
export function validateConversationStructure(conversation, expectedMessageCount = 2) {
  const messages = conversation.messages || [];
  const actualCount = messages.length;
  
  // Log message details for debugging
  console.log(`🔍 Validating conversation structure...`);
  console.log(`   Expected message count: ${expectedMessageCount}`);
  console.log(`   Actual message count: ${actualCount}`);
  console.log(`   Messages: ${JSON.stringify(messages, null, 2)}`);
  
  // Check message count validation
  const messageCountCorrect = actualCount === expectedMessageCount;
  
  // For conversations with 2+ messages, check alternating pattern
  let alternatingPattern = true;
  let firstMessageIsUser = true;
  
  if (messages.length >= 2) {
    // Check alternating pattern (user -> assistant -> user -> ...)
    let expectedRole = 'user';
    alternatingPattern = messages.every((message, index) => {
      const result = message.role === expectedRole;
      expectedRole = expectedRole === 'user' ? 'assistant' : 'user';
      return result;
    });
    
    // Check first message is from user
    firstMessageIsUser = messages[0].role === 'user';
  }
  
  // Build validation result
  const validationResult = {
    success: messageCountCorrect && alternatingPattern && firstMessageIsUser,
    messageCountCorrect,
    alternatingPattern,
    firstMessageIsUser,
    expectedCount: expectedMessageCount,
    actualCount
  };
  
  // Log validation results
  if (messageCountCorrect) {
    console.log(`✅ Message count validation passed`);
  } else {
    console.log(`❌ Message count validation failed. Expected: ${expectedMessageCount}, Got: ${actualCount}`);
  }
  
  if (alternatingPattern) {
    console.log(`✅ Alternating pattern validation passed`);
  } else {
    console.log(`❌ Alternating pattern validation failed`);
  }
  
  if (firstMessageIsUser) {
    console.log(`✅ First message role validation passed`);
  } else {
    console.log(`❌ First message role validation failed. Expected: user, Got: ${messages[0]?.role || 'none'}`);
  }
  
  if (validationResult.success) {
    console.log(`✅ All conversation structure validations passed`);
  } else {
    console.log(`❌ Some conversation structure validations failed`);
  }
  
  return validationResult;
} 