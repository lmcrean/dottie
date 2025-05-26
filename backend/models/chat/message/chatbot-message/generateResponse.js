import logger from '../../../../../services/logger.js';
import { ConfigHelper } from './utils/configHelper.js';
import { ChatDatabaseOperations } from '../../shared/database/chatOperations.js';
import { generateMessageId } from '../shared/utils/responseBuilders.js';
import { getConversationHistory } from '../../read-chat-detail/getWithContext.js';
import { generateFollowUpResponse as generateFollowUpAI } from './services/ai/generators/followUpAI.js';
import { generateFollowUpResponse as generateFollowUpMock } from './services/mock/generators/followUpMock.js';
import { generateAndStoreAssistantResponse } from './utils/assistantMessageHelper.js';

/**
 * Generate response to a user message in an ongoing conversation
 * @param {string} conversationId - Conversation ID
 * @param {string} userMessageId - User message ID to respond to
 * @param {string} messageText - User message text
 * @returns {Promise<Object>} - Generated response
 */
export async function generateResponseToMessage(conversationId, userMessageId, messageText) {
  return await generateAndStoreAssistantResponse(conversationId, messageText, null, userMessageId);
} 