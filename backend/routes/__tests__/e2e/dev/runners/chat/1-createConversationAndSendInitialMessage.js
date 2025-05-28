/**
 * 1-Create Conversation and Send Initial Message Utility for Development Tests (Playwright)
 * 
 * This handles the ONLY way to create a new conversation - with an assessment_id attached.
 * All conversations MUST have an assessment linked from creation.
 */

/**
 * Create a new conversation and send the initial message with assessment context
 * This is the ONLY way to start a conversation - assessment_id is REQUIRED
 * 
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} message - Initial message content
 * @param {string} assessment_id - Assessment ID for context (REQUIRED)
 * @returns {Promise<Object>} Response containing message, conversationId, and assessment_id
 */
export async function createConversationAndSendInitialMessage(request, token, message, assessment_id) {
  const payload = {
    message: message,
    assessment_id: assessment_id
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
    throw new Error(`Failed to parse create conversation response: ${error.message}`);
  }

  if (response.status() !== 200) {
    console.error("Error response text:", responseText);
    throw new Error(`Failed to create conversation and send initial message: ${response.status()}. Response: ${responseText}`);
  }

  return {
    message: result.message,
    conversationId: result.conversationId,
    assessment_id: assessment_id
  };
}

/**
 * Verify that conversation was created with proper assessment linking
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} conversationId - Conversation ID to verify
 * @param {string} expectedAssessmentId - Expected assessment ID
 * @returns {Promise<boolean>} True if assessment is properly linked
 */
export async function verifyConversationAssessmentLink(request, token, conversationId, expectedAssessmentId) {
  const response = await request.get(`/api/chat/history/${conversationId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (response.status() !== 200) {
    console.error("Failed to get conversation details, status:", response.status());
    const responseText = await response.text();
    console.error("Error response:", responseText);
    throw new Error(`Failed to get conversation details: ${response.status()}. Response: ${responseText}`);
  }

  const conversation = await response.json();
  return conversation.assessment_id === expectedAssessmentId;
} 