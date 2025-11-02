/**
 * Chat Model Type Definitions
 * Comprehensive types for conversations, messages, and chat operations
 */

// ===================================
// CORE ENTITY TYPES
// ===================================

/**
 * Message role enumeration
 */
export type MessageRole = 'user' | 'assistant' | 'system';

/**
 * Database record for a conversation
 */
export interface ConversationRecord {
  id: number | string;
  user_id: number | string;
  assessment_id?: number | string | null;
  preview?: string | null;
  created_at: Date | string;
  updated_at: Date | string;
  deleted_at?: Date | string | null;
}

/**
 * Database record for a message
 */
export interface MessageRecord {
  id: number | string;
  conversation_id: number | string;
  user_id: number | string;
  role: MessageRole;
  content: string;
  parent_message_id?: number | string | null;
  created_at: Date | string;
  updated_at: Date | string;
  edited_at?: Date | string | null;
  deleted_at?: Date | string | null;
}

/**
 * Conversation with enriched data (assessment object and pattern)
 */
export interface ConversationData extends ConversationRecord {
  assessment_object?: any | null;
  assessment_pattern?: string | null;
}

// ===================================
// INPUT TYPES
// ===================================

/**
 * Input for creating a new conversation
 */
export interface CreateConversationInput {
  user_id: number | string;
  assessment_id?: number | string | null;
}

/**
 * Input for creating a new message
 */
export interface CreateMessageInput {
  conversation_id: number | string;
  user_id: number | string;
  role: MessageRole;
  content: string;
  parent_message_id?: number | string | null;
}

/**
 * Input for sending a user message
 */
export interface SendUserMessageInput {
  conversation_id: number | string;
  user_id: number | string;
  content: string;
  parent_message_id?: number | string | null;
}

/**
 * Input for message flow
 */
export interface MessageFlowInput {
  userId: number | string;
  message: string;
  conversationId?: number | string | null;
  assessmentId?: number | string | null;
}

// ===================================
// RESPONSE TYPES
// ===================================

/**
 * Response from creating a conversation
 */
export interface CreateConversationResponse {
  success: boolean;
  conversationId: number | string;
  assessmentId?: number | string | null;
  conversation?: ConversationData;
  error?: string;
}

/**
 * Response from message operations
 */
export interface MessageResponse {
  success: boolean;
  message?: MessageRecord;
  error?: string;
}

/**
 * Response from message flow (contains both user and assistant messages)
 */
export interface MessageExchangeResponse {
  success: boolean;
  userMessage?: MessageRecord;
  assistantMessage?: MessageRecord;
  conversationId?: number | string;
  error?: string;
}

/**
 * Conversation summary with statistics
 */
export interface ConversationSummary {
  id: number | string;
  user_id: number | string;
  assessment_id?: number | string | null;
  assessment_pattern?: string | null;
  preview?: string | null;
  created_at: Date | string;
  updated_at: Date | string;
  message_count?: number;
  last_message_at?: Date | string;
  last_message_date?: Date | string; // Alias for last_message_at for backward compatibility
}

/**
 * List of conversations response
 */
export interface ConversationsListResponse {
  success: boolean;
  conversations?: ConversationSummary[];
  count?: number;
  error?: string;
}

// ===================================
// VALIDATION TYPES
// ===================================

/**
 * Basic validation result with single error
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Extended validation result with multiple errors and context
 */
export interface ExtendedValidationResult {
  isValid: boolean;
  errors: string[];
  context?: string;
  warnings?: string[];
}

/**
 * Combined validation result with counts
 */
export interface CombinedValidationResult extends ExtendedValidationResult {
  validationCount?: number;
}

/**
 * Validation result for message content
 */
export interface MessageValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}

/**
 * Validation result for conversation data
 */
export interface ConversationValidationResult {
  valid: boolean;
  errors?: string[];
  conversationExists?: boolean;
  userOwnsConversation?: boolean;
}

// ===================================
// QUERY OPTIONS
// ===================================

/**
 * Options for querying conversations
 */
export interface ConversationQueryOptions {
  user_id?: number | string;
  assessment_id?: number | string;
  include_deleted?: boolean;
  order_by?: 'created_at' | 'updated_at';
  order_direction?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Options for querying messages
 */
export interface MessageQueryOptions {
  conversation_id?: number | string;
  user_id?: number | string;
  role?: MessageRole;
  parent_message_id?: number | string | null;
  include_deleted?: boolean;
  order_by?: 'created_at' | 'updated_at';
  order_direction?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// ===================================
// AI/CHATBOT TYPES
// ===================================

/**
 * Context for AI response generation
 */
export interface AIResponseContext {
  conversation_id: number | string;
  user_id: number | string;
  message_history?: MessageRecord[];
  assessment_data?: any;
  system_prompt?: string;
}

/**
 * Configuration for AI service
 */
export interface AIServiceConfig {
  provider: 'anthropic' | 'mock';
  model?: string;
  max_tokens?: number;
  temperature?: number;
}

/**
 * Response from AI service
 */
export interface AIResponse {
  content: string;
  metadata?: {
    model?: string;
    tokens_used?: number;
    finish_reason?: string;
  };
}

// ===================================
// UPDATE TYPES
// ===================================

/**
 * Update data for conversation
 */
export interface ConversationUpdateData {
  assessment_id?: number | string | null;
  preview?: string | null;
  updated_at?: Date | string;
}

/**
 * Update data for message
 */
export interface MessageUpdateData {
  content?: string;
  edited_at?: Date | string;
  updated_at?: Date | string;
}

// ===================================
// DELETE OPTIONS
// ===================================

/**
 * Options for deleting conversations
 */
export interface DeleteConversationOptions {
  hard_delete?: boolean; // Permanent deletion vs soft delete
  cascade?: boolean; // Delete associated messages
}

/**
 * Options for deleting messages
 */
export interface DeleteMessageOptions {
  hard_delete?: boolean;
  delete_children?: boolean; // Delete child messages in thread
}

// ===================================
// PREVIEW TYPES
// ===================================

/**
 * Conversation preview data
 */
export interface ConversationPreview {
  conversation_id: number | string;
  preview_text: string;
  last_message_at: Date | string;
  message_count: number;
}

/**
 * Hook data for updating conversation preview
 */
export interface PreviewHookData {
  conversation_id: number | string;
  latest_message: string;
  timestamp: Date | string;
}

// ===================================
// ERROR TYPES
// ===================================

/**
 * Chat-specific error types
 */
export type ChatErrorType =
  | 'CONVERSATION_NOT_FOUND'
  | 'MESSAGE_NOT_FOUND'
  | 'UNAUTHORIZED_ACCESS'
  | 'INVALID_MESSAGE_CONTENT'
  | 'INVALID_CONVERSATION_ID'
  | 'AI_SERVICE_ERROR'
  | 'DATABASE_ERROR'
  | 'VALIDATION_ERROR';

/**
 * Structured error for chat operations
 */
export interface ChatError {
  type: ChatErrorType;
  message: string;
  details?: any;
  timestamp: Date | string;
}

// ===================================
// EXPORT ALL TYPES
// ===================================

export type {
  // Re-export for convenience
  MessageRole as Role,
  ConversationRecord as Conversation,
  MessageRecord as Message,
};
