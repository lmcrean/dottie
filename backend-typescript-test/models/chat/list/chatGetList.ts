import DbService from '../../../services/dbService.ts';
import logger from '../../../services/logger.ts';

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
