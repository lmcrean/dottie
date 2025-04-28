import logger from '../../../services/logger.js';
import { getConversation as getConversationModel } from '../../../models/chat/chat.js';

/**
 * Get a specific conversation and its messages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getConversation = async (req, res) => {
  try {
    const userId = req.user.userId
    const { conversationId } = req.params;
    
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