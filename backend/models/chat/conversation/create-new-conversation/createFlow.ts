import logger from '../../../../services/logger.js';
import { createConversation } from './database/conversationCreate.js';
import type { CreateConversationResponse } from '../../types.js';

/**
 * Create conversation with assessment
 * @param userId - User ID
 * @param assessmentId - Assessment ID (stored as FK)
 * @returns Created conversation
 */
export const createAssessmentConversation = async (
  userId: number | string,
  assessmentId: number | string | null
): Promise<CreateConversationResponse> => {
  try {
    // Log received IDs
    console.log(`[createAssessmentConversation] Received IDs:`, {
      userId,
      userIdType: typeof userId,
      assessmentId,
      assessmentIdType: assessmentId ? typeof assessmentId : 'null'
    });

    // Validate required parameters first (before conversion)
    if (!userId || userId === null || userId === undefined) {
      throw new Error('User ID is required and cannot be empty');
    }

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
      success: true,
      conversationId: conversationIdString,
      assessmentId: assessmentIdString,
      conversation: {
        id: conversationIdString,
        user_id: userIdString,
        assessment_id: assessmentIdString,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    };

  } catch (error) {
    logger.error('Error creating assessment conversation:', error);
    throw error;
  }
};
