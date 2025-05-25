import logger from '../../../../../services/logger.js';
import { autoGenerateResponse } from '../../chatbot-message/generateResponse.js';

/**
 * Trigger response generation for existing conversation
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<Object>} - Generated response
 */
export const triggerResponse = async (conversationId) => {
  try {
    logger.info(`Triggering response generation for conversation ${conversationId}`);
    
    const response = await autoGenerateResponse(conversationId);
    
    logger.info(`Response generation completed for conversation ${conversationId}`);
    return response;

  } catch (error) {
    logger.error('Error triggering response generation:', error);
    throw error;
  }
}; 