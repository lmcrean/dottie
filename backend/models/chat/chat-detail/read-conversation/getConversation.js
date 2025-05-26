import logger from '../../../../services/logger.js';
import DbService from '../../../../services/dbService.js';
import Chat from '../../chat-list/chat.js';

/**
 * Get conversation with all messages
 * @param {string} conversationId - Conversation ID
 * @param {string} [userId] - User ID for ownership verification
 * @returns {Promise<Object>} - Conversation with messages
 */
export const getConversationHistory = async (conversationId, userId = null) => {
  try {
    // Verify ownership if userId provided
    if (userId) {
      const isOwner = await Chat.isOwner(conversationId, userId);
      if (!isOwner) {
        throw new Error('User does not own this conversation');
      }
    }

    // Get conversation data
    const conversation = await Chat.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Get all messages for this conversation
    const messages = await DbService.getWhere('chat_messages', { conversation_id: conversationId });
    
    // Sort messages by creation date
    const sortedMessages = messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

    logger.info(`Retrieved conversation ${conversationId} with ${sortedMessages.length} messages`);
    
    return {
      id: conversation.id,
      user_id: conversation.user_id,
      assessment_id: conversation.assessment_id,
      assessment_pattern: conversation.assessment_pattern,
      created_at: conversation.created_at,
      updated_at: conversation.updated_at,
      messages: sortedMessages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        user_id: msg.user_id,
        parent_message_id: msg.parent_message_id,
        created_at: msg.created_at,
        edited_at: msg.edited_at
      })),
      message_count: sortedMessages.length
    };

  } catch (error) {
    logger.error('Error getting conversation history:', error);
    throw error;
  }
};

/**
 * Get conversation messages with pagination
 * @param {string} conversationId - Conversation ID
 * @param {Object} [options] - Pagination options
 * @param {number} [options.limit=50] - Number of messages to return
 * @param {number} [options.offset=0] - Number of messages to skip
 * @param {string} [options.order='asc'] - Order: 'asc' or 'desc'
 * @returns {Promise<Object>} - Paginated messages
 */
export const getConversationMessages = async (conversationId, options = {}) => {
  const { limit = 50, offset = 0, order = 'asc' } = options;

  try {
    const conversation = await Chat.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Get total message count
    const totalMessages = await DbService.count('chat_messages', { conversation_id: conversationId });

    // Get paginated messages
    const messages = await DbService.getPaginated('chat_messages', {
      where: { conversation_id: conversationId },
      limit,
      offset,
      orderBy: `created_at ${order.toUpperCase()}`
    });

    return {
      conversationId,
      messages: messages.map(msg => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        user_id: msg.user_id,
        parent_message_id: msg.parent_message_id,
        created_at: msg.created_at,
        edited_at: msg.edited_at
      })),
      pagination: {
        total: totalMessages,
        limit,
        offset,
        hasMore: offset + limit < totalMessages
      }
    };

  } catch (error) {
    logger.error('Error getting conversation messages:', error);
    throw error;
  }
};

/**
 * Get recent messages from conversation
 * @param {string} conversationId - Conversation ID
 * @param {number} [count=10] - Number of recent messages
 * @returns {Promise<Array>} - Recent messages
 */
export const getRecentMessages = async (conversationId, count = 10) => {
  try {
    const messages = await DbService.query(`
      SELECT * FROM chat_messages 
      WHERE conversation_id = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `, [conversationId, count]);

    // Reverse to get chronological order
    return messages.reverse().map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      user_id: msg.user_id,
      parent_message_id: msg.parent_message_id,
      created_at: msg.created_at,
      edited_at: msg.edited_at
    }));

  } catch (error) {
    logger.error('Error getting recent messages:', error);
    throw error;
  }
};

/**
 * Get conversation summary/metadata
 * @param {string} conversationId - Conversation ID
 * @returns {Promise<Object>} - Conversation summary
 */
export const getConversationSummary = async (conversationId) => {
  try {
    const conversation = await Chat.findById(conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }

    // Get message statistics
    const messageStats = await DbService.query(`
      SELECT 
        COUNT(*) as total_messages,
        COUNT(CASE WHEN role = 'user' THEN 1 END) as user_messages,
        COUNT(CASE WHEN role = 'assistant' THEN 1 END) as assistant_messages,
        MIN(created_at) as first_message_at,
        MAX(created_at) as last_message_at
      FROM chat_messages 
      WHERE conversation_id = ?
    `, [conversationId]);

    const stats = messageStats[0] || {};

    return {
      id: conversation.id,
      user_id: conversation.user_id,
      assessment_id: conversation.assessment_id,
      assessment_pattern: conversation.assessment_pattern,
      created_at: conversation.created_at,
      updated_at: conversation.updated_at,
      statistics: {
        total_messages: stats.total_messages || 0,
        user_messages: stats.user_messages || 0,
        assistant_messages: stats.assistant_messages || 0,
        first_message_at: stats.first_message_at,
        last_message_at: stats.last_message_at
      }
    };

  } catch (error) {
    logger.error('Error getting conversation summary:', error);
    throw error;
  }
}; 