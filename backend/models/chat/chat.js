import { v4 as uuidv4 } from 'uuid';
import DbService from '../../services/dbService.js';
import logger from '../../services/logger.js';

/**
 * Get assessment pattern from assessment ID
 * @param {string} assessmentId - Assessment ID
 * @returns {Promise<string|null>} - Assessment pattern or null
 */
export const getAssessmentPattern = async (assessmentId) => {
  if (!assessmentId) return null;
  
  try {
    // Import Assessment model dynamically to avoid circular dependencies
    const { default: Assessment } = await import('../assessment/Assessment.js');
    
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      logger.warn(`Assessment not found: ${assessmentId}`);
      return null;
    }
    
    // Return the pattern field - this could be from different formats
    return assessment.pattern || assessment.assessment_pattern || null;
  } catch (error) {
    logger.error('Error getting assessment pattern:', error);
    return null;
  }
};

/**
 * Create a new conversation in the database
 * @param {string} userId - User ID who owns this conversation
 * @param {string} [assessmentId] - Optional assessment ID to link to this conversation
 * @param {string} [assessmentPattern] - Optional assessment pattern (if not provided, will be fetched from assessmentId)
 * @returns {Promise<string>} - Conversation ID
 */
export const createConversation = async (userId, assessmentId = null, assessmentPattern = null) => {
  try {
    const conversationId = uuidv4();
    const now = new Date().toISOString();
    
    // If we have assessmentId but no pattern, fetch the pattern
    if (assessmentId && !assessmentPattern) {
      assessmentPattern = await getAssessmentPattern(assessmentId);
    }
    
    await DbService.create('conversations', {
      id: conversationId,
      user_id: userId,
      assessment_id: assessmentId,
      assessment_pattern: assessmentPattern,
      created_at: now,
      updated_at: now
    });
    
    logger.info(`Created conversation ${conversationId} with assessment ${assessmentId} and pattern: ${assessmentPattern}`);
    return conversationId;
  } catch (error) {
    logger.error('Error creating conversation:', error);
    throw error;
  }
};

/**
 * Insert a chat message into the database
 * @param {string} conversationId - Conversation ID
 * @param {Object} message - Message object with role and content
 * @returns {Promise<boolean>} - Success indicator
 */
export const insertChatMessage = async (conversationId, message) => {
  try {
    const messageId = uuidv4();
    const now = new Date().toISOString();
    
    // Insert the message
    await DbService.create('chat_messages', {
      id: messageId,
      conversation_id: conversationId,
      role: message.role,
      content: message.content,
      created_at: now
    });
    
    // Update conversation's updated_at time
    await DbService.update('conversations', conversationId, {
      updated_at: now
    });
    
    return true;
  } catch (error) {
    logger.error('Error inserting chat message:', error);
    throw error;
  }
};

/**
 * Get a conversation and its messages by ID
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID to verify ownership
 * @returns {Promise<Object|null>} - Conversation with messages
 */
export const getConversation = async (conversationId, userId) => {
  try {
    // First check if the conversation exists and belongs to the user
    const conversation = await DbService.findBy('conversations', 'id', conversationId);

    if (!conversation || conversation.length === 0 || conversation[0].user_id !== userId) {
      return null;
    }
    
    const conversationRecord = conversation[0];
    
    // Get all messages for this conversation
    const messages = await DbService.findBy('chat_messages', 'conversation_id', conversationId);
    
    return {
      id: conversationId,
      assessment_id: conversationRecord.assessment_id,
      assessment_pattern: conversationRecord.assessment_pattern,
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        created_at: msg.created_at // Keep snake_case consistent
      }))
    };
  } catch (error) {
    logger.error('Error getting conversation:', error);
    throw error;
  }
};

/**
 * Get all conversations for a user (with preview of last message)
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - List of conversations
 */
export const getUserConversations = async (userId) => {
  try {
    const conversations = await DbService.getConversationsWithPreviews(userId);
    
    return conversations.map(conversation => ({
      id: conversation.id,
      last_message_date: conversation.last_message_date,
      preview: conversation.preview 
        ? conversation.preview + (conversation.preview.length >= 50 ? '...' : '')
        : 'No messages yet',
      message_count: conversation.message_count || 0,
      assessment_id: conversation.assessment_id,
      assessment_pattern: conversation.assessment_pattern,
      user_id: conversation.user_id
    }));

  } catch (error) {
    logger.error('Error getting user conversations:', error);
    throw error;
  }
};

/**
 * Delete a conversation and all its messages
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID to verify ownership
 * @returns {Promise<boolean>} - Success indicator
 */
export const deleteConversation = async (conversationId, userId) => {
  try {
    // First check if the conversation exists and belongs to the user
    const conversations = await DbService.findBy('conversations', 'id', conversationId);
    
    // Check if conversation exists and belongs to user
    if (!conversations || conversations.length === 0) {
      logger.warn(`Conversation ${conversationId} not found`);
      return false;
    }

    const conversation = conversations[0];
    if (conversation.user_id !== userId) {
      logger.warn(`User ${userId} not authorized to delete conversation ${conversationId}`);
      return false;
    }

    // Delete all messages first (due to foreign key constraint)
    const messagesDeleted = await DbService.delete('chat_messages', {
      conversation_id: conversationId
    });
    logger.info(`Deleted ${messagesDeleted} messages from conversation ${conversationId}`);

    // Delete the conversation
    const conversationDeleted = await DbService.delete('conversations', {
      id: conversationId,
      user_id: userId  // Extra safety: ensure user owns the conversation
    });

    if (!conversationDeleted) {
      logger.error(`Failed to delete conversation ${conversationId}`);
      return false;
    }

    logger.info(`Successfully deleted conversation ${conversationId}`);
    return true;

  } catch (error) {
    logger.error('Error deleting conversation:', error);
    throw error;
  }
};

/**
 * Update a conversation's assessment links
 * @param {string} conversationId - Conversation ID
 * @param {string} userId - User ID to verify ownership
 * @param {string} [assessmentId] - Assessment ID to link
 * @param {string} [assessmentPattern] - Assessment pattern
 * @returns {Promise<boolean>} - Success indicator
 */
export const updateConversationAssessmentLinks = async (conversationId, userId, assessmentId = null, assessmentPattern = null) => {
  try {
    // First verify the conversation belongs to the user
    const conversation = await DbService.findBy('conversations', 'id', conversationId);
    
    if (!conversation || conversation.length === 0 || conversation[0].user_id !== userId) {
      logger.warn(`User ${userId} not authorized to update conversation ${conversationId}`);
      return false;
    }
    
    // Update the assessment links
    await DbService.update('conversations', conversationId, {
      assessment_id: assessmentId,
      assessment_pattern: assessmentPattern,
      updated_at: new Date().toISOString()
    });
    
    logger.info(`Updated assessment links for conversation ${conversationId}`);
    return true;
  } catch (error) {
    logger.error('Error updating conversation assessment links:', error);
    throw error;
  }
}; 