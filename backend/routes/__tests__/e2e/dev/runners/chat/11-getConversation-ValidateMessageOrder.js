/**
 * CRITICAL BUG TEST: Validates message sequence is correct
 * Expected order: user → assistant → user → assistant
 * Addresses known production bug with message ordering
 */

/**
 * Validate that messages are in correct chronological order
 * This is critical for conversation coherence and addresses a known production bug
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} conversationId - Conversation ID to validate
 * @param {number} expectedMessageCount - Expected total message count (default 4)
 * @returns {Promise<Object>} Validation result with detailed message order analysis
 */
export async function validateMessageOrder(request, token, conversationId, expectedMessageCount = 4) {
  try {
    // Get conversation details
    const response = await request.get(`/api/chat/history/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (response.status() !== 200) {
      const responseText = await response.text();
      throw new Error(`Failed to get conversation: ${response.status()}. Response: ${responseText}`);
    }

    const conversation = await response.json();
    const messages = conversation.messages || [];

    // Validate message count
    if (messages.length !== expectedMessageCount) {
      return {
        success: false,
        error: `Expected ${expectedMessageCount} messages, got ${messages.length}`,
        message_count: messages.length,
        expected_count: expectedMessageCount,
        conversation_id: conversationId
      };
    }

    // Expected pattern for 4 messages: user, assistant, user, assistant
    const expectedPattern = ['user', 'assistant', 'user', 'assistant'];
    const actualPattern = messages.map(msg => msg.role);
    
    // Check if pattern matches exactly
    const patternMatches = JSON.stringify(actualPattern) === JSON.stringify(expectedPattern);
    
    // Additional validation: check timestamps are in chronological order
    const timestamps = messages.map(msg => new Date(msg.created_at || msg.timestamp));
    const isChronological = timestamps.every((timestamp, index) => {
      if (index === 0) return true;
      return timestamp >= timestamps[index - 1];
    });

    // Detailed analysis for debugging
    const messageAnalysis = messages.map((msg, index) => ({
      index: index,
      role: msg.role,
      timestamp: msg.created_at || msg.timestamp,
      content_preview: (msg.content || '').substring(0, 50) + '...',
      expected_role: expectedPattern[index]
    }));

    if (!patternMatches) {
      console.error(`❌ Message order is incorrect!`);
      console.error(`Expected: ${expectedPattern.join(' → ')}`);
      console.error(`Actual:   ${actualPattern.join(' → ')}`);
      console.error(`Message analysis:`, messageAnalysis);
      
      return {
        success: false,
        error: 'Message order is incorrect - production bug detected!',
        expected_pattern: expectedPattern,
        actual_pattern: actualPattern,
        is_chronological: isChronological,
        message_analysis: messageAnalysis,
        conversation_id: conversationId,
        bug_detected: true
      };
    }

    if (!isChronological) {
      console.error(`❌ Messages are not in chronological order!`);
      console.error(`Timestamp analysis:`, messageAnalysis);
      
      return {
        success: false,
        error: 'Messages are not in chronological timestamp order',
        expected_pattern: expectedPattern,
        actual_pattern: actualPattern,
        is_chronological: false,
        message_analysis: messageAnalysis,
        conversation_id: conversationId,
        timestamp_bug_detected: true
      };
    }

    console.log(`✓ Message order validation PASSED`);
    console.log(`✓ Pattern: ${actualPattern.join(' → ')}`);
    console.log(`✓ Chronological order: ${isChronological}`);
    console.log(`✓ Total messages: ${messages.length}`);

    return {
      success: true,
      message_count: messages.length,
      pattern_correct: true,
      is_chronological: true,
      expected_pattern: expectedPattern,
      actual_pattern: actualPattern,
      message_analysis: messageAnalysis,
      conversation_id: conversationId,
      production_bug_not_detected: true
    };

  } catch (error) {
    console.error("❌ Failed to validate message order:", error.message);
    return {
      success: false,
      error: error.message,
      conversation_id: conversationId
    };
  }
}

/**
 * Quick check for alternating user/assistant pattern
 * @param {Array} messages - Array of message objects
 * @returns {boolean} True if messages alternate between user and assistant
 */
export function validateAlternatingPattern(messages) {
  if (messages.length === 0) return true;
  
  for (let i = 1; i < messages.length; i++) {
    if (messages[i].role === messages[i-1].role) {
      return false; // Found consecutive messages with same role
    }
  }
  
  return true;
}

/**
 * Advanced message order validation with detailed error reporting
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} conversationId - Conversation ID to validate
 * @returns {Promise<Object>} Detailed validation result
 */
export async function advancedMessageOrderValidation(request, token, conversationId) {
  const result = await validateMessageOrder(request, token, conversationId);
  
  if (result.success) {
    return result;
  }

  // Additional debugging for failed cases
  console.log(`🔍 Advanced debugging for conversation ${conversationId}:`);
  console.log(`🔍 Message count: ${result.message_count}`);
  console.log(`🔍 Expected pattern: ${result.expected_pattern?.join(' → ')}`);
  console.log(`🔍 Actual pattern: ${result.actual_pattern?.join(' → ')}`);
  
  if (result.message_analysis) {
    console.log(`🔍 Detailed message analysis:`);
    result.message_analysis.forEach(msg => {
      const status = msg.role === msg.expected_role ? '✓' : '❌';
      console.log(`  ${status} Message ${msg.index}: ${msg.role} (expected: ${msg.expected_role}) - ${msg.content_preview}`);
    });
  }

  return result;
} 