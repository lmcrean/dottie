import logger from '../../../../services/logger.js';
import { createConversation } from './database/conversationCreate.js';

/**
 * Create conversation with assessment
 * @param {string} userId - User ID
 * @param {string} assessmentId - Assessment ID (stored as FK)
 * @returns {Promise<Object>} - Created conversation
 */
export const createAssessmentConversation = async (userId, assessmentId) => {
  try {
    // Log received IDs
    console.log(`[createAssessmentConversation] Received IDs:`, {
      userId,
      userIdType: typeof userId,
      assessmentId,
      assessmentIdType: assessmentId ? typeof assessmentId : 'null'
    });

    // Ensure IDs are strings
    const userIdString = String(userId);
    const assessmentIdString = assessmentId ? String(assessmentId) : null;
    
    // Log after type conversion
    console.log(`[createAssessmentConversation] Converted IDs:`, {
      userIdString,
      userIdStringType: typeof userIdString,
      assessmentIdString,
      assessmentIdStringType: assessmentIdString ? typeof assessmentIdString : 'null'
    });
    
    logger.info(`Creating conversation for user ${userIdString} with assessment ${assessmentIdString}`);

    // Create conversation with assessment FK
    const conversationId = await createConversation(userIdString, assessmentIdString);
    
    // Ensure conversationId is a string
    const conversationIdString = String(conversationId);

    logger.info(`Conversation ${conversationIdString} created successfully`);

    return {
      conversationId: conversationIdString,
      assessmentId: assessmentIdString,
      created_at: new Date().toISOString()
    };

  } catch (error) {
    logger.error('Error creating assessment conversation:', error);
    throw error;
  }
}; 