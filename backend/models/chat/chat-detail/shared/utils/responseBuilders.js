import { v4 as uuidv4 } from 'uuid';
import logger from '../../../../../services/logger.js';

/**
 * Generate a unique message ID
 * @returns {string} - Unique message ID
 */
export const generateMessageId = () => {
  return uuidv4();
};

/**
 * Build a standardized response object
 * @param {string} content - Response content
 * @param {Object} [metadata] - Additional metadata
 * @param {Object} [options] - Response options
 * @returns {Object} - Standardized response
 */
export const buildResponse = (content, metadata = {}, options = {}) => {
  const {
    type = 'text',
    source = 'system',
    confidence = null,
    includeTimestamp = true
  } = options;

  try {
    const response = {
      content,
      type,
      source
    };

    // Add metadata if provided
    if (Object.keys(metadata).length > 0) {
      response.metadata = metadata;
    }

    // Add confidence score if provided
    if (confidence !== null) {
      response.confidence = confidence;
    }

    // Add timestamp if requested
    if (includeTimestamp) {
      response.timestamp = new Date().toISOString();
    }

    // Generate response ID
    response.id = generateMessageId();

    return response;

  } catch (error) {
    logger.error('Error building response:', error);
    throw error;
  }
};

/**
 * Build an AI response with metadata
 * @param {string} content - AI response content
 * @param {Object} [aiMetadata] - AI-specific metadata
 * @returns {Object} - AI response object
 */
export const buildAIResponse = (content, aiMetadata = {}) => {
  const metadata = {
    ...aiMetadata,
    service: 'ai',
    model: aiMetadata.model || 'gemini-pro',
    tokens_used: aiMetadata.tokens_used || null,
    response_time: aiMetadata.response_time || null
  };

  return buildResponse(content, metadata, {
    type: 'text',
    source: 'ai',
    confidence: aiMetadata.confidence || null
  });
};

/**
 * Build a mock response with metadata
 * @param {string} content - Mock response content
 * @param {Object} [mockMetadata] - Mock-specific metadata
 * @returns {Object} - Mock response object
 */
export const buildMockResponse = (content, mockMetadata = {}) => {
  const metadata = {
    ...mockMetadata,
    service: 'mock',
    pattern_matched: mockMetadata.pattern_matched || null,
    keyword_matched: mockMetadata.keyword_matched || null,
    response_category: mockMetadata.response_category || 'general'
  };

  return buildResponse(content, metadata, {
    type: 'text',
    source: 'mock',
    confidence: 1.0 // Mock responses always have full confidence
  });
};

/**
 * Build an error response
 * @param {string} errorMessage - Error message
 * @param {string} [errorCode] - Error code
 * @param {Object} [context] - Error context
 * @returns {Object} - Error response object
 */
export const buildErrorResponse = (errorMessage, errorCode = null, context = {}) => {
  const metadata = {
    ...context,
    error: true,
    error_code: errorCode,
    error_timestamp: new Date().toISOString()
  };

  return buildResponse(errorMessage, metadata, {
    type: 'error',
    source: 'system',
    confidence: null,
    includeTimestamp: true
  });
};

/**
 * Build a fallback response when other services fail
 * @param {string} [fallbackMessage] - Custom fallback message
 * @returns {Object} - Fallback response object
 */
export const buildFallbackResponse = (fallbackMessage = null) => {
  const defaultMessage = "I apologize, but I'm having trouble generating a response right now. Please try again in a moment.";
  
  const metadata = {
    service: 'fallback',
    is_fallback: true,
    fallback_reason: 'service_unavailable'
  };

  return buildResponse(fallbackMessage || defaultMessage, metadata, {
    type: 'text',
    source: 'system',
    confidence: 0.5
  });
};

/**
 * Build a typing indicator response
 * @param {number} [estimatedDelay] - Estimated response delay in ms
 * @returns {Object} - Typing indicator response
 */
export const buildTypingResponse = (estimatedDelay = null) => {
  const metadata = {
    service: 'system',
    is_typing: true,
    estimated_delay: estimatedDelay
  };

  return buildResponse('...', metadata, {
    type: 'typing',
    source: 'system',
    confidence: null
  });
};

/**
 * Build a response with assessment context
 * @param {string} content - Response content
 * @param {string} assessmentPattern - Assessment pattern
 * @param {Object} [metadata] - Additional metadata
 * @returns {Object} - Assessment-aware response
 */
export const buildAssessmentResponse = (content, assessmentPattern, metadata = {}) => {
  const enhancedMetadata = {
    ...metadata,
    assessment_pattern: assessmentPattern,
    context_aware: true,
    has_assessment_context: true
  };

  return buildResponse(content, enhancedMetadata, {
    type: 'text',
    source: metadata.source || 'ai',
    confidence: metadata.confidence || null
  });
};

/**
 * Combine multiple response parts into a single response
 * @param {Array<Object>} responseParts - Array of response parts
 * @param {string} [separator] - Separator between parts
 * @returns {Object} - Combined response
 */
export const combineResponses = (responseParts, separator = '\n\n') => {
  try {
    if (!responseParts || responseParts.length === 0) {
      throw new Error('No response parts provided');
    }

    const combinedContent = responseParts
      .map(part => part.content)
      .join(separator);

    // Merge metadata from all parts
    const combinedMetadata = responseParts.reduce((acc, part) => {
      if (part.metadata) {
        return { ...acc, ...part.metadata };
      }
      return acc;
    }, {});

    // Add combination info
    combinedMetadata.is_combined = true;
    combinedMetadata.part_count = responseParts.length;
    combinedMetadata.combined_at = new Date().toISOString();

    return buildResponse(combinedContent, combinedMetadata, {
      type: 'text',
      source: 'system',
      confidence: Math.min(...responseParts.map(p => p.confidence || 1))
    });

  } catch (error) {
    logger.error('Error combining responses:', error);
    throw error;
  }
};

/**
 * Build a conversation summary response
 * @param {Object} summary - Conversation summary data
 * @returns {Object} - Summary response
 */
export const buildSummaryResponse = (summary) => {
  const metadata = {
    service: 'system',
    is_summary: true,
    summary_data: summary
  };

  const summaryText = `Conversation Summary:
- Messages: ${summary.total_messages || 0}
- Started: ${summary.first_message_at || 'Unknown'}
- Last activity: ${summary.last_message_at || 'Unknown'}`;

  return buildResponse(summaryText, metadata, {
    type: 'summary',
    source: 'system',
    confidence: 1.0
  });
}; 