import logger from '../../../services/logger.js';
import { deleteConversation as deleteConversationModel } from '../../../models/chat/chat.js';

/**
 * Delete a conversation and all its messages
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteConversation = async (req, res) => {
  try {
    const userId = req.user.id;
    const { conversationId } = req.params;
    
    if (!conversationId) {
      return res.status(400).json({ error: 'Conversation ID is required' });
    }
    
    // Delete the conversation and verify ownership
    const success = await deleteConversationModel(conversationId, userId);
    
    if (!success) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    // Return success response
    return res.status(200).json({
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    logger.error('Error in deleteConversation controller:', error);
    return res.status(500).json({ error: 'Failed to delete conversation' });
  }
}; 