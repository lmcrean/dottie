import { sendMessage as sendMessageApi, sendInitialMessage as sendInitialMessageApi } from './api';
import type { 
  SendMessageRequest, 
  SendMessageResponse,
  SendInitialMessageRequest,
  SendInitialMessageResponse 
} from './api';

export const messageService = {
  /**
   * Send a regular follow-up message to the backend
   */
  async sendMessage(request: SendMessageRequest): Promise<SendMessageResponse> {
    return await sendMessageApi(request);
  },

  /**
   * Send an initial message with assessment context to the backend
   */
  async sendInitialMessage(request: SendInitialMessageRequest): Promise<SendInitialMessageResponse> {
    return await sendInitialMessageApi(request);
  }
}; 