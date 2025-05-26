import logger from '../../../../services/logger.js';
import { insertChatMessage } from '../shared/database/chatCreateMessage.js';
import { formatAssistantMessage } from '../shared/utils/messageFormatters.js';
import { generateMessageId } from '../shared/utils/responseBuilders.js';
import { detectService } from './services/serviceDetector.js';
import { generateFollowUpResponse as generateFollowUpAI } from './services/ai/generators/followUpAI.js';
import { generateFollowUpResponse as generateFollowUpMock } from './services/mock/generators/followUpMock.js';
import { getConversationHistory } from '../read-chat-detail/getConversation.js';

/**
 * Generate response to a user message in an ongoing conversation
 * @param {string} conversationId - Conversation ID
 * @param {string} userMessageId - User message ID to respond to
 * @param {string} messageText - User message text
 * @returns {Promise<Object>} - Generated response
 */
export const generateResponseToMessage = async (conversationId, userMessageId, messageText) => {
  try {
    // Get conversation history for context
    const conversation = await getConversationHistory(conversationId);
    const { messages, assessment_pattern } = conversation;

    // Generate response based on service type
    const response = await generateFollowUpResponse(messageText, messages, assessment_pattern);
    
    // Create assistant message
    const assistantMessageId = generateMessageId();
    const assistantMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: response.content,
      parent_message_id: userMessageId,
      created_at: new Date().toISOString()
    };

    // Insert response into database
    await insertChatMessage(conversationId, assistantMessage);

    logger.info(`Response generated for message ${userMessageId} in conversation ${conversationId}`);
    
    return {
      id: assistantMessageId,
      conversationId,
      role: 'assistant',
      content: response.content,
      parent_message_id: userMessageId,
      created_at: assistantMessage.created_at,
      metadata: response.metadata
    };

  } catch (error) {
    logger.error('Error generating response to message:', error);
    throw error;
  }
};

/**
 * Generate follow-up response (AI or mock based on service detection)
 * @param {string} messageText - User message text
 * @param {Array} conversationHistory - Previous messages
 * @param {string} [assessmentPattern] - Assessment pattern
 * @returns {Promise<Object>} - Generated response
 */
export const generateFollowUpResponse = async (messageText, conversationHistory = [], assessmentPattern = null) => {
  try {
    const serviceType = await detectService();
    
    if (serviceType === 'ai') {
      return await generateFollowUpAI(messageText, conversationHistory, assessmentPattern);
    } else {
      return await generateFollowUpMock(messageText, conversationHistory, assessmentPattern);
    }
  } catch (error) {
    logger.error('Error generating follow-up response:', error);
    // Fallback to mock if AI fails
    return await generateFollowUpMock(messageText, conversationHistory, assessmentPattern);
  }
};

/**
 * Auto-generate response to the latest message in conversation
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<Object>} - Generated response
 */
export const autoGenerateResponse = async (conversationId) => {
  try {
    const conversation = await getConversationHistory(conversationId);
    const { messages } = conversation;
    
    // Find the latest user message
    const latestUserMessage = messages
      .filter(msg => msg.role === 'user')
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

    if (!latestUserMessage) {
      throw new Error('No user message found to respond to');
    }

    return await generateResponseToMessage(conversationId, latestUserMessage.id, latestUserMessage.content);

  } catch (error) {
    logger.error('Error auto-generating response:', error);
    throw error;
  }
};

/**
 * Generate multiple response options for user to choose from
 * @param {string} conversationId - Conversation ID
 * @param {string} userMessageId - User message ID
 * @param {string} messageText - User message text
 * @param {number} [count=3] - Number of response options
 * @returns {Promise<Array>} - Array of response options
 */
export const generateResponseOptions = async (conversationId, userMessageId, messageText, count = 3) => {
  try {
    const conversation = await getConversationHistory(conversationId);
    const { messages, assessment_pattern } = conversation;
    
    const responses = [];
    
    for (let i = 0; i < count; i++) {
      const response = await generateFollowUpResponse(messageText, messages, assessment_pattern);
      responses.push({
        id: generateMessageId(),
        content: response.content,
        option: i + 1,
        metadata: response.metadata
      });
    }

    logger.info(`Generated ${count} response options for message ${userMessageId}`);
    return responses;

  } catch (error) {
    logger.error('Error generating response options:', error);
    throw error;
  }
}; 