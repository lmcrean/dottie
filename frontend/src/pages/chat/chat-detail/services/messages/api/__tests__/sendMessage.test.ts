import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendMessage } from '../sendMessage';
import type { SendMessageRequest } from '../sendMessage';
import { apiClient } from '../../../../../../../api/core/apiClient';
import { getUserData } from '../../../../../../../api/core/tokenManager';

// Mock the dependencies
vi.mock('../../../../../../../api/core/apiClient', () => ({
  apiClient: {
    post: vi.fn()
  }
}));

vi.mock('../../../../../../../api/core/tokenManager', () => ({
  getUserData: vi.fn()
}));

describe('sendMessage', () => {
  const mockApiClient = vi.mocked(apiClient);
  const mockGetUserData = vi.mocked(getUserData);

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful user data
    mockGetUserData.mockReturnValue({ id: 'user-123', email: 'test@example.com' });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('successful API calls', () => {
    it('should send message with required parameters', async () => {
      const mockResponse = {
        data: {
          id: 'msg-456',
          chat_id: 'chat-123',
          role: 'user' as const,
          content: 'Follow-up message',
          created_at: '2024-01-01T00:00:00Z'
        }
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const request: SendMessageRequest = {
        chat_id: 'chat-123',
        message: 'Follow-up message'
      };

      const result = await sendMessage(request);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/api/chat/chat-123/message',
        {
          message: 'Follow-up message',
          conversationId: undefined
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should send message with conversationId', async () => {
      const mockResponse = {
        data: {
          id: 'msg-789',
          chat_id: 'chat-456',
          role: 'user' as const,
          content: 'Message with conversation ID',
          created_at: '2024-01-01T00:00:00Z'
        }
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const request: SendMessageRequest = {
        chat_id: 'chat-456',
        message: 'Message with conversation ID',
        conversationId: 'conv-789'
      };

      const result = await sendMessage(request);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/api/chat/chat-456/message',
        {
          message: 'Message with conversation ID',
          conversationId: 'conv-789'
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle numeric chat_id', async () => {
      const mockResponse = {
        data: {
          id: 'msg-123',
          chat_id: '999',
          role: 'user' as const,
          content: 'Test message',
          created_at: '2024-01-01T00:00:00Z'
        }
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const request: SendMessageRequest = {
        chat_id: '999',
        message: 'Test message'
      };

      const result = await sendMessage(request);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/api/chat/999/message',
        {
          message: 'Test message',
          conversationId: undefined
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('error handling', () => {
    it('should throw error when user data is not available', async () => {
      mockGetUserData.mockReturnValue(null);

      const request: SendMessageRequest = {
        chat_id: 'chat-123',
        message: 'Test message'
      };

      await expect(sendMessage(request)).rejects.toThrow(
        'User ID not found. Please login again.'
      );

      expect(mockApiClient.post).not.toHaveBeenCalled();
    });

    it('should throw error when user ID is missing', async () => {
      mockGetUserData.mockReturnValue({ email: 'test@example.com' } as any);

      const request: SendMessageRequest = {
        chat_id: 'chat-123',
        message: 'Test message'
      };

      await expect(sendMessage(request)).rejects.toThrow(
        'User ID not found. Please login again.'
      );

      expect(mockApiClient.post).not.toHaveBeenCalled();
    });

    it('should handle API client errors', async () => {
      const apiError = new Error('Server error');
      mockApiClient.post.mockRejectedValue(apiError);

      const request: SendMessageRequest = {
        chat_id: 'chat-123',
        message: 'Test message'
      };

      await expect(sendMessage(request)).rejects.toThrow('Server error');

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/api/chat/chat-123/message',
        {
          message: 'Test message',
          conversationId: undefined
        }
      );
    });

    it('should handle network timeout errors', async () => {
      const timeoutError = new Error('Request timeout');
      mockApiClient.post.mockRejectedValue(timeoutError);

      const request: SendMessageRequest = {
        chat_id: 'chat-123',
        message: 'Test message',
        conversationId: 'conv-456'
      };

      await expect(sendMessage(request)).rejects.toThrow('Request timeout');

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/api/chat/chat-123/message',
        {
          message: 'Test message',
          conversationId: 'conv-456'
        }
      );
    });
  });

  describe('parameter validation', () => {
    it('should handle empty message', async () => {
      const mockResponse = {
        data: {
          id: 'msg-123',
          chat_id: 'chat-123',
          role: 'user' as const,
          content: '',
          created_at: '2024-01-01T00:00:00Z'
        }
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const request: SendMessageRequest = {
        chat_id: 'chat-123',
        message: ''
      };

      const result = await sendMessage(request);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/api/chat/chat-123/message',
        {
          message: '',
          conversationId: undefined
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle long messages', async () => {
      const longMessage = 'A'.repeat(1000);
      const mockResponse = {
        data: {
          id: 'msg-123',
          chat_id: 'chat-123',
          role: 'user' as const,
          content: longMessage,
          created_at: '2024-01-01T00:00:00Z'
        }
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const request: SendMessageRequest = {
        chat_id: 'chat-123',
        message: longMessage
      };

      const result = await sendMessage(request);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/api/chat/chat-123/message',
        {
          message: longMessage,
          conversationId: undefined
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle special characters in message', async () => {
      const specialMessage = 'Hello! 🎉 How are you? @user #hashtag $money 100% great!';
      const mockResponse = {
        data: {
          id: 'msg-123',
          chat_id: 'chat-123',
          role: 'user' as const,
          content: specialMessage,
          created_at: '2024-01-01T00:00:00Z'
        }
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const request: SendMessageRequest = {
        chat_id: 'chat-123',
        message: specialMessage
      };

      const result = await sendMessage(request);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/api/chat/chat-123/message',
        {
          message: specialMessage,
          conversationId: undefined
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
}); 