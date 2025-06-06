import logger from '../../../../services/logger.js';
import { getConversationForUser } from '../../conversation/read-conversation/getConversation.js';
import { createConversation } from '../../conversation/create-new-conversation/database/conversationCreate.js';
import { addUserMessage } from '../1-user-message/add-message/sendUserMessage.js';
import { generateAndSaveResponse } from '../2-chatbot-message/generateResponse.js';

/**
 * Complete send message workflow - orchestrates user message creation and AI response
 * @param {string} userId - User ID
 * @param {string} message - Message content
 * @param {string} [conversationId] - Optional existing conversation ID
 * @param {string} [assessmentId] - Optional assessment ID for new conversations
 * @returns {Promise<Object>} - Result with both messages and conversationId
 */
export const sendMessageFlow = async (userId, message, conversationId = null, assessmentId = null) => {
  try {
    logger.info(`Send message flow starting for user ${userId}`, { conversationId, assessmentId });

    // Step 1: Handle conversation creation if needed
    let currentConversationId = conversationId;
    
    if (conversationId) {
      // Verify existing conversation ownership
      const result = await getConversationForUser(conversationId, userId);
      if (!result.success) {
        throw new Error('Conversation not found or access denied');
      }
    } else {
      // Create new conversation
      currentConversationId = await createConversation(userId, assessmentId);
    }

    // Step 2: Add user message to database
    const userResult = await addUserMessage(currentConversationId, userId, message);
    logger.info('✅ User message added to database');

    // Step 3: Generate and save AI response
    const assistantResult = await generateAndSaveResponse(
      currentConversationId, 
      userId, 
      userResult.userMessage.id, 
      message
    );
    logger.info('✅ Assistant response generated and saved to database');

    return {
      success: true,
      conversationId: currentConversationId,
      userMessage: userResult.userMessage,
      assistantMessage: assistantResult.chatbotMessage,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    logger.error('Error in sendMessageFlow:', error);
    throw error;
  }
}; 