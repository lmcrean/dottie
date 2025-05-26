import { v4 as uuidv4 } from 'uuid';
// TODO: Fix empty import
// TODO: Fix empty import

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
      
      // Get assessment pattern if assessment exists
      try {
        const assessment = await DbService.findById('assessments', assessmentId);
        if (assessment && assessment.pattern) {
          conversationData.assessment_pattern = assessment.pattern;
        }
      } catch (error) {
        logger.warn(`Could not fetch assessment pattern for ${assessmentId}:`, error);
      }
    }

    // Create the conversation
    await DbService.create('conversations', conversationData);
    
    logger.info(`Created conversation ${conversationId} for user ${userId}`);
    
    return conversationId;
  } catch (error) {
    logger.error('Error creating conversation:', error);
    throw error;
  }
}; 
