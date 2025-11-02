import type { MessageRecord } from '../../../types.js';
import logger from '../../../../../services/logger.js';
import { ConfigHelper } from './configHelper.js';
import { insertChatMessage } from '../../1-user-message/add-message/database/sendUserMessage.js';
import { generateMessageId } from '../../shared/utils/responseBuilders.js';
import { generateAIResponse } from '../services/ai/generators/aiResponse.js';
import { generateMockResponse } from '../services/mock/generators/mockResponse.js';
// import { getConversationHistory } from '../../../read-chat-detail/getWithContext.js';
import { updateConversationPreview } from '../../../conversation/read-conversation/getPreviewHook.js';
import DbService from '../../../../../services/dbService.js';

/**
 * Response generation result
 */
interface GeneratedResponse {
  content: string;
  metadata?: Record<string, any>;
}

/**
 * Assistant message result
 */
export interface AssistantMessageResult extends MessageRecord {
  conversationId: string | number;
  metadata?: Record<string, any>;
}

/**
 * Generate and store assistant response for conversations
 * @param conversationId - Conversation ID
 * @param messageText - User message text
 * @param assessmentPattern - Assessment pattern for context
 * @param parentMessageId - Parent message ID for follow-ups
 * @returns Generated assistant message
 */
export async function generateAndStoreAssistantResponse(
  conversationId: string | number,
  messageText: string,
  assessmentPattern: string | null = null,
  parentMessageId: string | number | null = null
): Promise<AssistantMessageResult> {
  try {
    const serviceType = ConfigHelper.detectService();

    // TODO: Get conversation history for context
    // For now, use empty history for initial message
    const messages: MessageRecord[] = [];
    const assessmentData = null;
    const pattern = assessmentPattern;

    let response: GeneratedResponse;
    if (serviceType === 'ai') {
      response = await generateAIResponse(messageText, messages, assessmentData, pattern);
    } else {
      response = await generateMockResponse(messageText, messages, assessmentData, pattern);
    }

    const assistantMessageId = generateMessageId();
    const assistantMessage: any = {
      id: assistantMessageId,
      role: 'assistant',
      content: response.content,
      created_at: new Date().toISOString()
    };

    if (parentMessageId) {
      assistantMessage.parent_message_id = parentMessageId;
    }

    await insertChatMessage(conversationId, assistantMessage);

    // Update conversation preview with this assistant message
    await updateConversationPreview(DbService, conversationId, response.content);
    logger.info(`Conversation preview updated from assistantMessageHelper for ${conversationId}`);

    logger.info(`Assistant response generated for conversation ${conversationId}`);

    return {
      id: assistantMessageId,
      conversation_id: conversationId,
      conversationId,
      user_id: '', // Assistant messages don't have a user_id
      role: 'assistant' as const,
      content: response.content,
      parent_message_id: parentMessageId || null,
      created_at: assistantMessage.created_at,
      updated_at: assistantMessage.created_at,
      metadata: response.metadata
    };

  } catch (error) {
    logger.error('Error generating assistant response:', error);
    throw error;
  }
}
