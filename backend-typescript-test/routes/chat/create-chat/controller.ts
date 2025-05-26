import logger from '../../../services/logger.ts';
import { createConversation } from '../../../models/chat/chat.ts';

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
    
    logger.info(`[createChat] Creating new chat for user: ${userId}`, { assessment_id, initial_message: !!initial_message });

    if (!userId) {
      logger.error('[createChat] User ID is missing in the request');
      return res.status(400).json({ error: 'User identification is required' });
    }

    // Create new conversation with assessment linking
    const conversationId = await createConversation(userId, assessment_id);
    
    logger.info(`[createChat] Successfully created chat: ${conversationId}`, { assessment_id });

    // Return the chat object that frontend expects
    const chatResponse = {
      id: conversationId,
      user_id: userId,
      created_at: new Date().toISOString(),
      assessment_context: assessment_id ? {
        assessment_id,
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
