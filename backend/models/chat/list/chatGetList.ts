import DbService from '../../../services/dbService.js';
import logger from '../../../services/logger.js';
import type { ConversationSummary } from '../types.js';

/**
 * Get all conversations for a user (with preview of last message)
 * @param userId - User ID
 * @returns List of conversations
 */
export const getUserConversations = async (
  userId: number | string
): Promise<ConversationSummary[]> => {
  try {
    console.log(`[getUserConversations] Starting with userId: ${userId}, type: ${typeof userId}`);

    const conversations = await DbService.getConversationsWithPreviews(userId) as any[];

    console.log(`[getUserConversations] DbService.getConversationsWithPreviews returned:`, conversations);

    // Handle null or undefined results
    if (!conversations) {
      console.log(`[getUserConversations] No conversations returned, returning empty array`);
      return [];
    }

    console.log(`[getUserConversations] Processing ${conversations.length} conversations`);

    const result: ConversationSummary[] = conversations.map((conversation: any) => ({
      id: conversation.id,
      user_id: conversation.user_id,
      assessment_id: conversation.assessment_id,
      assessment_pattern: conversation.assessment_pattern,
      preview: conversation.preview
        ? conversation.preview + (conversation.preview.length >= 50 ? '...' : '')
        : 'No messages yet',
      created_at: conversation.created_at,
      updated_at: conversation.last_message_date || conversation.updated_at,
      message_count: conversation.message_count || 0,
      last_message_at: conversation.last_message_date,
      last_message_date: conversation.last_message_date
    }));

    console.log(`[getUserConversations] Final result:`, JSON.stringify(result, null, 2));
    return result;

  } catch (error) {
    logger.error('[getUserConversations] Error getting user conversations:', error);
    console.error('[getUserConversations] Detailed error:', {
      message: (error as Error).message,
      stack: (error as Error).stack,
      userId: userId,
      userIdType: typeof userId
    });
    throw error;
  }
};
