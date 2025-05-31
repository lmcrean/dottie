import axios from 'axios';

export class ChatApiService {
  /**
   * Sends a message to the chat API
   * @param message The message text to send
   * @param conversationId Optional conversation ID for continuing a conversation
   * @returns The API response data
   */
  async sendMessage(message: string, conversationId?: string) {
    try {
      const response = await axios.post('/api/chat/send', {
        message,
        conversationId
      });
      return response.data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Fetches the conversation history list
   * @returns List of conversations
   */
  async getConversationHistory() {
    try {
      const response = await axios.get('/api/chat/history');
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      throw error;
    }
  }

  /**
   * Fetches messages for a specific conversation
   * @param conversationId The ID of the conversation to fetch
   * @returns The conversation data with messages
   */
  async getConversationMessages(conversationId: string) {
    try {
      const response = await axios.get(`/api/chat/history/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
      throw error;
    }
  }

  /**
   * Deletes a conversation
   * @param conversationId The ID of the conversation to delete
   * @returns The API response data
   */
  async deleteConversation(conversationId: string) {
    try {
      const response = await axios.delete(`/api/chat/history/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  }
}
