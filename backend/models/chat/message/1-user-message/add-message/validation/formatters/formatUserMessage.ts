import logger from '../../../../../../../services/logger.ts';

/**
 * Formatting options for user messages
 */
export interface UserMessageFormatOptions {
  maxLength?: number;
  trim?: boolean;
  validateContent?: boolean;
}

/**
 * Formatted user message result
 */
export interface FormattedUserMessage {
  role: 'user';
  content: string;
  user_id: string | number;
  formatted_at: string;
  original_length: number;
  final_length: number;
  was_truncated: boolean;
}

/**
 * Format user message for consistency and validation
 * @param content - Message content
 * @param userId - User ID
 * @param options - Formatting options
 * @returns Formatted user message
 */
export const formatUserMessage = (
  content: string,
  userId: string | number,
  options: UserMessageFormatOptions = {}
): FormattedUserMessage => {
  const {
    maxLength = 4000,
    trim = true,
    validateContent = true
  } = options;

  try {
    let formattedContent = content;

    // Basic validation
    if (validateContent) {
      if (!content || typeof content !== 'string') {
        throw new Error('Message content must be a non-empty string');
      }
    }

    // Trim whitespace
    if (trim) {
      formattedContent = formattedContent.trim();
    }

    // Length validation
    if (formattedContent.length > maxLength) {
      logger.warn(`Message truncated from ${formattedContent.length} to ${maxLength} characters`);
      formattedContent = formattedContent.substring(0, maxLength) + '...';
    }

    // Basic sanitization (remove null bytes, control characters)
    formattedContent = formattedContent.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    return {
      role: 'user',
      content: formattedContent,
      user_id: userId,
      formatted_at: new Date().toISOString(),
      original_length: content.length,
      final_length: formattedContent.length,
      was_truncated: formattedContent.length !== content.length
    };

  } catch (error) {
    logger.error('Error formatting user message:', error);
    throw error;
  }
};
