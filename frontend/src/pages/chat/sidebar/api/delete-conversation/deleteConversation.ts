import { apiClient } from '../../../../../api/core/apiClient';

/**
 * Delete a specific conversation
 * @endpoint /api/chat/history/:id (DELETE)
 */
export const deleteConversation = async (conversationId: string): Promise<void> => {
  try {
    await apiClient.delete(`/api/chat/history/${conversationId}`);
  } catch (error) {
    console.error(`Failed to delete conversation with ID ${conversationId}:`, error);
    throw error;
  }
};

export default deleteConversation;
