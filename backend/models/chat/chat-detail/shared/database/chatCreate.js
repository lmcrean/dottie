import { v4 as uuidv4 } from 'uuid';
import DbService from '../../../../../services/dbService.js';
import logger from '../../../../../services/logger.js';
import { getAssessmentPattern } from '../create-conversation/assessment/assessmentGetPattern.js';

/**
 * Create a new conversation in the database
 * @param {string} userId - User ID who owns this conversation
 * @param {string} [assessmentId] - Optional assessment ID to link to this conversation
 * @param {string} [assessmentPattern] - Optional assessment pattern (if not provided, will be fetched from assessmentId)
 * @returns {Promise<string>} - Conversation ID
 */
export const createConversation = async (userId, assessmentId = null, assessmentPattern = null) => {
  try {
    const conversationId = uuidv4();
    const now = new Date().toISOString();
    
    // If we have assessmentId but no pattern, fetch the pattern
    if (assessmentId && !assessmentPattern) {
      assessmentPattern = await getAssessmentPattern(assessmentId);
    }
    
    await DbService.create('conversations', {
      id: conversationId,
      user_id: userId,
      assessment_id: assessmentId,
      assessment_pattern: assessmentPattern,
      created_at: now,
      updated_at: now
    });
    
    logger.info(`Created conversation ${conversationId} with assessment ${assessmentId} and pattern: ${assessmentPattern}`);
    return conversationId;
  } catch (error) {
    logger.error('Error creating conversation:', error);
    throw error;
  }
}; 