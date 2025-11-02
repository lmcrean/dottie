/**
 * Receives second chatbot response
 * Tests continued AI conversation handling
 * Validates follow-up response is properly stored
 */

/**
 * Validate that chatbot responded to the follow-up user message
 * This expects that a second user message was sent and validates the second AI response
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} conversationId - Conversation ID to check
 * @param {number} expectedMessageCount - Expected total message count after second response (default 4)
 * @returns {Promise<Object>} Validation result with response details
 */
export async function receiveChatbotResponseFollowup(request, token, conversationId, expectedMessageCount = 4) {
  try {
    // Get conversation to check for second chatbot response
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

    // Validate message count - should have 4 messages total
    if (messages.length !== expectedMessageCount) {
      return {
        success: false,
        error: `Expected ${expectedMessageCount} messages, got ${messages.length}`,
        message_count: messages.length,
        expected_count: expectedMessageCount,
        conversation_id: conversationId
      };
    }

    // Find all assistant messages
    const assistantMessages = messages.filter(msg => msg.role === 'assistant');
    
    if (assistantMessages.length < 2) {
      return {
        success: false,
        error: `Expected at least 2 assistant messages, got ${assistantMessages.length}`,
        assistant_message_count: assistantMessages.length,
        total_message_count: messages.length,
        conversation_id: conversationId
      };
    }

    // Get the second (latest) assistant message
    const secondAssistantMessage = assistantMessages[1];
    const responseContent = secondAssistantMessage.content || '';

    // Validate response quality
    const hasContent = responseContent.length > 0;
    const isSubstantial = responseContent.length > 20;
    const appearsRelevant = responseContent.toLowerCase().includes('period') || 
                           responseContent.toLowerCase().includes('cycle') ||
                           responseContent.toLowerCase().includes('menstrual') ||
                           responseContent.length > 50;

    if (!hasContent) {
      return {
        success: false,
        error: 'Second chatbot response is empty',
        response_content: responseContent,
        conversation_id: conversationId
      };
    }

    // Compare with first response to ensure it's different/contextual
    const firstAssistantMessage = assistantMessages[0];
    const firstResponseContent = firstAssistantMessage.content || '';
    const responsesDiffer = responseContent !== firstResponseContent;

    console.log(`✓ Second chatbot response received`);
    console.log(`✓ Response length: ${responseContent.length} characters`);
    console.log(`✓ Response preview: "${responseContent.substring(0, 100)}..."`);
    console.log(`✓ Total messages in conversation: ${messages.length}`);
    console.log(`✓ Total assistant messages: ${assistantMessages.length}`);
    console.log(`✓ Responses differ: ${responsesDiffer}`);

    return {
      success: true,
      response_content: responseContent,
      response_length: responseContent.length,
      is_substantial: isSubstantial,
      appears_relevant: appearsRelevant,
      responses_differ: responsesDiffer,
      message_count: messages.length,
      assistant_message_count: assistantMessages.length,
      conversation_id: conversationId,
      latest_message: secondAssistantMessage,
      is_followup_response: true
    };

  } catch (error) {
    console.error("❌ Failed to receive/validate follow-up chatbot response:", error.message);
    return {
      success: false,
      error: error.message,
      conversation_id: conversationId,
      is_followup_response: true
    };
  }
}

/**
 * Wait for follow-up chatbot response with timeout and retry logic
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} conversationId - Conversation ID to check
 * @param {number} timeoutMs - Timeout in milliseconds (default 30 seconds)
 * @param {number} retryIntervalMs - Retry interval in milliseconds (default 2 seconds)
 * @returns {Promise<Object>} Response validation result
 */
export async function waitForChatbotResponseFollowup(request, token, conversationId, timeoutMs = 30000, retryIntervalMs = 2000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    const result = await receiveChatbotResponseFollowup(request, token, conversationId);
    
    if (result.success) {
      console.log(`✓ Follow-up chatbot response received after ${Date.now() - startTime}ms`);
      return result;
    }

    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, retryIntervalMs));
  }

  return {
    success: false,
    error: `Timeout waiting for follow-up chatbot response after ${timeoutMs}ms`,
    conversation_id: conversationId,
    is_followup_response: true
  };
} 