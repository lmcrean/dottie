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
    // Log conversation function entry
    console.log(`[createConversation] Received IDs:`, {
      userId,
      userIdType: typeof userId,
      assessmentId,
      assessmentIdType: assessmentId ? typeof assessmentId : 'null'
    });

    // Ensure userId is a string
    const userIdString = String(userId);
    
    // Validate required parameters
    if (!userIdString || userIdString.trim() === '') {
      throw new Error('User ID is required and cannot be empty');
    }
    
    // Generate a UUID and ensure it's a string
    const conversationId = String(uuidv4());
    
    // Log after UUID generation
    console.log(`[createConversation] Generated conversation ID: ${conversationId}, type: ${typeof conversationId}`);
    
    const conversationData = {
      id: conversationId,
      user_id: userIdString,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Log conversation data object
    console.log(`[createConversation] Conversation data object:`, conversationData);

    // Add assessment fields if provided
    if (assessmentId) {
      // Ensure assessmentId is a string
      const assessmentIdString = String(assessmentId);
      conversationData.assessment_id = assessmentIdString;
      
      // Fetch the full assessment object
      try {
        const assessmentObject = await fetchAssessmentObject(assessmentIdString);
        
        if (assessmentObject) {
          // Ensure the assessment object is properly serialized as JSON string
          // This fixes the "[object Object]" issue in production
          if (typeof assessmentObject === 'object') {
            try {
              // For Supabase/PostgreSQL, we can use raw JSON objects with jsonb type
              // For SQLite, we need to serialize to string
              // Check database type to determine approach
              const dbType = process.env.DB_TYPE || 'sqlite';
              
              if (dbType.toLowerCase() === 'supabase') {
                // For Supabase, use the object directly (PostgreSQL handles JSON objects)
                conversationData.assessment_object = assessmentObject;
              } else {
                // For SQLite and others, stringify the object
                conversationData.assessment_object = JSON.stringify(assessmentObject);
              }
              
              logger.info('Successfully serialized assessment object');
            } catch (serializeError) {
              logger.error('Error serializing assessment object:', serializeError);
              // Fallback to basic string serialization
              conversationData.assessment_object = JSON.stringify(assessmentObject);
            }
          } else {
            logger.warn('Assessment object is not an object, skipping serialization');
          }
          
          // Extract and store pattern at root level for easy access
          const pattern = extractAssessmentPattern(assessmentObject);
          if (pattern) {
            conversationData.assessment_pattern = pattern;
          }
          
          logger.info(`Linked assessment ${assessmentIdString} to conversation`, {
            pattern,
            hasAssessmentObject: true
          });
        }
      } catch (error) {
        logger.warn(`Could not fetch assessment data for ${assessmentId}:`, error);
        // Continue with conversation creation even if assessment fetch fails
      }
    }

    // Log before database insert
    console.log(`[createConversation] Inserting conversation with ID: ${conversationId}, type: ${typeof conversationId}`);

    // Create the conversation
    await DbService.create('conversations', conversationData);
    
    logger.info(`Created conversation ${conversationId} for user ${userIdString}`, {
      hasAssessment: !!assessmentId,
      assessmentPattern: conversationData.assessment_pattern || null
    });
    
    // Log return value
    console.log(`[createConversation] Returning conversation ID: ${conversationId}, type: ${typeof conversationId}`);
    
    // Double-check that we're returning a string
    return String(conversationId);
  } catch (error) {
    logger.error('Error creating conversation:', error);
    throw error;
  }
}; 