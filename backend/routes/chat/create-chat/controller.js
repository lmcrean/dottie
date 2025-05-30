import logger from '../../../services/logger.js';
import { createConversation } from '../../../models/chat/index.js';

/**
 * Create a new chat conversation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createChat = async (req, res) => {
  try {
    const { assessment_id, initial_message } = req.body;
    // Get userId from req.user, supporting both id and userId fields
    const userId = req.user.userId || req.user.id;
    
    // Log request received
    console.log(`[createChat] Request received with raw data:`, {
      userId: userId,
      assessment_id: req.body.assessment_id,
      initial_message: !!req.body.initial_message
    });
    
    // Ensure IDs are strings
    const userIdString = String(userId);
    const assessmentIdString = assessment_id ? String(assessment_id) : null;
    
    // Log after type conversion
    console.log(`[createChat] Converted data:`, {
      userIdString: userIdString,
      userIdStringType: typeof userIdString,
      assessmentIdString: assessmentIdString,
      assessmentIdStringType: assessmentIdString ? typeof assessmentIdString : 'null'
    });
    
    logger.info(`[createChat] Creating new chat for user: ${userIdString}`, { 
      assessment_id: assessmentIdString, 
      initial_message: !!initial_message 
    });

    if (!userIdString) {
      logger.error('[createChat] User ID is missing in the request');
      return res.status(400).json({ error: 'User identification is required' });
    }

    // Log before createConversation call
    console.log(`[createChat] Calling createConversation with:`, {
      userIdString,
      assessmentIdString
    });

    // Create new conversation with assessment linking
    const conversationId = await createConversation(userIdString, assessmentIdString);
    
    // Ensure conversationId is a string
    const conversationIdString = String(conversationId);
    
    // Log after conversation creation
    console.log(`[createChat] Conversation created with ID: ${conversationIdString}, type: ${typeof conversationIdString}`);
    
    logger.info(`[createChat] Successfully created chat: ${conversationIdString}`, { assessment_id: assessmentIdString });

    // Return the chat object that frontend expects
    const chatResponse = {
      id: conversationIdString,
      user_id: userIdString,
      created_at: new Date().toISOString(),
      assessment_context: assessmentIdString ? {
        assessment_id: assessmentIdString,
        initial_message
      } : undefined
    };

    // Log response payload
    console.log(`[createChat] Sending response:`, chatResponse);

    return res.status(201).json(chatResponse);
  } catch (error) {
    logger.error('[createChat] Error creating chat:', error);
    return res.status(500).json({ 
      error: 'Failed to create chat', 
      details: error.message 
    });
  }
}; 