/**
 * Chat Utilities for Production Integration Tests
 *
 * This file contains helper functions for chat-related operations
 * in production integration tests, such as creating conversations, sending messages,
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
    throw new Error(`Failed to parse send message response: ${error.message}`);
  }

  if ((response as MockResponse).status() !== 200) {
    throw new Error(`Failed to send message: ${(response as MockResponse).status()}`);
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
    throw new Error(`Failed to parse conversation history response: ${error.message}`);
  }

  if ((response as MockResponse).status() !== 200) {
    throw new Error(`Failed to get conversation history: ${(response as MockResponse).status()}`);
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
    throw new Error(`Failed to parse conversation response: ${error.message}`);
  }

  if ((response as MockResponse).status() !== 200) {
    throw new Error(`Failed to get conversation: ${(response as MockResponse).status()}`);
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


  const response = await request.delete(`/api/chat/history/${conversationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });



  let responseText;
  try {
    responseText = await response.text();

  } catch (error) {
    console.error("Failed to get response text:", error);
  }

  if ((response as MockResponse).status() !== 200) {
    throw new Error(`Failed to delete conversation: ${(response as MockResponse).status()}`);
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

