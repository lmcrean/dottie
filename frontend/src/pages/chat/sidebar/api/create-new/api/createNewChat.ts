import { apiClient } from '../../../../../../api/core/apiClient';
import { getUserData } from '../../../../../../api/core/tokenManager';

export interface CreateChatRequest {
  assessment_id?: string;
  initial_message?: string;
}

export interface CreateChatResponse {
  id: string | { id?: string; conversationId?: string; toString?: () => string };
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
  try {
    // Get the user data from token manager
    const userData = getUserData();
    if (!userData || !userData.id) {
      console.error('[createNewChat] User ID not found or invalid.');
      throw new Error('User ID not found. Please login again.');
    }

    // Log before API call
    console.log(`[createNewChat] Preparing to create chat with params:`, {
      assessment_id: params?.assessment_id,
      assessment_id_type: params?.assessment_id ? typeof params.assessment_id : 'undefined',
      has_initial_message: !!params?.initial_message
    });

    // Ensure assessment_id is a string if it exists
    const assessmentIdString = params?.assessment_id ? String(params.assessment_id) : undefined;

    // Log converted ID
    console.log(
      `[createNewChat] Converted assessment_id: ${assessmentIdString}, type: ${assessmentIdString ? typeof assessmentIdString : 'undefined'}`
    );

    const requestBody = {
      assessment_id: assessmentIdString,
      initial_message: params?.initial_message
    };

    // Log request payload
    console.log(`[createNewChat] Request payload:`, requestBody);

    const response = await apiClient.post<CreateChatResponse>('/api/chat', requestBody);

    // Log response with more details
    console.log(`[createNewChat] Received response:`, {
      id: response.data.id,
      id_type: typeof response.data.id,
      id_is_object: typeof response.data.id === 'object',
      id_string_representation: String(response.data.id),
      user_id: response.data.user_id,
      assessment_id: response.data.assessment_id
    });

    return response.data;
  } catch (error) {
    console.error('[createNewChat] Failed to create new chat:', error);
    throw error;
  }
};

export default createNewChat;
