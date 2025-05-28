/**
 * Get Conversation History Utility for Integration Tests (Playwright)
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
    throw new Error(`Failed to get conversation history: ${response.status()}`);
  }

  return result.conversations || [];
} 