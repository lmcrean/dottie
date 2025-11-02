import { Response } from 'express';
import logger from '../../../services/logger.js';
import { deleteConversation as deleteConversationModel } from '../../../models/chat/index.js';
import { AuthenticatedRequest } from '../../types.js';

/**
 * Delete a conversation and all its messages
 */
export const deleteConversation = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Get userId from req.user
    const userId = req.user?.id;
    const { conversationId } = req.params;

    // Log the user ID for debugging
    logger.info(`Deleting conversation ${conversationId} for user: ${userId}`);

    if (!userId) {
      logger.error('User ID is missing in the request');
      res.status(400).json({ error: 'User identification is required' });
      return;
    }

    if (!conversationId) {
      res.status(400).json({ error: 'Conversation ID is required' });
      return;
    }

    // Delete the conversation and verify ownership
    const success = await deleteConversationModel(conversationId, userId);

    if (!success) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    // Return success response
    res.status(200).json({
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    logger.error('Error in deleteConversation controller:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
};
