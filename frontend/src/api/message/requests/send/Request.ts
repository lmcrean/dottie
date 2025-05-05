import { apiClient } from '../../../core/apiClient';
import { ChatResponse } from '../../types';

// Static fallback message when environment variables aren't available
const STATIC_FALLBACK_MESSAGE =
  "Hi there! 👋 I'm Dottie. This is a static frontend placeholder message because the backend environment credentials (.env file) are not configured. To use the full chat functionality, please set up the required environment variables.";

/**
 * Send a message to the chat API
 * @endpoint /api/chat/send (POST)
 */
export const sendMessage = async (message: string): Promise<ChatResponse> => {
  try {
    const response = await apiClient.post('/api/chat/send', message);
    return response.data;
  } catch (error) {
    console.error('Failed to send message:', error);

    // Return a static placeholder message when API calls fail
    // This allows developers to still use the app without the .env credentials
    return {
      message: STATIC_FALLBACK_MESSAGE,
      conversationId: 'static-placeholder-id'
    };
  }
};

export default sendMessage;
