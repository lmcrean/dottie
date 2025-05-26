import logger from '../../../../services/logger.js';
import { ChatDatabaseOperations } from '../shared/database/chatOperations.js';
import { formatUserMessage } from '../user-message/validation/messageFormatters.js';
import { generateMessageId } from '../shared/utils/responseBuilders.js';
import { detectService } from './services/serviceDetector.js';
import { generateFollowUpResponse as generateFollowUpAI } from './services/ai/generators/followUpAI.js';
import { generateFollowUpResponse as generateFollowUpMock } from './services/mock/generators/followUpMock.js';
import { generateInitialResponse as generateInitialAI } from './services/ai/generators/initialAI.js';
import { generateInitialResponse as generateInitialMock } from './services/mock/generators/initialMock.js';
import { getConversationHistory } from '../read-chat-detail/getWithContext.js';

/**
 * Consolidated Response Coordinator
 * Handles all response generation and message coordination
 * Replaces: generateResponse.js, initialMessage.js
 */
export class ResponseCoordinator {

  /**
   * Generate response to a user message in an ongoing conversation
   * @param {string} conversationId - Conversation ID
   * @param {string} userMessageId - User message ID to respond to
   * @param {string} messageText - User message text
   * @returns {Promise<Object>} - Generated response
   */
  static async generateResponseToMessage(conversationId, userMessageId, messageText) {
    try {
      // Get conversation history for context
      const conversation = await getConversationHistory(conversationId);
      const { messages, assessment_pattern } = conversation;

      // Generate response based on service type
      const response = await this.generateFollowUpResponse(messageText, messages, assessment_pattern);
      
      // Create assistant message
      const assistantMessageId = generateMessageId();
      const assistantMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: response.content,
        parent_message_id: userMessageId,
        created_at: new Date().toISOString()
      };

      // Insert response into database using consolidated operations
      await ChatDatabaseOperations.insertMessage(conversationId, assistantMessage);

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
  }

  /**
   * Generate follow-up response (AI or mock based on service detection)
   * @param {string} messageText - User message text
   * @param {Array} conversationHistory - Previous messages
   * @param {string} [assessmentPattern] - Assessment pattern
   * @returns {Promise<Object>} - Generated response
   */
  static async generateFollowUpResponse(messageText, conversationHistory = [], assessmentPattern = null) {
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
  }

  /**
   * Generate initial response (AI or mock based on service detection)
   * @param {string} messageText - User message text
   * @param {string} [assessmentPattern] - Assessment pattern
   * @returns {Promise<Object>} - Generated response
   */
  static async generateInitialResponse(messageText, assessmentPattern = null) {
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
  }

  /**
   * Create and send the initial message for a new conversation
   * @param {string} conversationId - Conversation ID
   * @param {string} userId - User ID
   * @param {string} messageText - Initial message text
   * @param {string} [assessmentPattern] - Assessment pattern for context
   * @returns {Promise<Object>} - Initial message and response
   */
  static async createInitialMessage(conversationId, userId, messageText, assessmentPattern = null) {
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

      // Generate AI/mock response
      const response = await this.generateInitialResponse(messageText, assessmentPattern);
      
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

  /**
   * Auto-trigger initial conversation with default message
   * @param {string} conversationId - Conversation ID
   * @param {string} userId - User ID
   * @param {string} [assessmentPattern] - Assessment pattern
   * @returns {Promise<Object>} - Initial conversation state
   */
  static async autoTriggerInitialConversation(conversationId, userId, assessmentPattern = null) {
    const defaultMessage = assessmentPattern 
      ? `Hi! I'd like to discuss my ${assessmentPattern} assessment results.`
      : "Hi! I'd like to start a conversation.";
      
    return await this.createInitialMessage(conversationId, userId, defaultMessage, assessmentPattern);
  }

  /**
   * Auto-generate response to the latest message in conversation
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} - Generated response
   */
  static async autoGenerateResponse(conversationId) {
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

      return await this.generateResponseToMessage(conversationId, latestUserMessage.id, latestUserMessage.content);

    } catch (error) {
      logger.error('Error auto-generating response:', error);
      throw error;
    }
  }

  /**
   * Generate multiple response options for user to choose from
   * @param {string} conversationId - Conversation ID
   * @param {string} userMessageId - User message ID
   * @param {string} messageText - User message text
   * @param {number} [count=3] - Number of response options
   * @returns {Promise<Array>} - Array of response options
   */
  static async generateResponseOptions(conversationId, userMessageId, messageText, count = 3) {
    try {
      const conversation = await getConversationHistory(conversationId);
      const { messages, assessment_pattern } = conversation;
      
      const responses = [];
      
      for (let i = 0; i < count; i++) {
        const response = await this.generateFollowUpResponse(messageText, messages, assessment_pattern);
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
  }

  /**
   * Trigger response generation for existing conversation (replaces triggerResponse.js)
   * @param {string} conversationId - Conversation ID
   * @returns {Promise<Object>} - Generated response
   */
  static async triggerResponse(conversationId) {
    try {
      logger.info(`Triggering response generation for conversation ${conversationId}`);
      
      const response = await this.autoGenerateResponse(conversationId);
      
      logger.info(`Response generation completed for conversation ${conversationId}`);
      return response;

    } catch (error) {
      logger.error('Error triggering response generation:', error);
      throw error;
    }
  }
} 