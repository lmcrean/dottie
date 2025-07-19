/**
 * Validates assessment_id was properly linked to conversation
 * Tests database relationship integrity between conversations and assessments
 */

/**
 * Validate that conversation has the correct assessment_id linked
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} conversationId - Conversation ID to verify
 * @param {string} expectedAssessmentId - Expected assessment ID
 * @returns {Promise<Object>} Validation result with success status and details
 */
export async function validateAssessmentIdWasLinked(request, token, conversationId, expectedAssessmentId) {
  try {
    const response = await request.get(`/api/chat/history/${conversationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (response.status() !== 200) {
      const responseText = await response.text();
      throw new Error(`Failed to get conversation details: ${response.status()}. Response: ${responseText}`);
    }

    const conversation = await response.json();
    
    // Check if assessment_id exists and matches expected value
    const hasAssessmentId = !!conversation.assessment_id;
    const assessmentIdMatches = conversation.assessment_id === expectedAssessmentId;
    
    if (!hasAssessmentId) {
      console.error(`❌ Conversation ${conversationId} has no assessment_id linked`);
      return {
        success: false,
        error: 'No assessment_id found in conversation',
        conversation_id: conversationId,
        expected_assessment_id: expectedAssessmentId,
        actual_assessment_id: null
      };
    }

    if (!assessmentIdMatches) {
      console.error(`❌ Assessment ID mismatch. Expected: ${expectedAssessmentId}, Got: ${conversation.assessment_id}`);
      return {
        success: false,
        error: 'Assessment ID mismatch',
        conversation_id: conversationId,
        expected_assessment_id: expectedAssessmentId,
        actual_assessment_id: conversation.assessment_id
      };
    }

    console.log(`✓ Assessment ID correctly linked: ${conversation.assessment_id}`);
    return {
      success: true,
      conversation_id: conversationId,
      assessment_id: conversation.assessment_id,
      validation_passed: true
    };

  } catch (error) {
    console.error("❌ Failed to validate assessment ID linking:", error.message);
    return {
      success: false,
      error: error.message,
      conversation_id: conversationId,
      expected_assessment_id: expectedAssessmentId
    };
  }
}

/**
 * Quick check if conversation has any assessment_id (not checking specific value)
 * @param {Object} request - Playwright request object
 * @param {string} token - Authentication token
 * @param {string} conversationId - Conversation ID to check
 * @returns {Promise<boolean>} True if conversation has an assessment_id
 */
export async function hasAssessmentIdLinked(request, token, conversationId) {
  try {
    const result = await validateAssessmentIdWasLinked(request, token, conversationId, null);
    return result.success && !!result.assessment_id;
  } catch (error) {
    console.error("Failed to check assessment ID linking:", error.message);
    return false;
  }
} 