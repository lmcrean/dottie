import logger from '../../../../services/logger.js';
import { insertChatMessage } from '../shared/database/chatCreateMessage.js';
import { formatUserMessage } from '../shared/utils/messageFormatters.js';
import { generateMessageId } from '../shared/utils/responseBuilders.js';
import { detectService } from '../services/serviceDetector.js';
import { generateInitialResponse as generateInitialAI } from '../services/ai/generators/initialAI.js';
import { generateInitialResponse as generateInitialMock } from '../services/mock/generators/initialMock.js';

/**
 * Create and send the initial message for a new conversation
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @param {string} messageText - Initial message text
 * @param {string} [assessmentPattern] - Assessment pattern for context
 * @returns {Promise<Object>} - Initial message and response
 */
export const createInitialMessage = async (conversationId, userId, messageText, assessmentPattern = null) => {
  try {
    // Create the initial user message
    const userMessageId = generateMessageId();
    const userMessage = formatUserMessage(messageText, userId);
    
    // Insert user message into database
    await insertChatMessage(conversationId, {
      id: userMessageId,
      role: 'user',
      content: messageText,
      user_id: userId,
      created_at: new Date().toISOString()
    });

    // Generate AI/mock response
    const response = await generateInitialResponse(conversationId, messageText, assessmentPattern);
    
    // Insert AI response into database
    const assistantMessageId = generateMessageId();
    await insertChatMessage(conversationId, {
      id: assistantMessageId,
      role: 'assistant',
      content: response.content,
      created_at: new Date().toISOString()
    });

    logger.info(`Initial message and response created for conversation ${conversationId}`);
    
    return {
      userMessage: {
        id: userMessageId,
        role: 'user',
        content: messageText,
        created_at: new Date().toISOString()
      },
      assistantMessage: {
        id: assistantMessageId,
        role: 'assistant',
        content: response.content,
        created_at: new Date().toISOString()
      }
    };

  } catch (error) {
    logger.error('Error creating initial message:', error);
    throw error;
  }
};

/**
 * Generate initial response (AI or mock based on service detection)
 * @param {string} conversationId - Conversation ID
 * @param {string} messageText - User message text
 * @param {string} [assessmentPattern] - Assessment pattern
 * @returns {Promise<Object>} - Generated response
 */
export const generateInitialResponse = async (conversationId, messageText, assessmentPattern = null) => {
  try {
    const serviceType = await detectService();
    
    if (serviceType === 'ai') {
      return await generateInitialAI(messageText, assessmentPattern);
    } else {
      return await generateInitialMock(messageText, assessmentPattern);
    }
  } catch (error) {
    logger.error('Error generating initial response:', error);
    // Fallback to mock if AI fails
    return await generateInitialMock(messageText, assessmentPattern);
  }
};

/**
 * Auto-trigger initial conversation with default message
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID
 * @param {string} [assessmentPattern] - Assessment pattern
 * @returns {Promise<Object>} - Initial conversation state
 */
export const autoTriggerInitialConversation = async (conversationId, userId, assessmentPattern = null) => {
  const defaultMessage = assessmentPattern 
    ? `Hi! I'd like to discuss my ${assessmentPattern} assessment results.`
    : "Hi! I'd like to start a conversation.";
    
  return await createInitialMessage(conversationId, userId, defaultMessage, assessmentPattern);
}; 