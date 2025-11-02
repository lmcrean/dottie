import logger from '../../../../../../../services/logger.ts';

/**
 * Formatting options for assistant messages
 */
export interface AssistantMessageFormatOptions {
  includeMetadata?: boolean;
  validateContent?: boolean;
  trim?: boolean;
}

/**
 * Formatted assistant message result
 */
export interface FormattedAssistantMessage {
  role: 'assistant';
  content: string;
  formatted_at: string;
  content_length: number;
  metadata?: Record<string, any>;
}

/**
 * Format assistant message for consistency
 * @param content - Message content
 * @param metadata - Additional metadata
 * @param options - Formatting options
 * @returns Formatted assistant message
 */
export const formatAssistantMessage = (
  content: string,
  metadata: Record<string, any> = {},
  options: AssistantMessageFormatOptions = {}
): FormattedAssistantMessage => {
  const {
    includeMetadata = true,
    validateContent = true,
    trim = true
  } = options;

  try {
    let formattedContent = content;

    // Basic validation
    if (validateContent) {
      if (!content || typeof content !== 'string') {
        throw new Error('Assistant message content must be a non-empty string');
      }
    }

    // Trim whitespace
    if (trim) {
      formattedContent = formattedContent.trim();
    }

    // Basic sanitization
    formattedContent = formattedContent.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    const formattedMessage: FormattedAssistantMessage = {
      role: 'assistant',
      content: formattedContent,
      formatted_at: new Date().toISOString(),
      content_length: formattedContent.length
    };

    // Include metadata if requested
    if (includeMetadata && Object.keys(metadata).length > 0) {
      formattedMessage.metadata = metadata;
    }

    return formattedMessage;

  } catch (error) {
    logger.error('Error formatting assistant message:', error);
    throw error;
  }
};
