import logger from '../../../services/logger.js';
import { getConversation as getConversationModel } from '../../../models/chat/chat.js';

/**
 * Get a specific conversation and its messages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getConversation = async (req, res) => {
  try {
    // Get userId from req.user, supporting both id and userId fields
    const userId = req.user.userId || req.user.id;
    const { conversationId } = req.params;
    
    // Log the user ID for debugging
    logger.info(`Getting conversation ${conversationId} for user: ${userId}`);

    if (!userId) {
      logger.error('User ID is missing in the request');
      return res.status(400).json({ error: 'User identification is required' });
    }
    
    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID is required' });
    }
    
    // Get the conversation and verify ownership
    const conversation = await getConversationModel(conversationId, userId);
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Return the conversation data
    return res.status(200).json(conversation);
  } catch (error) {
    logger.error('Error in getConversation controller:', error);
    return res.status(500).json({ error: 'Failed to retrieve conversation' });
  }
}; 