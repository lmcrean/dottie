import { apiClient } from '../../../../../../api/core/apiClient';
import { Conversation } from '../utils/types';

/**
 * Get chat conversation history
 * @endpoint /api/message/history (GET)
 */
export const getHistory = async (): Promise<Conversation[]> => {
  try {
    const response = await apiClient.get('/api/message/history');
    return response.data;
  } catch (error) {
    console.error('Failed to get message history:', error);
    throw error;
  }
};

export default getHistory;
