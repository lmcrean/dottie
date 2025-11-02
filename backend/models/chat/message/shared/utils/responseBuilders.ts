import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a unique message ID
 * @returns Unique message ID
 */
export const generateMessageId = (): string => {
  return uuidv4();
};

/**
 * Response metadata structure
 */
interface ResponseMetadata {
  type?: 'ai' | 'mock' | 'fallback';
  generated_at?: string;
  [key: string]: any;
}

/**
 * Structured response object
 */
interface StructuredResponse {
  content: string;
  metadata: ResponseMetadata;
}

/**
 * Build a structured AI response
 * @param content - Response content
 * @param metadata - Response metadata
 * @returns Structured AI response
 */
export const buildAIResponse = (
  content: string,
  metadata: Record<string, any> = {}
): StructuredResponse => {
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
 * @param content - Fallback content
 * @param metadata - Response metadata
 * @returns Structured fallback response
 */
export const buildFallbackResponse = (
  content: string = "I'm here to help. Could you please rephrase your question?",
  metadata: Record<string, any> = {}
): StructuredResponse => {
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
 * @param content - Mock response content
 * @param metadata - Response metadata
 * @returns Structured mock response
 */
export const buildMockResponse = (
  content: string,
  metadata: Record<string, any> = {}
): StructuredResponse => {
  return {
    content,
    metadata: {
      type: 'mock',
      generated_at: new Date().toISOString(),
      ...metadata
    }
  };
};
