import { apiClient } from '../../../core/apiClient';
import { ApiMessage, ChatResponse } from '../../types';

/**
 * Send a message to the chat API
 * @endpoint /api/chat/send (POST)
 */
export const sendMessage = async (
  message: string,
  conversationId?: string
): Promise<ChatResponse> => {
  try {
    const response = await apiClient.post('/api/chat/send', message);
    return response.data;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};

export default sendMessage;
