/**
 * Send Follow-Up Message Endpoint Runner for Development Tests
 * 
 * Handles sending follow-up messages to EXISTING conversations only.
 * For creating new conversations, use createConversationAndSendInitialMessage.js
 */

/**
 * Send a follow-up message to an existing conversation
 * Note: This can ONLY be used for existing conversations. 
 * To create a new conversation, use createConversationAndSendInitialMessage()
 * 
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} message - Message content
 * @param {string} conversationId - REQUIRED - ID of existing conversation
 * @returns {Promise<Object>} Response containing message and conversationId
 */
export async function sendFollowUpMessage(request, token, message, conversationId) {
  if (!conversationId) {
    throw new Error("conversationId is required for follow-up messages. Use createConversationAndSendInitialMessage() to start a new conversation.");
  }

  const payload = {
    message: message,
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
    throw new Error(`Failed to parse follow-up message response: ${error.message}`);
  }

  if (response.status() !== 200) {
    console.error("Error response text:", responseText);
    throw new Error(`Failed to send follow-up message: ${response.status()}. Response: ${responseText}`);
  }

  return {
    message: result.message,
    conversationId: result.conversationId
  };
} 