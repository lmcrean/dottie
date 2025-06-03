import { authenticatedPost, normalizeChatId } from '../shared/apiHelpers';

// Base interfaces
export interface BaseMessageRequest {
  chat_id: string | { id?: string; conversationId?: string; toString?: () => string };
  message: string;
}

export interface BaseMessageResponse {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

// Specific interfaces
export interface InitialMessageRequest extends BaseMessageRequest {
  assessment_id: string;
}

export interface FollowUpMessageRequest extends BaseMessageRequest {
  chat_id: string; // Simplified for follow-up (no complex object types)
  conversationId?: string;
}

export interface InitialMessageResponse extends BaseMessageResponse {
  assessment_context?: {
    assessment_id: string;
    pattern: string;
    key_findings: string[];
  };
}

export type FollowUpMessageResponse = BaseMessageResponse;

/**
 * Common logging utilities for message operations
 */
const messageLogger = {
  logRequest: (functionName: string, chatId: any, params: any): void => {
    console.log(`[${functionName}] Preparing request with chat_id: ${chatId}, type: ${typeof chatId}`);
    console.log(`[${functionName}] Full request params:`, params);
  },

  logResponse: (functionName: string, response: any): void => {
    console.log(`[${functionName}] Received response:`, response);
  },

  logChatIdConversion: (functionName: string, originalId: any, convertedId: string): void => {
    console.log(`[${functionName}] Converted chat_id: ${convertedId}, type: ${typeof convertedId}`);
  }
};

/**
 * Common message sending logic
 */
async function sendMessageToEndpoint<TRequest, TResponse>(
  endpoint: string,
  requestBody: TRequest,
  functionName: string
): Promise<TResponse> {
  const response = await authenticatedPost<TRequest, TResponse>(
    endpoint,
    requestBody,
    { functionName }
  );

  messageLogger.logResponse(functionName, response);
  return response;
}

/**
 * Send initial message with assessment context
 * @endpoint /api/chat/:chatId/message/initial (POST)
 */
export async function sendInitialMessage(params: InitialMessageRequest): Promise<InitialMessageResponse> {
  const functionName = 'sendInitialMessage';
  
  messageLogger.logRequest(functionName, params.chat_id, {
    chat_id: params.chat_id,
    assessment_id: params.assessment_id,
    message: params.message
  });

  const chatIdString = normalizeChatId(params.chat_id, functionName);
  messageLogger.logChatIdConversion(functionName, params.chat_id, chatIdString);

  const requestBody = {
    message: params.message,
    assessment_id: params.assessment_id,
    is_initial: true
  };

  return sendMessageToEndpoint<typeof requestBody, InitialMessageResponse>(
    `/api/chat/${chatIdString}/message/initial`,
    requestBody,
    functionName
  );
}

/**
 * Send follow-up message in existing conversation
 * @endpoint /api/chat/:chatId/message (POST)
 */
export async function sendMessage(params: FollowUpMessageRequest): Promise<FollowUpMessageResponse> {
  const functionName = 'sendMessage';
  
  messageLogger.logRequest(functionName, params.chat_id, {
    chat_id: params.chat_id,
    message: params.message,
    conversationId: params.conversationId
  });

  const requestBody = {
    message: params.message,
    conversationId: params.conversationId
  };

  return sendMessageToEndpoint<typeof requestBody, FollowUpMessageResponse>(
    `/api/chat/${params.chat_id}/message`,
    requestBody,
    functionName
  );
}

/**
 * Generic message sender that routes to appropriate method based on request type
 */
export async function sendMessageGeneric(
  params: InitialMessageRequest | FollowUpMessageRequest
): Promise<InitialMessageResponse | FollowUpMessageResponse> {
  if ('assessment_id' in params) {
    return sendInitialMessage(params as InitialMessageRequest);
  } else {
    return sendMessage(params as FollowUpMessageRequest);
  }
}

// Backward compatibility type exports
export type {
  InitialMessageRequest as SendInitialMessageRequest,
  InitialMessageResponse as SendInitialMessageResponse,
  FollowUpMessageRequest as SendMessageRequest,
  FollowUpMessageResponse as SendMessageResponse
};

export default {
  sendInitialMessage,
  sendMessage,
  sendMessageGeneric
}; 