import logger from '../../../services/logger.js';
import { getUserConversations } from '../../../models/chat/chat.js';

/**
 * Get all conversations for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getHistory = async (req, res) => {
  try {
    const userId = req.user.userId;
    
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