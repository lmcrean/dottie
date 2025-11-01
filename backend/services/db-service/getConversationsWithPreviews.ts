import { db } from '../../db/index.js';
import { ConversationPreview } from './types.js';

interface Conversation {
  id: string | number;
  user_id: string | number;
  assessment_id?: string | number | null;
  assessment_pattern?: string | null;
  created_at: Date | string;
  updated_at: Date | string;
}

interface Message {
  id: string | number;
  conversation_id: string | number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: Date | string;
}

interface CountResult {
  count?: number | string;
}

/**
 * Get conversations with their latest message preview
 * @param userId - User ID
 * @returns Conversations with previews
 */
export async function getConversationsWithPreviews(
  userId: string | number
): Promise<ConversationPreview[]> {
  try {
    console.log(`[getConversationsWithPreviews] Starting query for userId: ${userId}`);

    // Get all conversations for the user
    console.log(`[getConversationsWithPreviews] Querying conversations table...`);
    const conversations = await db('conversations')
      .where('user_id', userId)
      .orderBy('updated_at', 'desc') as Conversation[];

    console.log(`[getConversationsWithPreviews] Found ${conversations?.length || 0} conversations`);
    console.log(`[getConversationsWithPreviews] Conversations data:`, JSON.stringify(conversations, null, 2));

    // For each conversation, get the latest message and message count
    const conversationsWithPreviews = await Promise.all(
      (conversations || []).map(async (conv, index) => {
        console.log(`[getConversationsWithPreviews] Processing conversation ${index + 1}/${conversations.length}: ${conv.id}`);

        try {
          console.log(`[getConversationsWithPreviews] Querying latest assistant message for conversation ${conv.id}...`);
          const latestAssistantMessage = await db('chat_messages')
            .where('conversation_id', conv.id)
            .where('role', 'assistant')
            .orderBy('created_at', 'desc')
            .first() as Message | undefined;

          console.log(`[getConversationsWithPreviews] Latest assistant message for ${conv.id}:`, latestAssistantMessage ? 'found' : 'none');

          // If no assistant message found, try to get the latest message of any type
          let latestMessage = latestAssistantMessage;
          if (!latestMessage) {
            console.log(`[getConversationsWithPreviews] No assistant message found, querying any latest message for ${conv.id}...`);
            latestMessage = await db('chat_messages')
              .where('conversation_id', conv.id)
              .orderBy('created_at', 'desc')
              .first() as Message | undefined;
            console.log(`[getConversationsWithPreviews] Any latest message for ${conv.id}:`, latestMessage ? 'found' : 'none');
          }

          console.log(`[getConversationsWithPreviews] Counting messages for conversation ${conv.id}...`);
          const messageCountResult = await db('chat_messages')
            .where('conversation_id', conv.id)
            .count('* as count');

          console.log(`[getConversationsWithPreviews] Message count result for ${conv.id}:`, messageCountResult);

          // Handle different count result formats (Knex vs Supabase shim)
          let messageCount = 0;
          if (Array.isArray(messageCountResult) && messageCountResult.length > 0) {
            // Traditional Knex format: array with count object
            const countObj = messageCountResult[0] as CountResult;
            messageCount = parseInt(String(countObj.count)) || 0;
          } else if (messageCountResult && typeof (messageCountResult as any).count !== 'undefined') {
            // Supabase shim format: direct count object
            messageCount = parseInt(String((messageCountResult as any).count)) || 0;
          }

          const result: ConversationPreview = {
            id: conv.id,
            last_message_date: conv.updated_at,
            preview: latestMessage
              ? latestMessage.content.substring(0, 50)
              : '',
            message_count: messageCount,
            assessment_id: conv.assessment_id,
            assessment_pattern: conv.assessment_pattern,
            user_id: conv.user_id
          };

          console.log(`[getConversationsWithPreviews] Result for conversation ${conv.id}:`, JSON.stringify(result, null, 2));
          return result;
        } catch (convError) {
          console.error(`[getConversationsWithPreviews] Error processing conversation ${conv.id}:`, convError);
          throw convError;
        }
      })
    );

    console.log(`[getConversationsWithPreviews] Successfully processed all conversations. Final result count: ${conversationsWithPreviews.length}`);
    return conversationsWithPreviews;
  } catch (error) {
    console.error(`[getConversationsWithPreviews] Error for userId ${userId}:`, error);
    console.error(`[getConversationsWithPreviews] Error stack:`, (error as Error).stack);
    throw error;
  }
}
