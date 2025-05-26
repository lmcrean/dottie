import logger from '../../../../../services/logger.js';
import { ConfigHelper } from './utils/configHelper.js';
import { ChatDatabaseOperations } from '../../shared/database/chatOperations.js';
import { generateMessageId } from '../shared/utils/responseBuilders.js';
import { generateInitialResponse as generateInitialAI } from './services/ai/generators/initialAI.js';
import { generateInitialResponse as generateInitialMock } from './services/mock/generators/initialMock.js';

/**
 * Create and send the initial message for a new conversation
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @param {string} messageText - Initial message text
 * @param {Object} assessmentData - Full assessment data (required)
 * @returns {Promise<Object>} - Initial message and response
 */
export async function createInitialMessage(conversationId, userId, messageText, assessmentData) {
  if (!assessmentData || typeof assessmentData !== 'object') {
    throw new Error('Assessment data is required - system error if missing');
  }
  try {
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

    // Determine service type and generate response
    const serviceType = ConfigHelper.detectService();
    const response = serviceType === 'ai'
      ? await generateInitialAI(messageText, assessmentData)
      : await generateInitialMock(messageText, assessmentData);
    
    // Insert AI response into database
    const assistantMessageId = generateMessageId();
    const assistantMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: response.content,
      created_at: new Date().toISOString()
    };

    await ChatDatabaseOperations.insertMessage(conversationId, assistantMessage);

    logger.info(`Initial message and response created for conversation ${conversationId}`);
    
    return {
      userMessage: {
        id: userMessageId,
        role: 'user',
        content: messageText,
        created_at: userMessage.created_at
      },
      assistantMessage: {
        id: assistantMessageId,
        role: 'assistant',
        content: response.content,
        created_at: assistantMessage.created_at
      }
    };

  } catch (error) {
    logger.error('Error creating initial message:', error);
    throw error;
  }
} 