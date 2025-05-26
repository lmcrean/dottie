import DbService from '../../../../../services/dbService.js';
import logger from '../../../../../services/logger.js';

/**
 * Update a conversation's assessment links
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID to verify ownership
 * @param {string} [assessmentId] - Assessment ID to link
 * @param {string} [assessmentPattern] - Assessment pattern
 * @returns {Promise<boolean>} - Success indicator
 */
export const updateConversationAssessmentLinks = async (conversationId, userId, assessmentId = null, assessmentPattern = null) => {
  try {
    // First verify the conversation belongs to the user
    const conversation = await DbService.findBy('conversations', 'id', conversationId);
    
    if (!conversation || conversation.length === 0 || conversation[0].user_id !== userId) {
      logger.warn(`User ${userId} not authorized to update conversation ${conversationId}`);
      return false;
    }
    
    // Update the assessment links
    await DbService.update('conversations', conversationId, {
      assessment_id: assessmentId,
      assessment_pattern: assessmentPattern,
      updated_at: new Date().toISOString()
    });
    
    logger.info(`Updated assessment links for conversation ${conversationId}`);
    return true;
  } catch (error) {
    logger.error('Error updating conversation assessment links:', error);
    throw error;
  }
}; 