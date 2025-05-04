import { apiClient } from '../../core/apiClient';
import { ApiMessage, ChatResponse } from '../utils/types';

/**
 * Send a message to the chat API
 * @endpoint /api/message/send (POST)
 */
export const sendMessage = async (message: ApiMessage): Promise<ChatResponse> => {
  try {
    const response = await apiClient.post('/api/message/send', message);
    return response.data;
  } catch (error) {
    console.error('Failed to send message:', error);
    throw error;
  }
};

export default sendMessage;
