/**
 * Type declarations for messageFormatters
 */

import type { MessageRecord } from '../../../types.js';

export interface FormatMessagesForAIOptions {
  includeSystemMessage?: boolean;
  systemMessage?: string;
  maxHistory?: number;
}

export interface FormattedAIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export function formatMessagesForAI(
  messages: MessageRecord[],
  options?: FormatMessagesForAIOptions
): FormattedAIMessage[];
