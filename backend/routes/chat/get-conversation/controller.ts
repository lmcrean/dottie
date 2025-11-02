import { Response } from 'express';
import logger from '../../../services/logger.js';
import { getConversationForUser } from '../../../models/chat/index.js';
import { AuthenticatedRequest } from '../../types.js';

/**
 * Get a specific conversation and its messages
 */
export const getConversation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Get userId from req.user
    const userId = req.user?.id;
    const { conversationId } = req.params;

    // Log the user ID for debugging
    logger.info(`Getting conversation ${conversationId} for user: ${userId}`);

    if (!userId) {
      logger.error('User ID is missing in the request');
      res.status(400).json({ error: 'User identification is required' });
      return;
    }

    if (!conversationId) {
      res.status(400).json({ error: 'Conversation ID is required' });
      return;
    }

    // Get the conversation and verify ownership
    const result = await getConversationForUser(conversationId, userId);

    if (!result.success) {
      res.status(404).json({ error: result.error || 'Conversation not found' });
      return;
    }

    // Return the conversation data in the format expected by the frontend
    res.status(200).json({
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
    res.status(500).json({ error: 'Failed to retrieve conversation' });
  }
};
