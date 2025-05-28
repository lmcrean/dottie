/**
 * Get Conversation Endpoint Runner
 * 
 * Handles retrieving a specific conversation by ID for integration tests.
 */

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

  if (response.status() !== 200) {
    throw new Error(`Failed to get conversation: ${response.status()}`);
  }

  return result;
} 