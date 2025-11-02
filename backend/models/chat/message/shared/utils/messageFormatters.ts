import type { MessageRecord } from '../../../types.js';

/**
 * Options for formatting messages for AI
 */
export interface FormatMessagesForAIOptions {
  includeSystemMessage?: boolean;
  systemMessage?: string;
  maxHistory?: number;
}

/**
 * Formatted message for AI
 */
export interface FormattedAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

/**
 * Format conversation messages for AI consumption
 * @param messages - Array of message records
 * @param options - Formatting options
 * @returns Array of formatted messages
 */
export const formatMessagesForAI = (
  messages: MessageRecord[],
  options: FormatMessagesForAIOptions = {}
): FormattedAIMessage[] => {
  const {
    includeSystemMessage = false,
    systemMessage = '',
    maxHistory = 50
  } = options;

  const formattedMessages: FormattedAIMessage[] = [];

  // Add system message if requested
  if (includeSystemMessage && systemMessage) {
    formattedMessages.push({
      role: 'system',
      content: systemMessage
    });
  }

  // Limit history to maxHistory most recent messages
  const recentMessages = messages.slice(-maxHistory);

  // Format each message
  for (const message of recentMessages) {
    formattedMessages.push({
      role: message.role as 'user' | 'assistant' | 'system',
      content: message.content
    });
  }

  return formattedMessages;
};
