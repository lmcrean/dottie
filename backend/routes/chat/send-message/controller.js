import logger from '../../../services/logger.js';
import { sendMessageFlow } from '../../../models/chat/message/send-message-flow/sendMessageFlow.js';

/**
 * Send a message to the AI and get a response
 * Clean controller that delegates to model layer
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const sendMessage = async (req, res) => {
  try {    
    const { message, conversationId, assessment_id } = req.body;
    const userId = req.user.userId || req.user.id;
    
    logger.info(`Processing message for user: ${userId}`, { conversationId, assessment_id });

    // Validate required parameters
    if (!userId) {
      logger.error('User ID is missing in the request');
      return res.status(400).json({ error: 'User identification is required' });
    }

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Delegate to model layer for the complete workflow
    const result = await sendMessageFlow(userId, message, conversationId, assessment_id);
    
    if (!result.success) {
      return res.status(400).json({ error: 'Failed to process message' });
    }

    // Return clean response
    return res.status(200).json({
      message: result.assistantMessage.content,
      conversationId: result.conversationId,
    });
    
  } catch (error) {
    logger.error('Error in sendMessage controller:', error);
    
    // Handle specific error types
    if (error.message.includes('Conversation not found')) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    
    return res.status(500).json({ 
      error: 'Failed to process message', 
      details: error.message 
    });
  }
};