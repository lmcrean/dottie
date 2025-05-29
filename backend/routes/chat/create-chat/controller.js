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
    
    // Ensure IDs are strings
    const userIdString = String(userId);
    const assessmentIdString = assessment_id ? String(assessment_id) : null;
    
    logger.info(`[createChat] Creating new chat for user: ${userIdString}`, { 
      assessment_id: assessmentIdString, 
      initial_message: !!initial_message 
    });

    if (!userIdString) {
      logger.error('[createChat] User ID is missing in the request');
      return res.status(400).json({ error: 'User identification is required' });
    }

    // Create new conversation with assessment linking
    const conversationId = await createConversation(userIdString, assessmentIdString);
    
    // Ensure conversationId is a string
    const conversationIdString = String(conversationId);
    
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

    return res.status(201).json(chatResponse);
  } catch (error) {
    logger.error('[createChat] Error creating chat:', error);
    return res.status(500).json({ 
      error: 'Failed to create chat', 
      details: error.message 
    });
  }
}; 