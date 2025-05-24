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

    // Ensure we have a valid response structure
    if (!response || !response.data) {
      console.warn('Invalid response structure from chat history API');
      return STATIC_FALLBACK_CONVERSATION;
    }

    // Check if conversations exist and is an array
    if (response.data.conversations && Array.isArray(response.data.conversations)) {
      return response.data.conversations;
    }

    // If conversations is not an array or doesn't exist, return empty array
    console.warn('Chat history conversations is not an array:', response.data);
    return [];
  } catch (error) {
    console.error('Failed to get message history:', error);

    // Return static placeholder conversation when API calls fail
    return STATIC_FALLBACK_CONVERSATION;
  }
};

export default getHistory;
