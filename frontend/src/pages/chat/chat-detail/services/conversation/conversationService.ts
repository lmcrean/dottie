import { conversationApi } from './api';

export const conversationService = {
  /**
   * Fetch conversation data from backend
   */
  async fetchConversation(conversationId: string) {
    return await conversationApi.fetchConversation(conversationId);
  }
}; 