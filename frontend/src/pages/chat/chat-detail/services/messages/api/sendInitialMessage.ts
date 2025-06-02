import { apiClient } from '../../../../../../api/core/apiClient';
import { getUserData } from '../../../../../../api/core/tokenManager';

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

    // Handle possible object as chat_id
    let chatIdString: string;

    if (typeof params.chat_id === 'object' && params.chat_id !== null) {
      // If it's an object, try to extract the ID
      console.log(`[sendInitialMessage] Received object as chat_id:`, params.chat_id);

      if (params.chat_id.id) {
        chatIdString = String(params.chat_id.id);
        console.log(`[sendInitialMessage] Extracted ID from object property: ${chatIdString}`);
      } else if (params.chat_id.conversationId) {
        chatIdString = String(params.chat_id.conversationId);
        console.log(
          `[sendInitialMessage] Extracted conversationId from object property: ${chatIdString}`
        );
      } else if (
        typeof params.chat_id.toString === 'function' &&
        params.chat_id.toString() !== '[object Object]'
      ) {
        chatIdString = params.chat_id.toString();
        console.log(`[sendInitialMessage] Used object's toString(): ${chatIdString}`);
      } else {
        console.error('[sendInitialMessage] Cannot extract valid ID from object:', params.chat_id);
        throw new Error('Invalid chat ID format. Please try again.');
      }
    } else {
      // Normal string handling
      chatIdString = String(params.chat_id);
    }

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