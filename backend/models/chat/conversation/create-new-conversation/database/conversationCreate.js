import { v4 as uuidv4 } from 'uuid';
import DbService from '../../../../../services/db-service/dbService.js';
import logger from '../../../../../services/logger.js';
import { fetchAssessmentObject, extractAssessmentPattern } from './assessmentObjectLink.js';

/**
 * Create a new conversation in the database
 * @param {string} userId - User ID
 * @param {string} [assessmentId] - Optional assessment ID to link
 * @returns {Promise<string>} - Created conversation ID
 */
export const createConversation = async (userId, assessmentId = null) => {
  try {
    // Validate required parameters
    if (!userId || userId.trim() === '') {
      throw new Error('User ID is required and cannot be empty');
    }
    
    const conversationId = uuidv4();
    
    const conversationData = {
      id: conversationId,
      user_id: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add assessment fields if provided
    if (assessmentId) {
      conversationData.assessment_id = assessmentId;
      
      // Fetch the full assessment object
      try {
        const assessmentObject = await fetchAssessmentObject(assessmentId);
        
        if (assessmentObject) {
          // Store the entire assessment object
          conversationData.assessment_object = assessmentObject;
          
          // Extract and store pattern at root level for easy access
          const pattern = extractAssessmentPattern(assessmentObject);
          if (pattern) {
            conversationData.assessment_pattern = pattern;
          }
          
          logger.info(`Linked assessment ${assessmentId} to conversation`, {
            pattern,
            hasAssessmentObject: true
          });
        }
      } catch (error) {
        logger.warn(`Could not fetch assessment data for ${assessmentId}:`, error);
        // Continue with conversation creation even if assessment fetch fails
      }
    }

    // Create the conversation
    await DbService.create('conversations', conversationData);
    
    logger.info(`Created conversation ${conversationId} for user ${userId}`, {
      hasAssessment: !!assessmentId,
      assessmentPattern: conversationData.assessment_pattern || null
    });
    
    return conversationId;
  } catch (error) {
    logger.error('Error creating conversation:', error);
    throw error;
  }
}; 