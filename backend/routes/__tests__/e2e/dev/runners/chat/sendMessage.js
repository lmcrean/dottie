/**
 * Send Message Utility for Integration Tests (Playwright)
 */

/**
 * Send a message to the AI
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} message - Message content
 * @param {string} conversationId - Optional existing conversation ID
 * @param {string} assessment_id - Optional assessment ID for context
 * @returns {Promise<Object>} Response containing message and conversationId
 */
export async function sendMessage(request, token, message, conversationId = null, assessment_id = null) {
  const payload = {
    message: message,
    ...(conversationId && { conversationId }), // Include conversationId only if provided
    ...(assessment_id && { assessment_id }) // Include assessment_id only if provided
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

  if (response.status() !== 200) {
    throw new Error(`Failed to send message: ${response.status()}`);
  }

  return {
    message: result.message,
    conversationId: result.conversationId
  };
} 