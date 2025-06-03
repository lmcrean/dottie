import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendMessage } from '../../messageService';
import type { SendMessageRequest } from '../../messageService';
import { authenticatedPost } from '../../../shared/apiHelpers';

// Mock the dependencies
vi.mock('../../../shared/apiHelpers', () => ({
  authenticatedPost: vi.fn()
}));

describe('sendMessage', () => {
  const mockAuthenticatedPost = vi.mocked(authenticatedPost);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('successful API calls', () => {
    it('should send message with required parameters', async () => {
      const mockResponse = {
        id: 'msg-456',
        chat_id: 'chat-123',
        role: 'user' as const,
        content: 'Follow-up message',
        created_at: '2024-01-01T00:00:00Z'
      };

      mockAuthenticatedPost.mockResolvedValue(mockResponse);

      const request: SendMessageRequest = {
        chat_id: 'chat-123',
        message: 'Follow-up message'
      };

      const result = await sendMessage(request);

      expect(mockAuthenticatedPost).toHaveBeenCalledWith(
        '/api/chat/chat-123/message',
        {
          message: 'Follow-up message',
          conversationId: undefined
        },
        { functionName: 'sendMessage' }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should send message with conversationId', async () => {
      const mockResponse = {
        id: 'msg-789',
        chat_id: 'chat-456',
        role: 'user' as const,
        content: 'Message with conversation ID',
        created_at: '2024-01-01T00:00:00Z'
      };

      mockAuthenticatedPost.mockResolvedValue(mockResponse);

      const request: SendMessageRequest = {
        chat_id: 'chat-456',
        message: 'Message with conversation ID',
        conversationId: 'conv-789'
      };

      const result = await sendMessage(request);

      expect(mockAuthenticatedPost).toHaveBeenCalledWith(
        '/api/chat/chat-456/message',
        {
          message: 'Message with conversation ID',
          conversationId: 'conv-789'
        },
        { functionName: 'sendMessage' }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('error handling', () => {
    it('should handle authenticatedPost errors', async () => {
      const apiError = new Error('Server error');
      mockAuthenticatedPost.mockRejectedValue(apiError);

      const request: SendMessageRequest = {
        chat_id: 'chat-123',
        message: 'Test message'
      };

      await expect(sendMessage(request)).rejects.toThrow('Server error');

      expect(mockAuthenticatedPost).toHaveBeenCalledWith(
        '/api/chat/chat-123/message',
        {
          message: 'Test message',
          conversationId: undefined
        },
        { functionName: 'sendMessage' }
      );
    });
  });

  describe('parameter validation', () => {
    it('should handle empty message', async () => {
      const mockResponse = {
        id: 'msg-123',
        chat_id: 'chat-123',
        role: 'user' as const,
        content: '',
        created_at: '2024-01-01T00:00:00Z'
      };

      mockAuthenticatedPost.mockResolvedValue(mockResponse);

      const request: SendMessageRequest = {
        chat_id: 'chat-123',
        message: ''
      };

      const result = await sendMessage(request);

      expect(mockAuthenticatedPost).toHaveBeenCalledWith(
        '/api/chat/chat-123/message',
        {
          message: '',
          conversationId: undefined
        },
        { functionName: 'sendMessage' }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle special characters in message', async () => {
      const specialMessage = 'Hello! 🎉 How are you? @user #hashtag $money 100% great!';
      const mockResponse = {
        id: 'msg-123',
        chat_id: 'chat-123',
        role: 'user' as const,
        content: specialMessage,
        created_at: '2024-01-01T00:00:00Z'
      };

      mockAuthenticatedPost.mockResolvedValue(mockResponse);

      const request: SendMessageRequest = {
        chat_id: 'chat-123',
        message: specialMessage
      };

      const result = await sendMessage(request);

      expect(mockAuthenticatedPost).toHaveBeenCalledWith(
        '/api/chat/chat-123/message',
        {
          message: specialMessage,
          conversationId: undefined
        },
        { functionName: 'sendMessage' }
      );
      expect(result).toEqual(mockResponse);
    });
  });
}); 