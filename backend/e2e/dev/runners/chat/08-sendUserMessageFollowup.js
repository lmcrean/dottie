/**
 * Sends second user message (DRY principles, reusing logic from step 6)
 * Uses different string from prepared messages
 * Tests ongoing conversation flow
 */

import { getTestUserMessage } from './01-prepareUserMessageString.js';

/**
 * Send follow-up user message to continue conversation
 * Reuses logic from 06-sendUserMessage.js but with different message content
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} conversationId - Existing conversation ID
 * @param {number} messageIndex - Index of message to use from prepared strings (default 1, different from initial)
 * @returns {Promise<Object>} Response containing message details
 */
export async function sendUserMessageFollowup(request, token, conversationId, messageIndex = 1) {
  try {
    const userMessage = getTestUserMessage(messageIndex);
    
    console.log(`Sending follow-up user message (index ${messageIndex}): "${userMessage.substring(0, 50)}..."`);

    const payload = {
      message: userMessage,
      conversationId: conversationId
    };

    const response = await request.post("/api/chat/send", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    });
    
    let responseText;
    try {
      responseText = await response.text();
    } catch (error) {
      console.error("Failed to get response text:", error);
    }

    let result;
    try {
      if (responseText) {
        result = JSON.parse(responseText);
      }
    } catch (error) {
      console.error("Failed to parse JSON response:", error);
      console.error("Response text:", responseText);
      throw new Error(`Failed to parse follow-up message response: ${error.message}`);
    }

    if (response.status() !== 200) {
      console.error("Error response text:", responseText);
      throw new Error(`Failed to send follow-up user message: ${response.status()}. Response: ${responseText}`);
    }

    console.log(`✓ Follow-up user message sent successfully`);
    console.log(`✓ Message content: "${userMessage}"`);
    console.log(`✓ This is the second user message in the conversation`);

    return {
      success: true,
      message: userMessage,
      conversationId: conversationId,
      messageIndex: messageIndex,
      isFollowup: true,
      response: result
    };

  } catch (error) {
    console.error("❌ Failed to send follow-up user message:", error.message);
    return {
      success: false,
      error: error.message,
      conversationId: conversationId,
      messageIndex: messageIndex,
      isFollowup: true
    };
  }
}

/**
 * Send follow-up message with custom content
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} conversationId - Existing conversation ID
 * @param {string} customMessage - Custom follow-up message content
 * @returns {Promise<Object>} Response containing message details
 */
export async function sendCustomUserMessageFollowup(request, token, conversationId, customMessage) {
  try {
    console.log(`Sending custom follow-up user message: "${customMessage.substring(0, 50)}..."`);

    const payload = {
      message: customMessage,
      conversationId: conversationId
    };

    const response = await request.post("/api/chat/send", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: payload,
    });
    
    if (response.status() !== 200) {
      const responseText = await response.text();
      throw new Error(`Failed to send custom follow-up message: ${response.status()}. Response: ${responseText}`);
    }

    const result = await response.json();

    console.log(`✓ Custom follow-up user message sent successfully`);

    return {
      success: true,
      message: customMessage,
      conversationId: conversationId,
      isFollowup: true,
      response: result
    };

  } catch (error) {
    console.error("❌ Failed to send custom follow-up user message:", error.message);
    return {
      success: false,
      error: error.message,
      conversationId: conversationId,
      message: customMessage,
      isFollowup: true
    };
  }
} 