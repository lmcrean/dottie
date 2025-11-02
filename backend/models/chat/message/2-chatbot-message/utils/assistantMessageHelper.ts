import type { MessageRecord } from '../../../types.js';
import logger from '../../../../../services/logger.js';
import { ConfigHelper } from './configHelper.js';
import { insertChatMessage } from '../../1-user-message/add-message/database/sendUserMessage.js';
import { generateMessageId } from '../../shared/utils/responseBuilders.js';
import { generateInitialResponse as generateInitialAI } from '../services/ai/generators/initialAI.js';
import { generateInitialResponse as generateInitialMock } from '../services/mock/generators/initialMock.js';
import { generateFollowUpResponse as generateFollowUpAI } from '../services/ai/generators/followUpAI.js';
import { generateFollowUpResponse as generateFollowUpMock } from '../services/mock/generators/followUpMock.js';
import { getConversationHistory } from '../../../read-chat-detail/getWithContext.js';
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
export interface AssistantMessageResult {
  id: string | number;
  conversationId: string | number;
  role: 'assistant';
  content: string;
  parent_message_id?: string | number | null;
  created_at: string;
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

    // Determine if this is initial or follow-up response
    const isInitial = !parentMessageId;

    let response: GeneratedResponse;
    if (isInitial) {
      response = serviceType === 'ai'
        ? await generateInitialAI(messageText, assessmentPattern)
        : await generateInitialMock(messageText, assessmentPattern);
    } else {
      // Get conversation history for follow-up context
      const conversation = await getConversationHistory(conversationId);
      const { messages, assessment_pattern } = conversation;

      response = serviceType === 'ai'
        ? await generateFollowUpAI(messageText, messages, assessment_pattern)
        : await generateFollowUpMock(messageText, messages, assessment_pattern);
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
      conversationId,
      role: 'assistant',
      content: response.content,
      parent_message_id: parentMessageId,
      created_at: assistantMessage.created_at,
      metadata: response.metadata
    };

  } catch (error) {
    logger.error('Error generating assistant response:', error);
    throw error;
  }
}
