import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendInitialMessage } from '../../messageService';
import type { SendInitialMessageRequest } from '../../messageService';
import { authenticatedPost, normalizeChatId } from '../../../shared/apiHelpers';

// Mock the dependencies
vi.mock('../../../shared/apiHelpers', () => ({
  authenticatedPost: vi.fn(),
  normalizeChatId: vi.fn()
}));

describe('sendInitialMessage', () => {
  const mockAuthenticatedPost = vi.mocked(authenticatedPost);
  const mockNormalizeChatId = vi.mocked(normalizeChatId);

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock normalizeChatId to return the string version by default
    mockNormalizeChatId.mockImplementation((chatId) => String(chatId));
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('successful API calls', () => {
    it('should send initial message with string chat_id', async () => {
      const mockResponse = {
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
      };

      mockAuthenticatedPost.mockResolvedValue(mockResponse);
      mockNormalizeChatId.mockReturnValue('chat-123');

      const request: SendInitialMessageRequest = {
        chat_id: 'chat-123',
        assessment_id: 'assess-123',
        message: 'Test message'
      };

      const result = await sendInitialMessage(request);

      expect(mockNormalizeChatId).toHaveBeenCalledWith('chat-123', 'sendInitialMessage');
      expect(mockAuthenticatedPost).toHaveBeenCalledWith(
        '/api/chat/chat-123/message/initial',
        {
          message: 'Test message',
          assessment_id: 'assess-123',
          is_initial: true
        },
        { functionName: 'sendInitialMessage' }
      );
      expect(result).toEqual(mockResponse);
    });

    it('should handle object chat_id with normalizeChatId', async () => {
      const mockResponse = {
        id: 'msg-123',
        chat_id: 'chat-456',
        role: 'user' as const,
        content: 'Test message',
        created_at: '2024-01-01T00:00:00Z'
      };

      mockAuthenticatedPost.mockResolvedValue(mockResponse);
      mockNormalizeChatId.mockReturnValue('chat-456');

      const request: SendInitialMessageRequest = {
        chat_id: { id: 'chat-456' },
        assessment_id: 'assess-123',
        message: 'Test message'
      };

      const result = await sendInitialMessage(request);

      expect(mockNormalizeChatId).toHaveBeenCalledWith({ id: 'chat-456' }, 'sendInitialMessage');
      expect(mockAuthenticatedPost).toHaveBeenCalledWith(
        '/api/chat/chat-456/message/initial',
        {
          message: 'Test message',
          assessment_id: 'assess-123',
          is_initial: true
        },
        { functionName: 'sendInitialMessage' }
      );
      expect(result).toEqual(mockResponse);
    });


  });

  describe('error handling', () => {
    it('should handle authenticatedPost errors', async () => {
      const apiError = new Error('Network error');
      mockAuthenticatedPost.mockRejectedValue(apiError);
      mockNormalizeChatId.mockReturnValue('chat-123');

      const request: SendInitialMessageRequest = {
        chat_id: 'chat-123',
        assessment_id: 'assess-123',
        message: 'Test message'
      };

      await expect(sendInitialMessage(request)).rejects.toThrow('Network error');
      expect(mockNormalizeChatId).toHaveBeenCalledWith('chat-123', 'sendInitialMessage');
      expect(mockAuthenticatedPost).toHaveBeenCalled();
    });

    it('should handle normalizeChatId errors', async () => {
      const normalizationError = new Error('Invalid chat ID format');
      mockNormalizeChatId.mockImplementation(() => {
        throw normalizationError;
      });

      const request: SendInitialMessageRequest = {
        chat_id: { invalidProp: 'test' },
        assessment_id: 'assess-123',
        message: 'Test message'
      };

      await expect(sendInitialMessage(request)).rejects.toThrow('Invalid chat ID format');
      expect(mockNormalizeChatId).toHaveBeenCalledWith({ invalidProp: 'test' }, 'sendInitialMessage');
      expect(mockAuthenticatedPost).not.toHaveBeenCalled();
    });
  });

  describe('parameter validation', () => {
    it('should call normalizeChatId with correct parameters', async () => {
      const mockResponse = {
        id: 'msg-123',
        chat_id: '123',
        role: 'user' as const,
        content: 'Test message',
        created_at: '2024-01-01T00:00:00Z'
      };

      mockAuthenticatedPost.mockResolvedValue(mockResponse);
      mockNormalizeChatId.mockReturnValue('123');

      const request: SendInitialMessageRequest = {
        chat_id: 123 as any,
        assessment_id: 'assess-123',
        message: 'Test message'
      };

      await sendInitialMessage(request);

      expect(mockNormalizeChatId).toHaveBeenCalledWith(123, 'sendInitialMessage');
    });

    it('should pass correct request body to authenticatedPost', async () => {
      const mockResponse = {
        id: 'msg-123',
        chat_id: 'chat-123',
        role: 'user' as const,
        content: 'Test message',
        created_at: '2024-01-01T00:00:00Z'
      };

      mockAuthenticatedPost.mockResolvedValue(mockResponse);
      mockNormalizeChatId.mockReturnValue('chat-123');

      const request: SendInitialMessageRequest = {
        chat_id: 'chat-123',
        assessment_id: 'assess-456',
        message: 'Custom message'
      };

      await sendInitialMessage(request);

      expect(mockAuthenticatedPost).toHaveBeenCalledWith(
        '/api/chat/chat-123/message/initial',
        {
          message: 'Custom message',
          assessment_id: 'assess-456',
          is_initial: true
        },
        { functionName: 'sendInitialMessage' }
      );
    });
  });
}); 