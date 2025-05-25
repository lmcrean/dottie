import { apiClient } from '../../../../../../../api/core/apiClient';
import { getUserData } from '../../../../../../../api/core/tokenManager';

export interface SendInitialMessageRequest {
  chat_id: string;
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
  try {
    // Get the user data from token manager
    const userData = getUserData();
    if (!userData || !userData.id) {
      console.error('[sendInitialMessage] User ID not found or invalid.');
      throw new Error('User ID not found. Please login again.');
    }

    const requestBody = {
      message: params.message,
      assessment_id: params.assessment_id,
      is_initial: true
    };

    const response = await apiClient.post<SendInitialMessageResponse>(
      `/api/chat/${params.chat_id}/message/initial`,
      requestBody
    );

    return response.data;
  } catch (error) {
    console.error('[sendInitialMessage] Failed to send initial message:', error);
    throw error;
  }
};

export default sendInitialMessage;
