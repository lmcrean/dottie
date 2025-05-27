import DbService from '../../../../services/db-service/dbService.js';
import logger from '../../../../services/logger.js';

/**
 * Update an existing conversation with an assessment ID and its pattern.
 * Verifies user ownership before updating.
 * @param {string} conversationId - The ID of the conversation to update.
 * @param {string} userId - The ID of the user. Must own the conversation.
 * @param {string} assessmentId - The ID of the assessment to link.
 * @returns {Promise<boolean>} - True if successful, false otherwise.
 */
export const updateConversationAssessmentLinks = async (conversationId, userId, assessmentId) => {
  try {
    // Validate input
    if (!conversationId || !userId || !assessmentId) {
      logger.warn('[updateConversationAssessmentLinks] Missing required parameters.');
      return false;
    }

    // Verify conversation ownership
    const conversation = await DbService.findById('conversations', conversationId);
    if (!conversation) {
      logger.warn(`[updateConversationAssessmentLinks] Conversation ${conversationId} not found.`);
      return false;
    }
    if (conversation.user_id !== userId) {
      logger.warn(`[updateConversationAssessmentLinks] User ${userId} does not own conversation ${conversationId}.`);
      return false; // Or throw an error
    }

    // Fetch assessment pattern
    let assessmentPattern = null;
    try {
      const assessment = await DbService.findById('assessments', assessmentId);
      if (assessment && assessment.pattern) {
        assessmentPattern = assessment.pattern;
      } else {
        logger.warn(`[updateConversationAssessmentLinks] Assessment ${assessmentId} not found or has no pattern.`);
      }
    } catch (error) {
      logger.error(`[updateConversationAssessmentLinks] Error fetching assessment ${assessmentId}:`, error);
      // Continue without pattern if assessment fetch fails, or handle as critical error
    }

    // Prepare update data
    const updateData = {
      assessment_id: assessmentId,
      updated_at: new Date().toISOString()
    };
    if (assessmentPattern) {
      updateData.assessment_pattern = assessmentPattern;
    }

    // Update the conversation
    const success = await DbService.update('conversations', conversationId, updateData);
    
    if (success) {
      logger.info(`[updateConversationAssessmentLinks] Conversation ${conversationId} updated with assessment ${assessmentId}.`);
    } else {
      logger.error(`[updateConversationAssessmentLinks] Failed to update conversation ${conversationId}.`);
    }
    return success;

  } catch (error) {
    logger.error(`[updateConversationAssessmentLinks] Error updating conversation ${conversationId} with assessment ${assessmentId}:`, error);
    throw error; // Or return false
  }
}; 