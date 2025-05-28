/**
 * Get Conversation History Endpoint Runner
 * 
 * Handles retrieving conversation history for integration tests.
 */

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

  if (response.status() !== 200) {
    console.error("Error response text:", responseText);
    throw new Error(`Failed to get conversation history: ${response.status()}. Response: ${responseText}`);
  }

  return result.conversations || [];
} 