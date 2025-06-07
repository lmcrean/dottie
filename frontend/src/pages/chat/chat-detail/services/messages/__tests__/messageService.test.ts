import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
  sendInitialMessage, 
  sendMessage, 
  sendMessageGeneric
} from '../messageService';
import messageService from '../messageService';
import type { 
  InitialMessageRequest, 
  FollowUpMessageRequest 
} from '../messageService';
import { authenticatedPost, normalizeChatId } from '../../shared/apiHelpers';

// Mock the dependencies
vi.mock('../../shared/apiHelpers', () => ({
  authenticatedPost: vi.fn(),
  normalizeChatId: vi.fn()
}));

describe('messageService', () => {
  const mockAuthenticatedPost = vi.mocked(authenticatedPost);
  const mockNormalizeChatId = vi.mocked(normalizeChatId);

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock normalizeChatId to return string by default
    mockNormalizeChatId.mockImplementation((chatId) => String(chatId));
  });

  describe('sendInitialMessage', () => {
    it('should send initial message successfully', async () => {
      const mockResponse = {
        id: 'msg-123',
        chat_id: 'chat-123',
        role: 'user' as const,
        content: 'Initial message',
        created_at: '2024-01-01T00:00:00Z',
        assessment_context: {
          assessment_id: 'assess-123',
          pattern: 'regular',
          key_findings: ['Normal cycle']
        }
      };

      mockAuthenticatedPost.mockResolvedValue(mockResponse);
      mockNormalizeChatId.mockReturnValue('chat-123');

      const request: InitialMessageRequest = {
        chat_id: 'chat-123',
        assessment_id: 'assess-123',
        message: 'Initial message'
      };

      const result = await sendInitialMessage(request);

      expect(mockNormalizeChatId).toHaveBeenCalledWith('chat-123', 'sendInitialMessage');
      expect(mockAuthenticatedPost).toHaveBeenCalledWith(
        '/api/chat/chat-123/message/initial',
        {
          message: 'Initial message',
          assessment_id: 'assess-123',
          is_initial: true
        },
        { functionName: 'sendInitialMessage' }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle complex chat_id objects', async () => {
      const mockResponse = {
        id: 'msg-456',
        chat_id: 'conv-456',
        role: 'user' as const,
        content: 'Test message',
        created_at: '2024-01-01T00:00:00Z'
      };

      mockAuthenticatedPost.mockResolvedValue(mockResponse);
      mockNormalizeChatId.mockReturnValue('conv-456');

      const request: InitialMessageRequest = {
        chat_id: { conversationId: 'conv-456' },
        assessment_id: 'assess-456',
        message: 'Test message'
      };

      const result = await sendInitialMessage(request);

      expect(mockNormalizeChatId).toHaveBeenCalledWith({ conversationId: 'conv-456' }, 'sendInitialMessage');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('sendMessage', () => {
    it('should send follow-up message successfully', async () => {
      const mockResponse = {
        id: 'msg-789',
        chat_id: 'chat-456',
        role: 'user' as const,
        content: 'Follow-up message',
        created_at: '2024-01-01T00:00:00Z'
      };

      mockAuthenticatedPost.mockResolvedValue(mockResponse);

      const request: FollowUpMessageRequest = {
        chat_id: 'chat-456',
        message: 'Follow-up message',
        conversationId: 'conv-789'
      };

      const result = await sendMessage(request);

      expect(mockAuthenticatedPost).toHaveBeenCalledWith(
        '/api/chat/chat-456/message',
        {
          message: 'Follow-up message',
          conversationId: 'conv-789'
        },
        { functionName: 'sendMessage' }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle message without conversationId', async () => {
      const mockResponse = {
        id: 'msg-999',
        chat_id: 'chat-999',
        role: 'user' as const,
        content: 'Simple message',
        created_at: '2024-01-01T00:00:00Z'
      };

      mockAuthenticatedPost.mockResolvedValue(mockResponse);

      const request: FollowUpMessageRequest = {
        chat_id: 'chat-999',
        message: 'Simple message'
      };

      const result = await sendMessage(request);

      expect(mockAuthenticatedPost).toHaveBeenCalledWith(
        '/api/chat/chat-999/message',
        {
          message: 'Simple message',
          conversationId: undefined
        },
        { functionName: 'sendMessage' }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('sendMessageGeneric', () => {
    it('should route to sendInitialMessage when assessment_id is present', async () => {
      const mockResponse = {
        id: 'msg-initial',
        chat_id: 'chat-generic',
        role: 'user' as const,
        content: 'Generic initial',
        created_at: '2024-01-01T00:00:00Z',
        assessment_context: {
          assessment_id: 'assess-generic',
          pattern: 'irregular',
          key_findings: ['Test finding']
        }
      };

      mockAuthenticatedPost.mockResolvedValue(mockResponse);
      mockNormalizeChatId.mockReturnValue('chat-generic');

      const request: InitialMessageRequest = {
        chat_id: 'chat-generic',
        assessment_id: 'assess-generic',
        message: 'Generic initial'
      };

      const result = await sendMessageGeneric(request);

      expect(mockNormalizeChatId).toHaveBeenCalledWith('chat-generic', 'sendInitialMessage');
      expect(mockAuthenticatedPost).toHaveBeenCalledWith(
        '/api/chat/chat-generic/message/initial',
        {
          message: 'Generic initial',
          assessment_id: 'assess-generic',
          is_initial: true
        },
        { functionName: 'sendInitialMessage' }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should route to sendMessage when assessment_id is not present', async () => {
      const mockResponse = {
        id: 'msg-followup',
        chat_id: 'chat-generic',
        role: 'user' as const,
        content: 'Generic follow-up',
        created_at: '2024-01-01T00:00:00Z'
      };

      mockAuthenticatedPost.mockResolvedValue(mockResponse);

      const request: FollowUpMessageRequest = {
        chat_id: 'chat-generic',
        message: 'Generic follow-up',
        conversationId: 'conv-generic'
      };

      const result = await sendMessageGeneric(request);

      expect(mockAuthenticatedPost).toHaveBeenCalledWith(
        '/api/chat/chat-generic/message',
        {
          message: 'Generic follow-up',
          conversationId: 'conv-generic'
        },
        { functionName: 'sendMessage' }
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('default export', () => {
    it('should export all service methods', () => {
      expect(messageService).toEqual({
        sendInitialMessage,
        sendMessage,
        sendMessageGeneric
      });
    });
  });

  describe('error handling', () => {
    it('should propagate authenticatedPost errors', async () => {
      const apiError = new Error('API Error');
      mockAuthenticatedPost.mockRejectedValue(apiError);

      const request: FollowUpMessageRequest = {
        chat_id: 'error-chat',
        message: 'Error test'
      };

      await expect(sendMessage(request)).rejects.toThrow('API Error');
    });

    it('should propagate normalizeChatId errors', async () => {
      const normalizationError = new Error('Invalid chat ID');
      mockNormalizeChatId.mockImplementation(() => {
        throw normalizationError;
      });

      const request: InitialMessageRequest = {
        chat_id: { invalid: 'object' },
        assessment_id: 'assess-error',
        message: 'Error test'
      };

      await expect(sendInitialMessage(request)).rejects.toThrow('Invalid chat ID');
      expect(mockAuthenticatedPost).not.toHaveBeenCalled();
    });
  });


}); 