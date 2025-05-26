import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique message ID
 * @returns {string} - Unique message ID
 */
export const generateMessageId = () => {
  return uuidv4();
};

/**
 * Build a structured AI response
 * @param {string} content - Response content
 * @param {Object} metadata - Response metadata
 * @returns {Object} - Structured AI response
 */
export const buildAIResponse = (content, metadata = {}) => {
  return {
    content,
    metadata: {
      type: 'ai',
      generated_at: new Date().toISOString(),
      ...metadata
    }
  };
};

/**
 * Build a fallback response
 * @param {string} content - Fallback content
 * @param {Object} metadata - Response metadata
 * @returns {Object} - Structured fallback response
 */
export const buildFallbackResponse = (content = "I'm here to help. Could you please rephrase your question?", metadata = {}) => {
  return {
    content,
    metadata: {
      type: 'fallback',
      generated_at: new Date().toISOString(),
      ...metadata
    }
  };
};

/**
 * Build a mock response
 * @param {string} content - Mock response content
 * @param {Object} metadata - Response metadata
 * @returns {Object} - Structured mock response
 */
export const buildMockResponse = (content, metadata = {}) => {
  return {
    content,
    metadata: {
      type: 'mock',
      generated_at: new Date().toISOString(),
      ...metadata
    }
  };
}; 