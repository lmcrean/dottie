import { authenticatedPost, normalizeChatId } from '../../shared/apiHelpers';

export interface SendInitialMessageRequest {
  chat_id: string | { id?: string; conversationId?: string; toString?: () => string };
  assessment_id: string;
  message: string;
}

export interface SendInitialMessageResponse {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  assessment_context?: {
    assessment_id: string;
    pattern: string;
    key_findings: string[];
  };
}

/**
 * Send initial message with assessment context
 * @endpoint /api/chat/:chatId/message/initial (POST)
 */
export const sendInitialMessage = async (
  params: SendInitialMessageRequest
): Promise<SendInitialMessageResponse> => {
  const functionName = 'sendInitialMessage';
  
  // Log before API call
  console.log(
    `[${functionName}] Preparing request with chat_id: ${params.chat_id}, type: ${typeof params.chat_id}`
  );

  const chatIdString = normalizeChatId(params.chat_id, functionName);

  // Log converted ID
  console.log(
    `[${functionName}] Converted chat_id: ${chatIdString}, type: ${typeof chatIdString}`
  );

  // Log full request parameters
  console.log(`[${functionName}] Full request params:`, {
    chat_id: chatIdString,
    assessment_id: params.assessment_id,
    message: params.message
  });

  const requestBody = {
    message: params.message,
    assessment_id: params.assessment_id,
    is_initial: true
  };

  const response = await authenticatedPost<typeof requestBody, SendInitialMessageResponse>(
    `/api/chat/${chatIdString}/message/initial`,
    requestBody,
    { functionName }
  );

  // Log response
  console.log(`[${functionName}] Received response:`, response);

  return response;
};

export default sendInitialMessage; 