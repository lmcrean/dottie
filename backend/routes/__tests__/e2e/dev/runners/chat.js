/**
 * Chat Utilities for Integration Tests
 *
 * This file contains helper functions for chat-related operations
 * in integration tests, such as creating conversations, sending messages,
 * retrieving conversation history, and deleting conversations.
 */

/**
 * Send a message to the AI
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} message - Message content
 * @param {string} conversationId - Optional existing conversation ID
 * @returns {Promise<Object>} Response containing message and conversationId
 */
export async function sendMessage(request, token, message, conversationId = null) {
  const payload = {
    message: message,
    ...(conversationId && { conversationId }) // Include conversationId only if provided
  };

  console.log('Sending message with payload:', JSON.stringify(payload));
  console.log('Using auth token:', token.substring(0, 20) + '...');

  const response = await request.post("/api/chat/send", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: payload,
  });

  console.log('Send message response status:', response.status());
  
  let responseText;
  try {
    responseText = await response.text();
    console.log('Send message response body:', responseText.substring(0, 300) + '...');
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
    throw new Error(`Failed to parse send message response: ${error.message}`);
  }

  if (response.status() !== 200) {
    throw new Error(`Failed to send message: ${response.status()}`);
  }

  return {
    message: result.message,
    conversationId: result.conversationId
  };
}

/**
 * Get all conversations for a user
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @returns {Promise<Array>} List of conversations
 */
export async function getConversationHistory(request, token) {
  const response = await request.get("/api/chat/history", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log('Get conversation history status:', response.status());
  
  let responseText;
  try {
    responseText = await response.text();
    console.log('Conversation history response:', responseText.substring(0, 300) + '...');
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
    throw new Error(`Failed to parse conversation history response: ${error.message}`);
  }

  if (response.status() !== 200) {
    throw new Error(`Failed to get conversation history: ${response.status()}`);
  }

  return result.conversations || [];
}

/**
 * Get a specific conversation by ID
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<Object>} Conversation with messages
 */
export async function getConversation(request, token, conversationId) {
  const response = await request.get(`/api/chat/history/${conversationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(`Get conversation ${conversationId} - Status: ${response.status()}`);
  
  let responseText;
  try {
    responseText = await response.text();
    console.log(`Get conversation response: ${responseText.substring(0, 300) + '...'}`);
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
    throw new Error(`Failed to parse conversation response: ${error.message}`);
  }

  if (response.status() !== 200) {
    throw new Error(`Failed to get conversation: ${response.status()}`);
  }

  return result;
}

/**
 * Delete a conversation
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<boolean>} True if successfully deleted
 */
export async function deleteConversation(request, token, conversationId) {
  console.log(`Deleting conversation ${conversationId}`);

  const response = await request.delete(`/api/chat/history/${conversationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  console.log(`Delete conversation status: ${response.status()}`);

  let responseText;
  try {
    responseText = await response.text();
    console.log(`Delete conversation response: ${responseText}`);
  } catch (error) {
    console.error("Failed to get response text:", error);
  }

  if (response.status() !== 200) {
    throw new Error(`Failed to delete conversation: ${response.status()}`);
  }

  return true;
}

/**
 * Generate a sample chat message
 * @returns {string} A random test message
 */
export function generateTestMessage() {
  const messages = [
    "Hello, how can you help me with my period health?",
    "I've been experiencing severe cramps lately",
    "Can you provide advice on managing PMS symptoms?",
    "What are some natural remedies for menstrual pain?",
    "I'd like to track my cycle, what information should I record?"
  ];
  
  const randomIndex = Math.floor(Math.random() * messages.length);
  return messages[randomIndex];
} 