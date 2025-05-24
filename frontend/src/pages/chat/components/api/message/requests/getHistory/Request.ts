import { apiClient } from '../../../../../../../api/core/apiClient';
import { Conversation } from '../../types';

// Static fallback conversation for when environment variables aren't available
const STATIC_FALLBACK_CONVERSATION: Conversation[] = [
  {
    id: 'static-placeholder-id',
    messages: [
      {
        role: 'user',
        content: 'Hello',
        timestamp: new Date().toISOString()
      },
      {
        role: 'assistant',
        content:
          "Hi there! 👋 I'm Dottie. This is a static frontend placeholder message because the backend environment credentials (.env file) are not configured. To use the full chat functionality, please set up the required environment variables.",
        timestamp: new Date().toISOString()
      }
    ],
    lastMessageDate: new Date().toISOString(),
    preview: "Hi there! 👋 I'm Dottie. This is a static..."
  }
];

/**
 * Get chat history for authenticated user
 * @endpoint /api/chat/history (GET)
 */
export const getHistory = async (): Promise<Conversation[]> => {
  try {
    const response = await apiClient.get('/api/chat/history');
    return response.data.conversations || [];
  } catch (error) {
    console.error('Failed to get message history:', error);

    // Return static placeholder conversation when API calls fail
    return STATIC_FALLBACK_CONVERSATION;
  }
};

export default getHistory;
