import { apiClient } from '../../../../../../api/core/apiClient';
import { getUserData } from '../../../../../../api/core/tokenManager';

export interface CreateChatRequest {
  assessment_id?: string;
  initial_message?: string;
}

export interface CreateChatResponse {
  id: string;
  user_id: string;
  assessment_id?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Create a new chat conversation
 * @endpoint /api/chat (POST)
 */
export const createNewChat = async (params?: CreateChatRequest): Promise<CreateChatResponse> => {
  console.log(`[createNewChat] Creating new chat with params:`, params);

  try {
    // Get the user data from token manager
    const userData = getUserData();
    if (!userData || !userData.id) {
      console.error('[createNewChat] User ID not found or invalid.');
      throw new Error('User ID not found. Please login again.');
    }

    const requestBody = {
      assessment_id: params?.assessment_id,
      initial_message: params?.initial_message
    };

    console.log(`[createNewChat] User ID ${userData.id} found. Creating chat with:`, requestBody);

    const response = await apiClient.post<CreateChatResponse>('/api/chat', requestBody);

    console.log('[createNewChat] Successfully created chat:', response.data);
    return response.data;
  } catch (error) {
    console.error('[createNewChat] Failed to create new chat:', error);
    throw error;
  }
};

export default createNewChat;
