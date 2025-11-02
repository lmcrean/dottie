/**
 * Type declarations for responseBuilders
 * Re-exports types from responseBuilders.ts for .js imports
 */

export interface ResponseMetadata {
  type?: 'ai' | 'mock' | 'fallback';
  generated_at?: string;
  [key: string]: any;
}

export interface StructuredResponse {
  content: string;
  metadata: ResponseMetadata;
}

export function generateMessageId(): string;
export function buildAIResponse(content: string, metadata?: Record<string, any>): StructuredResponse;
export function buildFallbackResponse(content?: string, metadata?: Record<string, any>): StructuredResponse;
export function buildMockResponse(content: string, metadata?: Record<string, any>): StructuredResponse;
