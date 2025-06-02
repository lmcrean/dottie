import axios from 'axios';
import { apiClient } from '../../../../api/core/apiClient';
import { ApiMessage, AssessmentData } from '../../types';

export interface ConversationResponse {
  id: string;
  messages: ApiMessage[];
  assessment_id?: string;
  assessment_object?: AssessmentData;
}

export const conversationService = {
  /**
   * Fetch conversation data from backend
   */
  async fetchConversation(conversationId: string): Promise<ConversationResponse | null> {
    try {
      const conversationIdString = String(conversationId);
      const response = await apiClient.get(`/api/chat/history/${conversationIdString}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      console.error('Error fetching conversation:', error);
      throw error;
    }
  }
}; 