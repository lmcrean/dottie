import { apiClient } from '../../../../../../api/core/apiClient';
import { Conversation } from '../utils/types';

/**
 * Get chat conversation history
 * @endpoint /api/chat/history (GET)
 */
export const getHistory = async (): Promise<Conversation[]> => {
  try {
    const response = await apiClient.get('/api/chat/history');
    return response.data.conversations;
  } catch (error) {
    console.error('Failed to get message history:', error);
    throw error;
  }
};

export default getHistory;
