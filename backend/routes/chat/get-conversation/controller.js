import logger from '../../../services/logger.js';
import { getConversationForUser } from '../../../models/chat/index.js';

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
    const result = await getConversationForUser(conversationId, userId);
    
    if (!result.success) {
      return res.status(404).json({ error: result.error || 'Conversation not found' });
    }
    
    // Return the conversation data in the format expected by the frontend
    return res.status(200).json({
      id: result.conversation.id,
      user_id: result.conversation.user_id,
      assessment_id: result.conversation.assessment_id,
      assessment_object: result.conversation.assessment_object,
      assessment_pattern: result.conversation.assessment_pattern,
      title: result.conversation.title,
      created_at: result.conversation.created_at,
      updated_at: result.conversation.updated_at,
      messages: result.messages
    });
  } catch (error) {
    logger.error('Error in getConversation controller:', error);
    return res.status(500).json({ error: 'Failed to retrieve conversation' });
  }
}; 