import logger from '../../../../../../services/logger.js';
import { ChatDatabaseOperations } from '../../shared/database/chatOperations.js';
import { generateMessageId } from '../shared/utils/responseBuilders.js';

/**
 * Create and send the initial message for a new conversation
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @returns {Promise<Object>} - Initial message data
 */
export async function createInitialMessage(conversationId, userId) {
  try {
    // Generate automated initial message content
    const messageText = "Hi, could you look at my assessment results and provide some guidance? I'd like to understand what my results mean and get recommendations for my menstrual health.";
    
    // Create the initial user message
    const userMessageId = generateMessageId();
    const userMessage = {
      id: userMessageId,
      role: 'user',
      content: messageText,
      user_id: userId,
      created_at: new Date().toISOString()
    };
    
    // Insert user message into database
    await ChatDatabaseOperations.insertMessage(conversationId, userMessage);

    logger.info(`Initial message created for conversation ${conversationId}`);
    
    return {
      id: userMessageId,
      role: 'user',
      content: messageText,
      created_at: userMessage.created_at
    };

  } catch (error) {
    logger.error('Error creating initial message:', error);
    throw error;
  }
} 