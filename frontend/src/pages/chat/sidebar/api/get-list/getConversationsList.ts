import { apiClient } from '../../../../../api/core/apiClient';
import { ConversationListItem } from '../../../types';
/** * Get chat conversation history for sidebar display * @endpoint /api/chat/history (GET) */ export const getConversationsList =
  async (): Promise<ConversationListItem[]> => {
    try {
      const response = await apiClient.get('/api/chat/history');
      return response.data.conversations;
    } catch (error) {
      console.error('Failed to get conversations list:', error);
      throw error;
    }
  };

export default getConversationsList;
