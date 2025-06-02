import { sendMessage as sendMessageApi } from '../components/buttons/send-message';

export interface SendMessageRequest {
  chat_id: string;
  message: string;
  conversationId: string;
}

export interface SendMessageResponse {
  content: string;
}

export const messageService = {
  /**
   * Send a message to the backend
   */
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    return await sendMessageApi(request);
  }
}; 