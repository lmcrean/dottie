import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendInitialMessage } from '../sendInitialMessage';
import type { SendInitialMessageRequest } from '../sendInitialMessage';
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

describe('sendInitialMessage', () => {
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
    it('should send initial message with string chat_id', async () => {
      const mockResponse = {
        data: {
          id: 'msg-123',
          chat_id: 'chat-123',
          role: 'user' as const,
          content: 'Test message',
          created_at: '2024-01-01T00:00:00Z',
          assessment_context: {
            assessment_id: 'assess-123',
            pattern: 'irregular',
            key_findings: ['finding1', 'finding2']
          }
        }
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const request: SendInitialMessageRequest = {
        chat_id: 'chat-123',
        assessment_id: 'assess-123',
        message: 'Test message'
      };

      const result = await sendInitialMessage(request);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/api/chat/chat-123/message/initial',
        {
          message: 'Test message',
          assessment_id: 'assess-123',
          is_initial: true
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle object chat_id with id property', async () => {
      const mockResponse = {
        data: {
          id: 'msg-123',
          chat_id: 'chat-456',
          role: 'user' as const,
          content: 'Test message',
          created_at: '2024-01-01T00:00:00Z'
        }
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const request: SendInitialMessageRequest = {
        chat_id: { id: 'chat-456' },
        assessment_id: 'assess-123',
        message: 'Test message'
      };

      const result = await sendInitialMessage(request);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/api/chat/chat-456/message/initial',
        {
          message: 'Test message',
          assessment_id: 'assess-123',
          is_initial: true
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle object chat_id with conversationId property', async () => {
      const mockResponse = {
        data: {
          id: 'msg-123',
          chat_id: 'chat-789',
          role: 'user' as const,
          content: 'Test message',
          created_at: '2024-01-01T00:00:00Z'
        }
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const request: SendInitialMessageRequest = {
        chat_id: { conversationId: 'chat-789' },
        assessment_id: 'assess-123',
        message: 'Test message'
      };

      const result = await sendInitialMessage(request);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/api/chat/chat-789/message/initial',
        {
          message: 'Test message',
          assessment_id: 'assess-123',
          is_initial: true
        }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should handle object chat_id with toString method', async () => {
      const mockResponse = {
        data: {
          id: 'msg-123',
          chat_id: 'chat-custom',
          role: 'user' as const,
          content: 'Test message',
          created_at: '2024-01-01T00:00:00Z'
        }
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const customObject = {
        toString: () => 'chat-custom'
      };

      const request: SendInitialMessageRequest = {
        chat_id: customObject,
        assessment_id: 'assess-123',
        message: 'Test message'
      };

      const result = await sendInitialMessage(request);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/api/chat/chat-custom/message/initial',
        {
          message: 'Test message',
          assessment_id: 'assess-123',
          is_initial: true
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('error handling', () => {
    it('should throw error when user data is not available', async () => {
      mockGetUserData.mockReturnValue(null);

      const request: SendInitialMessageRequest = {
        chat_id: 'chat-123',
        assessment_id: 'assess-123',
        message: 'Test message'
      };

      await expect(sendInitialMessage(request)).rejects.toThrow(
        'User ID not found. Please login again.'
      );
    });

    it('should throw error when user ID is missing', async () => {
      mockGetUserData.mockReturnValue({ email: 'test@example.com' } as any);

      const request: SendInitialMessageRequest = {
        chat_id: 'chat-123',
        assessment_id: 'assess-123',
        message: 'Test message'
      };

      await expect(sendInitialMessage(request)).rejects.toThrow(
        'User ID not found. Please login again.'
      );
    });

    it('should throw error when chat_id object has no valid properties', async () => {
      const request: SendInitialMessageRequest = {
        chat_id: { invalidProp: 'test' },
        assessment_id: 'assess-123',
        message: 'Test message'
      };

      await expect(sendInitialMessage(request)).rejects.toThrow(
        'Invalid chat ID format. Please try again.'
      );
    });

    it('should handle API client errors', async () => {
      const apiError = new Error('Network error');
      mockApiClient.post.mockRejectedValue(apiError);

      const request: SendInitialMessageRequest = {
        chat_id: 'chat-123',
        assessment_id: 'assess-123',
        message: 'Test message'
      };

      await expect(sendInitialMessage(request)).rejects.toThrow('Network error');
    });
  });

  describe('parameter validation', () => {
    it('should convert numeric chat_id to string', async () => {
      const mockResponse = {
        data: {
          id: 'msg-123',
          chat_id: '123',
          role: 'user' as const,
          content: 'Test message',
          created_at: '2024-01-01T00:00:00Z'
        }
      };

      mockApiClient.post.mockResolvedValue(mockResponse);

      const request: SendInitialMessageRequest = {
        chat_id: 123 as any,
        assessment_id: 'assess-123',
        message: 'Test message'
      };

      const result = await sendInitialMessage(request);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        '/api/chat/123/message/initial',
        {
          message: 'Test message',
          assessment_id: 'assess-123',
          is_initial: true
        }
      );
      expect(result).toEqual(mockResponse.data);
    });
  });
}); 