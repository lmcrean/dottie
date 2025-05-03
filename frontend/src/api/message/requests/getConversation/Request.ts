import { apiClient } from '../../../core/apiClient';
import { Conversation } from '../../types';

/**
 * Get a specific conversation by ID
 * @endpoint /api/chat/history/:id (GET)
 */
export const getConversation = async (conversationId: string): Promise<Conversation> => {
  try {
    const response = await apiClient.get(`/api/chat/history/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch conversation with ID ${conversationId}:`, error);
    throw error;
  }
};

export default getConversation;
