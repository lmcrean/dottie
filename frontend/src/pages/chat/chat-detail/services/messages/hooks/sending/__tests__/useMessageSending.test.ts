import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMessageSending } from '../useMessageSending';
import { Message } from '../../../../types/chat';

// Mock the hooks
vi.mock('../useMessageSender', () => ({
  useMessageSender: vi.fn()
}));

vi.mock('../../state/useMessageState', () => ({
  useMessageState: vi.fn()
}));

import { useMessageSender } from '../useMessageSender';
import { useMessageState } from '../../state/useMessageState';

const mockUseMessageSender = vi.mocked(useMessageSender);
const mockUseMessageState = vi.mocked(useMessageState);

describe('useMessageSending', () => {
  let mockSetMessages: ReturnType<typeof vi.fn>;
  let mockOnSidebarRefresh: ReturnType<typeof vi.fn>;
  let mockAddUserMessage: ReturnType<typeof vi.fn>;
  let mockAddAssistantMessage: ReturnType<typeof vi.fn>;
  let mockAddErrorMessage: ReturnType<typeof vi.fn>;
  let mockHandleSend: ReturnType<typeof vi.fn>;

  const mockMessages: Message[] = [
    {
      role: 'user',
      content: 'Hello',
      created_at: '2024-01-01T00:00:00Z'
    },
    {
      role: 'assistant',
      content: 'Hi there!',
      created_at: '2024-01-01T00:01:00Z'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockSetMessages = vi.fn();
    mockOnSidebarRefresh = vi.fn();
    mockAddUserMessage = vi.fn();
    mockAddAssistantMessage = vi.fn();
    mockAddErrorMessage = vi.fn();
    mockHandleSend = vi.fn();

    // Setup default mock implementations
    mockUseMessageState.mockReturnValue({
      addUserMessage: mockAddUserMessage,
      addAssistantMessage: mockAddAssistantMessage,
      addErrorMessage: mockAddErrorMessage
    });

    mockUseMessageSender.mockReturnValue({
      isLoading: false,
      handleSend: mockHandleSend
    });
  });

  describe('hook integration', () => {
    it('should integrate useMessageState and useMessageSender correctly', () => {
      const { result } = renderHook(() =>
        useMessageSending({
          currentConversationId: 'conv-123',
          messages: mockMessages,
          setMessages: mockSetMessages,
          onSidebarRefresh: mockOnSidebarRefresh
        })
      );

      // Verify useMessageState was called with correct props
      expect(mockUseMessageState).toHaveBeenCalledWith({
        messages: mockMessages,
        setMessages: mockSetMessages
      });

      // Verify useMessageSender was called with correct props
      expect(mockUseMessageSender).toHaveBeenCalledWith({
        currentConversationId: 'conv-123',
        addUserMessage: mockAddUserMessage,
        addAssistantMessage: mockAddAssistantMessage,
        addErrorMessage: mockAddErrorMessage,
        onSidebarRefresh: mockOnSidebarRefresh
      });

      // Verify the hook returns the expected interface
      expect(result.current).toEqual({
        isLoading: false,
        handleSend: mockHandleSend
      });
    });

    it('should handle null conversation ID', () => {
      renderHook(() =>
        useMessageSending({
          currentConversationId: null,
          messages: mockMessages,
          setMessages: mockSetMessages,
          onSidebarRefresh: mockOnSidebarRefresh
        })
      );

      expect(mockUseMessageSender).toHaveBeenCalledWith({
        currentConversationId: null,
        addUserMessage: mockAddUserMessage,
        addAssistantMessage: mockAddAssistantMessage,
        addErrorMessage: mockAddErrorMessage,
        onSidebarRefresh: mockOnSidebarRefresh
      });
    });

    it('should handle undefined onSidebarRefresh', () => {
      renderHook(() =>
        useMessageSending({
          currentConversationId: 'conv-123',
          messages: mockMessages,
          setMessages: mockSetMessages
        })
      );

      expect(mockUseMessageSender).toHaveBeenCalledWith({
        currentConversationId: 'conv-123',
        addUserMessage: mockAddUserMessage,
        addAssistantMessage: mockAddAssistantMessage,
        addErrorMessage: mockAddErrorMessage,
        onSidebarRefresh: undefined
      });
    });
  });

  describe('loading state propagation', () => {
    it('should propagate loading state from useMessageSender', () => {
      mockUseMessageSender.mockReturnValue({
        isLoading: true,
        handleSend: mockHandleSend
      });

      const { result } = renderHook(() =>
        useMessageSending({
          currentConversationId: 'conv-123',
          messages: mockMessages,
          setMessages: mockSetMessages,
          onSidebarRefresh: mockOnSidebarRefresh
        })
      );

      expect(result.current.isLoading).toBe(true);
    });

    it('should handle loading state changes', () => {
      const { result, rerender } = renderHook(() =>
        useMessageSending({
          currentConversationId: 'conv-123',
          messages: mockMessages,
          setMessages: mockSetMessages,
          onSidebarRefresh: mockOnSidebarRefresh
        })
      );

      expect(result.current.isLoading).toBe(false);

      // Change loading state
      mockUseMessageSender.mockReturnValue({
        isLoading: true,
        handleSend: mockHandleSend
      });

      rerender();

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('handleSend function propagation', () => {
    it('should propagate handleSend function from useMessageSender', async () => {
      mockHandleSend.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useMessageSending({
          currentConversationId: 'conv-123',
          messages: mockMessages,
          setMessages: mockSetMessages,
          onSidebarRefresh: mockOnSidebarRefresh
        })
      );

      await act(async () => {
        await result.current.handleSend('Test message');
      });

      expect(mockHandleSend).toHaveBeenCalledWith('Test message');
    });

    it('should maintain function reference stability', () => {
      const { result, rerender } = renderHook(
        (props) => useMessageSending(props),
        {
          initialProps: {
            currentConversationId: 'conv-123',
            messages: mockMessages,
            setMessages: mockSetMessages,
            onSidebarRefresh: mockOnSidebarRefresh
          }
        }
      );

      const firstHandleSend = result.current.handleSend;

      // Re-render with same props
      rerender({
        currentConversationId: 'conv-123',
        messages: mockMessages,
        setMessages: mockSetMessages,
        onSidebarRefresh: mockOnSidebarRefresh
      });

      expect(result.current.handleSend).toBe(firstHandleSend);
    });
  });

  describe('props changes handling', () => {
    it('should handle conversation ID changes', () => {
      const { rerender } = renderHook(
        (props) => useMessageSending(props),
        {
          initialProps: {
            currentConversationId: 'conv-123',
            messages: mockMessages,
            setMessages: mockSetMessages,
            onSidebarRefresh: mockOnSidebarRefresh
          }
        }
      );

      expect(mockUseMessageSender).toHaveBeenLastCalledWith({
        currentConversationId: 'conv-123',
        addUserMessage: mockAddUserMessage,
        addAssistantMessage: mockAddAssistantMessage,
        addErrorMessage: mockAddErrorMessage,
        onSidebarRefresh: mockOnSidebarRefresh
      });

      // Change conversation ID
      rerender({
        currentConversationId: 'conv-456',
        messages: mockMessages,
        setMessages: mockSetMessages,
        onSidebarRefresh: mockOnSidebarRefresh
      });

      expect(mockUseMessageSender).toHaveBeenLastCalledWith({
        currentConversationId: 'conv-456',
        addUserMessage: mockAddUserMessage,
        addAssistantMessage: mockAddAssistantMessage,
        addErrorMessage: mockAddErrorMessage,
        onSidebarRefresh: mockOnSidebarRefresh
      });
    });

    it('should handle messages array changes', () => {
      const newMessages: Message[] = [
        ...mockMessages,
        {
          role: 'user',
          content: 'New message',
          created_at: '2024-01-01T00:02:00Z'
        }
      ];

      const { rerender } = renderHook(
        (props) => useMessageSending(props),
        {
          initialProps: {
            currentConversationId: 'conv-123',
            messages: mockMessages,
            setMessages: mockSetMessages,
            onSidebarRefresh: mockOnSidebarRefresh
          }
        }
      );

      expect(mockUseMessageState).toHaveBeenLastCalledWith({
        messages: mockMessages,
        setMessages: mockSetMessages
      });

      // Change messages
      rerender({
        currentConversationId: 'conv-123',
        messages: newMessages,
        setMessages: mockSetMessages,
        onSidebarRefresh: mockOnSidebarRefresh
      });

      expect(mockUseMessageState).toHaveBeenLastCalledWith({
        messages: newMessages,
        setMessages: mockSetMessages
      });
    });

    it('should handle setMessages function changes', () => {
      const newSetMessages = vi.fn();

      const { rerender } = renderHook(
        (props) => useMessageSending(props),
        {
          initialProps: {
            currentConversationId: 'conv-123',
            messages: mockMessages,
            setMessages: mockSetMessages,
            onSidebarRefresh: mockOnSidebarRefresh
          }
        }
      );

      expect(mockUseMessageState).toHaveBeenLastCalledWith({
        messages: mockMessages,
        setMessages: mockSetMessages
      });

      // Change setMessages
      rerender({
        currentConversationId: 'conv-123',
        messages: mockMessages,
        setMessages: newSetMessages,
        onSidebarRefresh: mockOnSidebarRefresh
      });

      expect(mockUseMessageState).toHaveBeenLastCalledWith({
        messages: mockMessages,
        setMessages: newSetMessages
      });
    });

    it('should handle onSidebarRefresh function changes', () => {
      const newOnSidebarRefresh = vi.fn();

      const { rerender } = renderHook(
        (props) => useMessageSending(props),
        {
          initialProps: {
            currentConversationId: 'conv-123',
            messages: mockMessages,
            setMessages: mockSetMessages,
            onSidebarRefresh: mockOnSidebarRefresh
          }
        }
      );

      expect(mockUseMessageSender).toHaveBeenLastCalledWith({
        currentConversationId: 'conv-123',
        addUserMessage: mockAddUserMessage,
        addAssistantMessage: mockAddAssistantMessage,
        addErrorMessage: mockAddErrorMessage,
        onSidebarRefresh: mockOnSidebarRefresh
      });

      // Change onSidebarRefresh
      rerender({
        currentConversationId: 'conv-123',
        messages: mockMessages,
        setMessages: mockSetMessages,
        onSidebarRefresh: newOnSidebarRefresh
      });

      expect(mockUseMessageSender).toHaveBeenLastCalledWith({
        currentConversationId: 'conv-123',
        addUserMessage: mockAddUserMessage,
        addAssistantMessage: mockAddAssistantMessage,
        addErrorMessage: mockAddErrorMessage,
        onSidebarRefresh: newOnSidebarRefresh
      });
    });
  });

  describe('return value structure', () => {
    it('should return correct interface', () => {
      const { result } = renderHook(() =>
        useMessageSending({
          currentConversationId: 'conv-123',
          messages: mockMessages,
          setMessages: mockSetMessages,
          onSidebarRefresh: mockOnSidebarRefresh
        })
      );

      expect(result.current).toEqual({
        isLoading: expect.any(Boolean),
        handleSend: expect.any(Function)
      });
    });

    it('should maintain consistent return shape across re-renders', () => {
      const { result, rerender } = renderHook(
        (props) => useMessageSending(props),
        {
          initialProps: {
            currentConversationId: 'conv-123',
            messages: mockMessages,
            setMessages: mockSetMessages,
            onSidebarRefresh: mockOnSidebarRefresh
          }
        }
      );

      const initialShape = Object.keys(result.current);

      rerender({
        currentConversationId: 'conv-456',
        messages: [],
        setMessages: vi.fn(),
        onSidebarRefresh: vi.fn()
      });

      const newShape = Object.keys(result.current);

      expect(newShape).toEqual(initialShape);
    });
  });
}); 