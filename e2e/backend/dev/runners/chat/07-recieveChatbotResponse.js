/**
 * Receives chatbot response (GEMINI or mock AI)
 * Tests AI integration and response generation
 * Validates response is properly stored
 */

/**
 * Validate that chatbot responded after user message was sent
 * This function expects that a user message was just sent and waits for/validates the AI response
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} conversationId - Conversation ID to check
 * @param {number} expectedMessageCount - Expected total message count after response
 * @returns {Promise<Object>} Validation result with response details
 */
export async function receiveChatbotResponse(request, token, conversationId, expectedMessageCount = 2) {
  try {
    // Get conversation to check for chatbot response
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
    if (messages.length < expectedMessageCount) {
      return {
        success: false,
        error: `Expected ${expectedMessageCount} messages, got ${messages.length}`,
        message_count: messages.length,
        expected_count: expectedMessageCount,
        conversation_id: conversationId
      };
    }

    // Find the latest assistant message
    const assistantMessages = messages.filter(msg => msg.role === 'assistant');
    
    if (assistantMessages.length === 0) {
      return {
        success: false,
        error: 'No assistant/chatbot messages found',
        message_count: messages.length,
        conversation_id: conversationId
      };
    }

    const latestAssistantMessage = assistantMessages[assistantMessages.length - 1];
    const responseContent = latestAssistantMessage.content || '';

    // Validate response quality
    const hasContent = responseContent.length > 0;
    const isSubstantial = responseContent.length > 20; // More than just a short acknowledgment
    const appearsRelevant = responseContent.toLowerCase().includes('period') || 
                           responseContent.toLowerCase().includes('cycle') ||
                           responseContent.toLowerCase().includes('menstrual') ||
                           responseContent.length > 50; // Assume longer responses are more contextual

    if (!hasContent) {
      return {
        success: false,
        error: 'Chatbot response is empty',
        response_content: responseContent,
        conversation_id: conversationId
      };
    }

    console.log(`✓ Chatbot response received`);
    console.log(`✓ Response length: ${responseContent.length} characters`);
    console.log(`✓ Response preview: "${responseContent.substring(0, 100)}..."`);
    console.log(`✓ Total messages in conversation: ${messages.length}`);

    return {
      success: true,
      response_content: responseContent,
      response_length: responseContent.length,
      is_substantial: isSubstantial,
      appears_relevant: appearsRelevant,
      message_count: messages.length,
      assistant_message_count: assistantMessages.length,
      conversation_id: conversationId,
      latest_message: latestAssistantMessage
    };

  } catch (error) {
    console.error("❌ Failed to receive/validate chatbot response:", error.message);
    return {
      success: false,
      error: error.message,
      conversation_id: conversationId
    };
  }
}

/**
 * Wait for chatbot response with timeout and retry logic
 * Useful if AI responses take time to generate
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} conversationId - Conversation ID to check
 * @param {number} timeoutMs - Timeout in milliseconds (default 30 seconds)
 * @param {number} retryIntervalMs - Retry interval in milliseconds (default 2 seconds)
 * @returns {Promise<Object>} Response validation result
 */
export async function waitForChatbotResponse(request, token, conversationId, timeoutMs = 30000, retryIntervalMs = 2000) {
  const startTime = Date.now();
  
  while (Date.now() - startTime < timeoutMs) {
    const result = await receiveChatbotResponse(request, token, conversationId);
    
    if (result.success) {
      console.log(`✓ Chatbot response received after ${Date.now() - startTime}ms`);
      return result;
    }

    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, retryIntervalMs));
  }

  return {
    success: false,
    error: `Timeout waiting for chatbot response after ${timeoutMs}ms`,
    conversation_id: conversationId
  };
} 