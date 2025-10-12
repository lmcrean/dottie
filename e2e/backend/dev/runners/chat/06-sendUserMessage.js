/**
 * Sends initial user message using prepared string content
 * Tests user message creation and storage
 */

import { getTestUserMessage } from './01-prepareUserMessageString.js';

/**
 * Send initial user message to an existing conversation
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} conversationId - Existing conversation ID
 * @param {number} messageIndex - Index of message to use from prepared strings (0-5)
 * @returns {Promise<Object>} Response containing message details
 */
export async function sendUserMessage(request, token, conversationId, messageIndex = 0) {
  try {
    const userMessage = getTestUserMessage(messageIndex);
    
    console.log(`Sending user message (index ${messageIndex}): "${userMessage.substring(0, 50)}..."`);

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
      throw new Error(`Failed to parse send message response: ${error.message}`);
    }

    if (response.status() !== 200) {
      console.error("Error response text:", responseText);
      throw new Error(`Failed to send user message: ${response.status()}. Response: ${responseText}`);
    }

    console.log(`✓ User message sent successfully`);
    console.log(`✓ Message content: "${userMessage}"`);

    return {
      success: true,
      message: userMessage,
      conversationId: conversationId,
      messageIndex: messageIndex,
      response: result
    };

  } catch (error) {
    console.error("❌ Failed to send user message:", error.message);
    return {
      success: false,
      error: error.message,
      conversationId: conversationId,
      messageIndex: messageIndex
    };
  }
}

/**
 * Send user message with custom content (not from prepared strings)
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} conversationId - Existing conversation ID
 * @param {string} customMessage - Custom message content
 * @returns {Promise<Object>} Response containing message details
 */
export async function sendCustomUserMessage(request, token, conversationId, customMessage) {
  try {
    console.log(`Sending custom user message: "${customMessage.substring(0, 50)}..."`);

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
      throw new Error(`Failed to send custom user message: ${response.status()}. Response: ${responseText}`);
    }

    const result = await response.json();

    console.log(`✓ Custom user message sent successfully`);

    return {
      success: true,
      message: customMessage,
      conversationId: conversationId,
      response: result
    };

  } catch (error) {
    console.error("❌ Failed to send custom user message:", error.message);
    return {
      success: false,
      error: error.message,
      conversationId: conversationId,
      message: customMessage
    };
  }
} 