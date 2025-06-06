import logger from '../../../services/logger.js';
import { getUserConversations } from '../../../models/chat/index.js';

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
    logger.info(`[getHistory] Getting conversation history for user: ${userId}`);
    console.log(`[getHistory] req.user object:`, JSON.stringify(req.user, null, 2));
    console.log(`[getHistory] userId extracted: ${userId}, type: ${typeof userId}`);

    if (!userId) {
      logger.error('[getHistory] User ID is missing in the request');
      console.error('[getHistory] req.user:', req.user);
      return res.status(400).json({ error: 'User identification is required' });
    }
    
    // Get all conversations for this user
    console.log(`[getHistory] Calling getUserConversations with userId: ${userId}`);
    const conversations = await getUserConversations(userId);
    
    console.log(`[getHistory] getUserConversations returned:`, JSON.stringify(conversations, null, 2));
    
    // Return the conversations
    return res.status(200).json({
      conversations
    });
  } catch (error) {
    logger.error('[getHistory] Error in getHistory controller:', error);
    console.error('[getHistory] Detailed error info:', {
      message: error.message,
      stack: error.stack,
      userId: req.user?.userId || req.user?.id,
      userObject: req.user
    });
    return res.status(500).json({ error: 'Failed to retrieve chat history' });
  }
}; 