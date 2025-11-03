import { Response } from 'express';
import logger from '../../../services/logger.js';
import { sendMessageFlow } from '../../../models/chat/message/send-message-flow/sendMessageFlow.js';
import { AuthenticatedRequest } from '../../types.js';

interface SendInitialMessageBody {
  message: string;
  assessment_id?: string | number;
}

/**
 * Send an initial message to a conversation
 * Path: POST /api/chat/:chatId/message/initial
 */
export const sendInitialMessage = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { message, assessment_id } = req.body as SendInitialMessageBody;
    const conversationId = req.params.chatId;
    const userId = req.user?.id;

    logger.info(`Processing initial message for user: ${userId}`, { conversationId, assessment_id });

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

    if (!conversationId) {
      res.status(400).json({ error: 'Conversation ID is required' });
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
      userMessage: {
        id: result.userMessage.id,
        content: message,
        role: 'user',
        created_at: result.userMessage.created_at
      },
      assistantMessage: {
        id: result.assistantMessage.id,
        content: result.assistantMessage.content,
        role: 'assistant',
        created_at: result.assistantMessage.created_at
      }
    });

  } catch (error: any) {
    logger.error('Error in sendInitialMessage controller:', error);

    // Handle specific error types
    if (error.message.includes('Conversation not found')) {
      res.status(404).json({ error: 'Conversation not found' });
      return;
    }

    res.status(500).json({
      error: 'Failed to process initial message',
      details: error.message
    });
  }
};
