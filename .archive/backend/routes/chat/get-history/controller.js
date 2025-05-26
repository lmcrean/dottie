import logger from '../../../services/logger.js';
import { getUserConversations } from '../../../models/chat/chat.js';

/**
 * Get all conversations for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getHistory = async (req, res) => {
  try {
    // Get userId from req.user, supporting both id and userId fields
    const userId = req.user.userId || req.user.id;
    
    // Log the user ID for debugging
    logger.info(`Getting conversation history for user: ${userId}`);

    if (!userId) {
      logger.error('User ID is missing in the request');
      return res.status(400).json({ error: 'User identification is required' });
    }
    
    // Get all conversations for this user
    const conversations = await getUserConversations(userId);
    
    // Return the conversations
    return res.status(200).json({
      conversations
    });
  } catch (error) {
    logger.error('Error in getHistory controller:', error);
    return res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
}; 