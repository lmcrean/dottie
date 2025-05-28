/**
 * Send Message With Assessment Utility for Integration Tests (Playwright)
 * Tests conversation creation with assessment context linking
 */

/**
 * Send an initial message with assessment context
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} message - Message content
 * @param {string} assessment_id - Assessment ID for context
 * @returns {Promise<Object>} Response containing message and conversationId
 */
export async function sendMessageWithAssessment(request, token, message, assessment_id) {
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
    throw new Error(`Failed to parse send message with assessment response: ${error.message}`);
  }

  if (response.status() !== 200) {
    throw new Error(`Failed to send message with assessment: ${response.status()}`);
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
    throw new Error(`Failed to get conversation details: ${response.status()}`);
  }

  const conversation = await response.json();
  return conversation.assessment_id === expectedAssessmentId;
} 