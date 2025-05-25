import DbService from '../../../services/dbService.js';
import logger from '../../../services/logger.js';

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