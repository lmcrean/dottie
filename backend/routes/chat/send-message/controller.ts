import { Response } from 'express';
import logger from '../../../services/logger.js';
import { sendMessageFlow } from '../../../models/chat/message/send-message-flow/sendMessageFlow.js';
import { AuthenticatedRequest } from '../../types.js';

interface SendMessageBody {
  message: string;
  conversationId?: string | number;
  assessment_id?: string | number;
}

/**
 * Send a message to the AI and get a response
 * Clean controller that delegates to model layer
 */
export const sendMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { message, conversationId, assessment_id } = req.body as SendMessageBody;
    const userId = req.user?.id;

    logger.info(`Processing message for user: ${userId}`, { conversationId, assessment_id });

    // Validate required parameters
    if (!userId) {
      logger.error('User ID is missing in the request');
      res.status(400).json({ error: 'User identification is required' });
      return;
    }

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    // Delegate to model layer for the complete workflow
    const result = await sendMessageFlow(userId, message, conversationId, assessment_id);

    if (!result.success) {
      res.status(400).json({ error: 'Failed to process message' });
      return;
    }

    // Return clean response
    res.status(200).json({
      message: result.assistantMessage.content,
      conversationId: result.conversationId,
    });

  } catch (error: any) {
    logger.error('Error in sendMessage controller:', error);

    // Handle specific error types
    if (error.message.includes('Conversation not found')) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    res.status(500).json({
      error: 'Failed to process message',
      details: error.message
    });
  }
};
