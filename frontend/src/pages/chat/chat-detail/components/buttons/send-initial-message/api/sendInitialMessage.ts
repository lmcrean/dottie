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

    // Log before API call
    console.log(
      `[sendInitialMessage] Preparing request with chat_id: ${params.chat_id}, type: ${typeof params.chat_id}`
    );

    // Ensure chat_id is a string
    const chatIdString = String(params.chat_id);

    // Log converted ID
    console.log(
      `[sendInitialMessage] Converted chat_id: ${chatIdString}, type: ${typeof chatIdString}`
    );

    // Log full request parameters
    console.log(`[sendInitialMessage] Full request params:`, {
      chat_id: chatIdString,
      assessment_id: params.assessment_id,
      message: params.message
    });

    const requestBody = {
      message: params.message,
      assessment_id: params.assessment_id,
      is_initial: true
    };

    const response = await apiClient.post<SendInitialMessageResponse>(
      `/api/chat/${chatIdString}/message/initial`,
      requestBody
    );

    // Log response
    console.log(`[sendInitialMessage] Received response:`, response.data);

    return response.data;
  } catch (error) {
    console.error('[sendInitialMessage] Failed to send initial message:', error);
    throw error;
  }
};

export default sendInitialMessage;
