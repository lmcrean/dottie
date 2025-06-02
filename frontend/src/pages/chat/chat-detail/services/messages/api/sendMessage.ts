import { authenticatedPost } from '../../shared/apiHelpers';

export interface SendMessageRequest {
  chat_id: string;
  message: string;
  conversationId?: string;
}

export interface SendMessageResponse {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

/**
 * Send a follow-up message in an existing chat conversation
 * @endpoint /api/chat/:chatId/message (POST)
 */
export const sendMessage = async (params: SendMessageRequest): Promise<SendMessageResponse> => {
  const requestBody = {
    message: params.message,
    conversationId: params.conversationId
  };

  return await authenticatedPost<typeof requestBody, SendMessageResponse>(
    `/api/chat/${params.chat_id}/message`,
    requestBody,
    { functionName: 'sendMessage' }
  );
};

export default sendMessage; 