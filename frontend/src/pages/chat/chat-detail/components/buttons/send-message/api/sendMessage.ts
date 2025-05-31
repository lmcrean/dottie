import { apiClient } from '../../../../../../../api/core/apiClient';
import { getUserData } from '../../../../../../../api/core/tokenManager';

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
  try {
    // Get the user data from token manager
    const userData = getUserData();
    if (!userData || !userData.id) {
      console.error('[sendMessage] User ID not found or invalid.');
      throw new Error('User ID not found. Please login again.');
    }

    const requestBody = {
      message: params.message,
      conversationId: params.conversationId
    };

    const response = await apiClient.post<SendMessageResponse>(
      `/api/chat/${params.chat_id}/message`,
      requestBody
    );

    return response.data;
  } catch (error) {
    console.error('[sendMessage] Failed to send message:', error);
    throw error;
  }
};

export default sendMessage;
