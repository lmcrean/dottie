import logger from '../../../../../services/logger.js';

/**
 * Format user message for consistency and validation
 * @param {string} content - Message content
 * @param {string} userId - User ID
 * @param {Object} [options] - Formatting options
 * @returns {Object} - Formatted user message
 */
export const formatUserMessage = (content, userId, options = {}) => {
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

/**
 * Format assistant message for consistency
 * @param {string} content - Message content
 * @param {Object} [metadata] - Additional metadata
 * @param {Object} [options] - Formatting options
 * @returns {Object} - Formatted assistant message
 */
export const formatAssistantMessage = (content, metadata = {}, options = {}) => {
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

    const formattedMessage = {
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

/**
 * Format message for display (frontend-ready)
 * @param {Object} message - Raw message from database
 * @param {Object} [options] - Display options
 * @returns {Object} - Display-ready message
 */
export const formatMessageForDisplay = (message, options = {}) => {
  const { 
    includeTimestamps = true,
    includeMetadata = false,
    truncateLength = null 
  } = options;

  try {
    let content = message.content || '';
    
    // Truncate if requested
    if (truncateLength && content.length > truncateLength) {
      content = content.substring(0, truncateLength) + '...';
    }

    const formattedMessage = {
      id: message.id,
      role: message.role,
      content: content,
      user_id: message.user_id || null
    };

    // Add timestamps if requested
    if (includeTimestamps) {
      formattedMessage.timestamp = message.created_at;
      if (message.edited_at) {
        formattedMessage.edited_at = message.edited_at;
        formattedMessage.was_edited = true;
      }
    }

    // Add metadata if requested and available
    if (includeMetadata && message.metadata) {
      formattedMessage.metadata = message.metadata;
    }

    return formattedMessage;

  } catch (error) {
    logger.error('Error formatting message for display:', error);
    throw error;
  }
};

/**
 * Format conversation messages for AI processing
 * @param {Array} messages - Array of messages
 * @param {Object} [options] - Processing options
 * @returns {Array} - AI-ready message format
 */
export const formatMessagesForAI = (messages, options = {}) => {
  const { 
    includeSystemMessage = false,
    systemMessage = null,
    maxHistory = 50 
  } = options;

  try {
    // Filter and sort messages
    let processedMessages = messages
      .filter(msg => msg.role === 'user' || msg.role === 'assistant')
      .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      .slice(-maxHistory); // Keep only recent messages

    // Format for AI
    processedMessages = processedMessages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    // Add system message if requested
    if (includeSystemMessage && systemMessage) {
      processedMessages.unshift({
        role: 'system',
        content: systemMessage
      });
    }

    return processedMessages;

  } catch (error) {
    logger.error('Error formatting messages for AI:', error);
    throw error;
  }
};

/**
 * Validate message content
 * @param {string} content - Message content to validate
 * @param {Object} [rules] - Validation rules
 * @returns {Object} - Validation result
 */
export const validateMessageContent = (content, rules = {}) => {
  const {
    minLength = 1,
    maxLength = 4000,
    allowEmpty = false,
    blockedPatterns = [],
    requiredPatterns = []
  } = rules;

  const result = {
    isValid: true,
    errors: [],
    warnings: []
  };

  try {
    // Check if content exists
    if (!content && !allowEmpty) {
      result.isValid = false;
      result.errors.push('Message content cannot be empty');
      return result;
    }

    if (content) {
      // Length checks
      if (content.length < minLength) {
        result.isValid = false;
        result.errors.push(`Message too short (minimum ${minLength} characters)`);
      }

      if (content.length > maxLength) {
        result.isValid = false;
        result.errors.push(`Message too long (maximum ${maxLength} characters)`);
      }

      // Check blocked patterns
      for (const pattern of blockedPatterns) {
        if (new RegExp(pattern, 'i').test(content)) {
          result.isValid = false;
          result.errors.push('Message contains blocked content');
          break;
        }
      }

      // Check required patterns
      for (const pattern of requiredPatterns) {
        if (!new RegExp(pattern, 'i').test(content)) {
          result.warnings.push(`Message should contain: ${pattern}`);
        }
      }
    }

    return result;

  } catch (error) {
    logger.error('Error validating message content:', error);
    result.isValid = false;
    result.errors.push('Validation error occurred');
    return result;
  }
}; 