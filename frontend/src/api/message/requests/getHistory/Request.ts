import { apiClient } from '../../../core/apiClient';
import { Conversation } from '../../types';

/**
 * Get chat history for authenticated user
 * @endpoint /api/chat/history (GET)
 */
export const getHistory = async (): Promise<Conversation[]> => {
  try {
    const response = await apiClient.get('/api/chat/history');
    return response.data;
  } catch (error) {
    console.error('Failed to get message history:', error);
    throw error;
  }
};

export default getHistory;
