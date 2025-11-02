import logger from '../../../../../services/logger.js';
import { insertChatMessage } from './database/sendUserMessage.js';
import { generateMessageId } from '../../shared/utils/responseBuilders.js';
import { verifyParentMessageId } from './database/linkParentMessageId.js';
import Chat from '../../../list/chat.js';

/**
 * Options for sending a user message
 */
export interface SendUserMessageOptions {
  parentMessageId?: number | string | null;
  context?: Record<string, any>;
}

/**
 * User message result
 */
export interface UserMessageResult {
  userMessage: {
    id: string;
    conversationId: number | string;
    role: string;
    content: string;
    parent_message_id: number | string | null;
    created_at: string;
    [key: string]: any;
  };
  conversationId: number | string;
  timestamp: string;
}

/**
 * Add a user message to a conversation
 * @param conversationId - Conversation ID
 * @param userId - User ID
 * @param messageText - Message content
 * @param options - Options for message sending
 * @returns User message result
 */
export const addUserMessage = async (
  conversationId: number | string,
  userId: number | string,
  messageText: string,
  options: SendUserMessageOptions = {}
): Promise<UserMessageResult> => {
  const {
    parentMessageId = null,
    context = {}
  } = options;

  try {
    logger.info(`Adding user message to conversation ${conversationId}`);

    // Verify conversation ownership
    const isOwner = await Chat.isOwner(conversationId, userId);
    if (!isOwner) {
      throw new Error('User does not own this conversation');
    }

    // Generate message ID and create message data
    const messageId = generateMessageId();
    let messageData = {
      id: messageId,
      role: 'user',
      content: messageText,
      parent_message_id: parentMessageId,
      created_at: new Date().toISOString()
    };

    // Verify parent_message_id is properly set
    // This will ensure messages other than the first have a parent_message_id
    messageData = await verifyParentMessageId(conversationId, messageData);

    // Insert user message into database
    await insertChatMessage(conversationId, messageData);

    const userMessage = {
      id: messageId,
      conversationId,
      role: 'user',
      content: messageText,
      parent_message_id: messageData.parent_message_id,
      created_at: messageData.created_at,
      ...context
    };

    logger.info(`User message added successfully to conversation ${conversationId}`);

    return {
      userMessage,
      conversationId,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    logger.error('Error adding user message:', error);
    throw error;
  }
};

// Keep legacy function name for backward compatibility
export const sendMessage = addUserMessage;
