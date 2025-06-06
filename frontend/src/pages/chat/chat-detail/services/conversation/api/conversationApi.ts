import { authenticatedGet } from '../../shared/apiHelpers';
import { ApiMessage, AssessmentData } from '../../../../types';

export interface ConversationResponse {
  id: string;
  messages: ApiMessage[];
  assessment_id?: string;
  assessment_object?: AssessmentData;
}

export const conversationApi = {
  /**
   * Fetch conversation data from backend
   */
  async fetchConversation(conversationId: string): Promise<ConversationResponse | null> {
    const conversationIdString = String(conversationId);
    return await authenticatedGet<ConversationResponse>(
      `/api/chat/history/${conversationIdString}`,
      { 
        requireAuth: false, // Conversation fetching doesn't require auth check
        handle404AsNull: true,
        functionName: 'fetchConversation'
      }
    );
  }
}; 