import { db } from '../../../db/index.js';

/**
 * Get conversations with their latest message preview
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Conversations with previews
 */
export async function getConversationsWithPreviews(userId) {
  try {
    // Get all conversations for the user
    const conversations = await db('conversations')
      .where('user_id', userId)
      .orderBy('updated_at', 'desc');

    // For each conversation, get the latest message and message count
    const conversationsWithPreviews = await Promise.all(
      (conversations || []).map(async (conv) => {
        const latestMessage = await db('chat_messages')
          .where('conversation_id', conv.id)
          .orderBy('created_at', 'desc')
          .first();

        const messageCount = await db('chat_messages')
          .where('conversation_id', conv.id)
          .count('* as count')
          .first();

        return {
          id: conv.id,
          last_message_date: conv.updated_at,
          preview: latestMessage
            ? latestMessage.content.substring(0, 50)
            : '',
          message_count: messageCount ? parseInt(messageCount.count) : 0,
          assessment_id: conv.assessment_id,
          assessment_pattern: conv.assessment_pattern,
          user_id: conv.user_id
        };
      })
    );

    return conversationsWithPreviews;
  } catch (error) {
    console.error(`Error in getConversationsWithPreviews:`, error);
    throw error;
  }
} 
