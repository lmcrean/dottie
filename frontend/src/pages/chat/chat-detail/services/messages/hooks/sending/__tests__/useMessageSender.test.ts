import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMessageSender } from '../useMessageSender';
import { sendMessage } from '../../../messageService';
import { toast } from 'sonner';

// Mock dependencies
vi.mock('../../../messageService', () => ({
  sendMessage: vi.fn()
}));

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn()
  }
}));

const mockSendMessage = vi.mocked(sendMessage);
const mockToast = vi.mocked(toast);

describe('useMessageSender', () => {
  let mockAddUserMessage: ReturnType<typeof vi.fn>;
  let mockAddAssistantMessage: ReturnType<typeof vi.fn>;
  let mockAddErrorMessage: ReturnType<typeof vi.fn>;
  let mockOnSidebarRefresh: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockAddUserMessage = vi.fn();
    mockAddAssistantMessage = vi.fn();
    mockAddErrorMessage = vi.fn();
    mockOnSidebarRefresh = vi.fn();
  });

  describe('successful message sending', () => {
    it('should send message successfully', async () => {
      const mockResponse = {
        id: 'msg-123',
        chat_id: 'chat-456',
        role: 'assistant' as const,
        content: 'Assistant response',
        created_at: '2024-01-01T00:00:00Z'
      };

      mockSendMessage.mockResolvedValue(mockResponse);
      mockOnSidebarRefresh.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useMessageSender({
          currentConversationId: 'conv-123',
          addUserMessage: mockAddUserMessage,
          addAssistantMessage: mockAddAssistantMessage,
          addErrorMessage: mockAddErrorMessage,
          onSidebarRefresh: mockOnSidebarRefresh
        })
      );

      expect(result.current.isLoading).toBe(false);

      await act(async () => {
        await result.current.handleSend('Hello world');
      });

      expect(mockAddUserMessage).toHaveBeenCalledWith('Hello world');
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: 'conv-123',
        message: 'Hello world',
        conversationId: 'conv-123'
      });
      expect(mockAddAssistantMessage).toHaveBeenCalledWith('Assistant response');
      expect(mockOnSidebarRefresh).toHaveBeenCalledTimes(1);
      expect(result.current.isLoading).toBe(false);
    });

    it('should handle sending without sidebar refresh callback', async () => {
      const mockResponse = {
        id: 'msg-123',
        chat_id: 'chat-456',
        role: 'assistant' as const,
        content: 'Assistant response',
        created_at: '2024-01-01T00:00:00Z'
      };

      mockSendMessage.mockResolvedValue(mockResponse);

      const { result } = renderHook(() =>
        useMessageSender({
          currentConversationId: 'conv-123',
          addUserMessage: mockAddUserMessage,
          addAssistantMessage: mockAddAssistantMessage,
          addErrorMessage: mockAddErrorMessage
        })
      );

      await act(async () => {
        await result.current.handleSend('Test message');
      });

      expect(mockAddUserMessage).toHaveBeenCalledWith('Test message');
      expect(mockAddAssistantMessage).toHaveBeenCalledWith('Assistant response');
      expect(mockSendMessage).toHaveBeenCalled();
    });

    it('should trim whitespace from message before sending', async () => {
      const mockResponse = {
        id: 'msg-123',
        chat_id: 'chat-456',
        role: 'assistant' as const,
        content: 'Response',
        created_at: '2024-01-01T00:00:00Z'
      };

      mockSendMessage.mockResolvedValue(mockResponse);

      const { result } = renderHook(() =>
        useMessageSender({
          currentConversationId: 'conv-123',
          addUserMessage: mockAddUserMessage,
          addAssistantMessage: mockAddAssistantMessage,
          addErrorMessage: mockAddErrorMessage
        })
      );

      await act(async () => {
        await result.current.handleSend('  Hello world  ');
      });

      expect(mockAddUserMessage).toHaveBeenCalledWith('Hello world');
      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: 'conv-123',
        message: 'Hello world',
        conversationId: 'conv-123'
      });
    });
  });

  describe('validation and early returns', () => {
    it('should not send empty message', async () => {
      const { result } = renderHook(() =>
        useMessageSender({
          currentConversationId: 'conv-123',
          addUserMessage: mockAddUserMessage,
          addAssistantMessage: mockAddAssistantMessage,
          addErrorMessage: mockAddErrorMessage
        })
      );

      await act(async () => {
        await result.current.handleSend('');
      });

      expect(mockAddUserMessage).not.toHaveBeenCalled();
      expect(mockSendMessage).not.toHaveBeenCalled();
    });

    it('should not send whitespace-only message', async () => {
      const { result } = renderHook(() =>
        useMessageSender({
          currentConversationId: 'conv-123',
          addUserMessage: mockAddUserMessage,
          addAssistantMessage: mockAddAssistantMessage,
          addErrorMessage: mockAddErrorMessage
        })
      );

      await act(async () => {
        await result.current.handleSend('   \n\t  ');
      });

      expect(mockAddUserMessage).not.toHaveBeenCalled();
      expect(mockSendMessage).not.toHaveBeenCalled();
    });

    it('should not send when no conversation ID is present', async () => {
      const { result } = renderHook(() =>
        useMessageSender({
          currentConversationId: null,
          addUserMessage: mockAddUserMessage,
          addAssistantMessage: mockAddAssistantMessage,
          addErrorMessage: mockAddErrorMessage
        })
      );

      await act(async () => {
        await result.current.handleSend('Hello world');
      });

      expect(mockToast.error).toHaveBeenCalledWith('No active conversation. Please start a new chat.');
      expect(mockAddUserMessage).not.toHaveBeenCalled();
      expect(mockSendMessage).not.toHaveBeenCalled();
    });

    it('should not send when already loading', async () => {
      const mockResponse = {
        id: 'msg-123',
        chat_id: 'chat-456',
        role: 'assistant' as const,
        content: 'Response',
        created_at: '2024-01-01T00:00:00Z'
      };

      let resolveFirstSend: (value: any) => void;
      const firstSendPromise = new Promise((resolve) => {
        resolveFirstSend = resolve;
      });

      mockSendMessage.mockReturnValueOnce(firstSendPromise);

      const { result } = renderHook(() =>
        useMessageSender({
          currentConversationId: 'conv-123',
          addUserMessage: mockAddUserMessage,
          addAssistantMessage: mockAddAssistantMessage,
          addErrorMessage: mockAddErrorMessage
        })
      );

      // Start first send
      act(() => {
        result.current.handleSend('First message');
      });

      expect(result.current.isLoading).toBe(true);

      // Try to send second message while first is loading
      await act(async () => {
        await result.current.handleSend('Second message');
      });

      // Second message should be ignored
      expect(mockAddUserMessage).toHaveBeenCalledTimes(1);
      expect(mockAddUserMessage).toHaveBeenCalledWith('First message');

      // Resolve first send
      resolveFirstSend!(mockResponse);
      await act(async () => {
        await firstSendPromise;
      });

      expect(result.current.isLoading).toBe(false);
    });
  });

  describe('error handling', () => {
    it('should handle message service errors', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const serviceError = new Error('Service error');
      mockSendMessage.mockRejectedValue(serviceError);

      const { result } = renderHook(() =>
        useMessageSender({
          currentConversationId: 'conv-123',
          addUserMessage: mockAddUserMessage,
          addAssistantMessage: mockAddAssistantMessage,
          addErrorMessage: mockAddErrorMessage,
          onSidebarRefresh: mockOnSidebarRefresh
        })
      );

      await act(async () => {
        await result.current.handleSend('Error message');
      });

      expect(mockAddUserMessage).toHaveBeenCalledWith('Error message');
      expect(mockAddErrorMessage).toHaveBeenCalledTimes(1);
      expect(mockToast.error).toHaveBeenCalledWith('Failed to send message');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error sending message:', serviceError);
      expect(result.current.isLoading).toBe(false);

      consoleErrorSpy.mockRestore();
    });

    it('should handle sidebar refresh errors gracefully', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      const mockResponse = {
        id: 'msg-123',
        chat_id: 'chat-456',
        role: 'assistant' as const,
        content: 'Response',
        created_at: '2024-01-01T00:00:00Z'
      };

      mockSendMessage.mockResolvedValue(mockResponse);
      mockOnSidebarRefresh.mockRejectedValue(new Error('Sidebar refresh failed'));

      const { result } = renderHook(() =>
        useMessageSender({
          currentConversationId: 'conv-123',
          addUserMessage: mockAddUserMessage,
          addAssistantMessage: mockAddAssistantMessage,
          addErrorMessage: mockAddErrorMessage,
          onSidebarRefresh: mockOnSidebarRefresh
        })
      );

      await act(async () => {
        await result.current.handleSend('Test message');
      });

      expect(mockAddUserMessage).toHaveBeenCalledWith('Test message');
      expect(mockAddAssistantMessage).toHaveBeenCalledWith('Response');
      expect(consoleWarnSpy).toHaveBeenCalledWith('Failed to refresh sidebar:', expect.any(Error));
      expect(result.current.isLoading).toBe(false);

      consoleWarnSpy.mockRestore();
    });
  });

  describe('loading state management', () => {
    it('should set loading state during message sending', async () => {
      let resolveMessageService: (value: any) => void;
      const messageServicePromise = new Promise((resolve) => {
        resolveMessageService = resolve;
      });

      mockSendMessage.mockReturnValue(messageServicePromise);

      const { result } = renderHook(() =>
        useMessageSender({
          currentConversationId: 'conv-123',
          addUserMessage: mockAddUserMessage,
          addAssistantMessage: mockAddAssistantMessage,
          addErrorMessage: mockAddErrorMessage
        })
      );

      expect(result.current.isLoading).toBe(false);

      // Start sending
      act(() => {
        result.current.handleSend('Loading test');
      });

      expect(result.current.isLoading).toBe(true);

      // Resolve the service call
      const mockResponse = {
        id: 'msg-123',
        chat_id: 'chat-456',
        role: 'assistant' as const,
        content: 'Response',
        created_at: '2024-01-01T00:00:00Z'
      };

      resolveMessageService!(mockResponse);
      await act(async () => {
        await messageServicePromise;
      });

      expect(result.current.isLoading).toBe(false);
    });

    it('should reset loading state after error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockSendMessage.mockRejectedValue(new Error('Test error'));

      const { result } = renderHook(() =>
        useMessageSender({
          currentConversationId: 'conv-123',
          addUserMessage: mockAddUserMessage,
          addAssistantMessage: mockAddAssistantMessage,
          addErrorMessage: mockAddErrorMessage
        })
      );

      expect(result.current.isLoading).toBe(false);

      await act(async () => {
        await result.current.handleSend('Error test');
      });

      expect(result.current.isLoading).toBe(false);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('conversation ID handling', () => {
    it('should convert non-string conversation ID to string', async () => {
      const mockResponse = {
        id: 'msg-123',
        chat_id: 'chat-456',
        role: 'assistant' as const,
        content: 'Response',
        created_at: '2024-01-01T00:00:00Z'
      };

      mockSendMessage.mockResolvedValue(mockResponse);

      const { result } = renderHook(() =>
        useMessageSender({
          currentConversationId: 123 as any,
          addUserMessage: mockAddUserMessage,
          addAssistantMessage: mockAddAssistantMessage,
          addErrorMessage: mockAddErrorMessage
        })
      );

      await act(async () => {
        await result.current.handleSend('Number test');
      });

      expect(mockSendMessage).toHaveBeenCalledWith({
        chat_id: '123',
        message: 'Number test',
        conversationId: '123'
      });
    });
  });
}); 
