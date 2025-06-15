import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMessageState } from '../useMessageState';
import { Message } from '../../../../types/chat';

describe('useMessageState', () => {
  let mockSetMessages: ReturnType<typeof vi.fn>;
  
  const initialMessages: Message[] = [
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
  });

  describe('user message management', () => {
    it('should add user message', () => {
      const { result } = renderHook(() =>
        useMessageState({
          messages: initialMessages,
          setMessages: mockSetMessages
        })
      );

      act(() => {
        result.current.addUserMessage('New user message');
      });

      expect(mockSetMessages).toHaveBeenCalledTimes(1);
      
      // Get the function passed to setMessages
      const setMessagesFn = mockSetMessages.mock.calls[0][0];
      const newMessages = setMessagesFn(initialMessages);

      expect(newMessages).toHaveLength(3);
      expect(newMessages[2]).toEqual({
        role: 'user',
        content: 'New user message',
        created_at: expect.any(String)
      });

      // Verify the timestamp is valid
      expect(new Date(newMessages[2].created_at).getTime()).toBeGreaterThan(0);
    });

    it('should add user message with current timestamp', () => {
      const { result } = renderHook(() =>
        useMessageState({
          messages: [],
          setMessages: mockSetMessages
        })
      );

      const beforeTime = new Date().toISOString();

      act(() => {
        result.current.addUserMessage('Test message');
      });

      const afterTime = new Date().toISOString();

      const setMessagesFn = mockSetMessages.mock.calls[0][0];
      const newMessages = setMessagesFn([]);

      expect(newMessages[0].created_at).toBeTruthy();
      expect(newMessages[0].created_at >= beforeTime).toBe(true);
      expect(newMessages[0].created_at <= afterTime).toBe(true);
    });

    it('should preserve existing messages when adding user message', () => {
      const { result } = renderHook(() =>
        useMessageState({
          messages: initialMessages,
          setMessages: mockSetMessages
        })
      );

      act(() => {
        result.current.addUserMessage('Additional message');
      });

      const setMessagesFn = mockSetMessages.mock.calls[0][0];
      const newMessages = setMessagesFn(initialMessages);

      expect(newMessages.slice(0, 2)).toEqual(initialMessages);
      expect(newMessages[2].role).toBe('user');
      expect(newMessages[2].content).toBe('Additional message');
    });

    it('should handle empty user message', () => {
      const { result } = renderHook(() =>
        useMessageState({
          messages: [],
          setMessages: mockSetMessages
        })
      );

      act(() => {
        result.current.addUserMessage('');
      });

      const setMessagesFn = mockSetMessages.mock.calls[0][0];
      const newMessages = setMessagesFn([]);

      expect(newMessages[0].content).toBe('');
      expect(newMessages[0].role).toBe('user');
    });
  });

  describe('assistant message management', () => {
    it('should add assistant message', () => {
      const { result } = renderHook(() =>
        useMessageState({
          messages: initialMessages,
          setMessages: mockSetMessages
        })
      );

      act(() => {
        result.current.addAssistantMessage('New assistant response');
      });

      expect(mockSetMessages).toHaveBeenCalledTimes(1);
      
      const setMessagesFn = mockSetMessages.mock.calls[0][0];
      const newMessages = setMessagesFn(initialMessages);

      expect(newMessages).toHaveLength(3);
      expect(newMessages[2]).toEqual({
        role: 'assistant',
        content: 'New assistant response',
        created_at: expect.any(String)
      });
    });

    it('should add assistant message with current timestamp', () => {
      const { result } = renderHook(() =>
        useMessageState({
          messages: [],
          setMessages: mockSetMessages
        })
      );

      const beforeTime = new Date().toISOString();

      act(() => {
        result.current.addAssistantMessage('Assistant response');
      });

      const afterTime = new Date().toISOString();

      const setMessagesFn = mockSetMessages.mock.calls[0][0];
      const newMessages = setMessagesFn([]);

      expect(newMessages[0].created_at).toBeTruthy();
      expect(newMessages[0].created_at >= beforeTime).toBe(true);
      expect(newMessages[0].created_at <= afterTime).toBe(true);
    });

    it('should preserve existing messages when adding assistant message', () => {
      const { result } = renderHook(() =>
        useMessageState({
          messages: initialMessages,
          setMessages: mockSetMessages
        })
      );

      act(() => {
        result.current.addAssistantMessage('AI response');
      });

      const setMessagesFn = mockSetMessages.mock.calls[0][0];
      const newMessages = setMessagesFn(initialMessages);

      expect(newMessages.slice(0, 2)).toEqual(initialMessages);
      expect(newMessages[2].role).toBe('assistant');
      expect(newMessages[2].content).toBe('AI response');
    });

    it('should handle long assistant message', () => {
      const { result } = renderHook(() =>
        useMessageState({
          messages: [],
          setMessages: mockSetMessages
        })
      );

      const longMessage = 'A'.repeat(5000);

      act(() => {
        result.current.addAssistantMessage(longMessage);
      });

      const setMessagesFn = mockSetMessages.mock.calls[0][0];
      const newMessages = setMessagesFn([]);

      expect(newMessages[0].content).toBe(longMessage);
      expect(newMessages[0].content.length).toBe(5000);
    });
  });

  describe('error message management', () => {
    it('should add predefined error message', () => {
      const { result } = renderHook(() =>
        useMessageState({
          messages: initialMessages,
          setMessages: mockSetMessages
        })
      );

      act(() => {
        result.current.addErrorMessage();
      });

      expect(mockSetMessages).toHaveBeenCalledTimes(1);
      
      const setMessagesFn = mockSetMessages.mock.calls[0][0];
      const newMessages = setMessagesFn(initialMessages);

      expect(newMessages).toHaveLength(3);
      expect(newMessages[2]).toEqual({
        role: 'assistant',
        content: "I apologize, but I'm having trouble processing your request right now. Please try again later.",
        created_at: expect.any(String)
      });
    });

    it('should add error message with current timestamp', () => {
      const { result } = renderHook(() =>
        useMessageState({
          messages: [],
          setMessages: mockSetMessages
        })
      );

      const beforeTime = new Date().toISOString();

      act(() => {
        result.current.addErrorMessage();
      });

      const afterTime = new Date().toISOString();

      const setMessagesFn = mockSetMessages.mock.calls[0][0];
      const newMessages = setMessagesFn([]);

      expect(newMessages[0].created_at >= beforeTime).toBe(true);
      expect(newMessages[0].created_at <= afterTime).toBe(true);
    });

    it('should preserve existing messages when adding error message', () => {
      const { result } = renderHook(() =>
        useMessageState({
          messages: initialMessages,
          setMessages: mockSetMessages
        })
      );

      act(() => {
        result.current.addErrorMessage();
      });

      const setMessagesFn = mockSetMessages.mock.calls[0][0];
      const newMessages = setMessagesFn(initialMessages);

      expect(newMessages.slice(0, 2)).toEqual(initialMessages);
      expect(newMessages[2].role).toBe('assistant');
      expect(newMessages[2].content).toContain("I apologize, but I'm having trouble");
    });
  });

  describe('multiple message operations', () => {
    it('should handle multiple messages added in sequence', () => {
      const { result } = renderHook(() =>
        useMessageState({
          messages: [],
          setMessages: mockSetMessages
        })
      );

      act(() => {
        result.current.addUserMessage('First user message');
      });

      act(() => {
        result.current.addAssistantMessage('First assistant response');
      });

      act(() => {
        result.current.addUserMessage('Second user message');
      });

      expect(mockSetMessages).toHaveBeenCalledTimes(3);

      // Simulate the state updates
      let currentMessages: Message[] = [];
      
      // First call - add user message
      let setMessagesFn = mockSetMessages.mock.calls[0][0];
      currentMessages = setMessagesFn(currentMessages);
      expect(currentMessages).toHaveLength(1);
      expect(currentMessages[0].role).toBe('user');
      expect(currentMessages[0].content).toBe('First user message');

      // Second call - add assistant message  
      setMessagesFn = mockSetMessages.mock.calls[1][0];
      currentMessages = setMessagesFn(currentMessages);
      expect(currentMessages).toHaveLength(2);
      expect(currentMessages[1].role).toBe('assistant');
      expect(currentMessages[1].content).toBe('First assistant response');

      // Third call - add another user message
      setMessagesFn = mockSetMessages.mock.calls[2][0];
      currentMessages = setMessagesFn(currentMessages);
      expect(currentMessages).toHaveLength(3);
      expect(currentMessages[2].role).toBe('user');
      expect(currentMessages[2].content).toBe('Second user message');
    });

    it('should handle mixed message types', () => {
      const { result } = renderHook(() =>
        useMessageState({
          messages: initialMessages,
          setMessages: mockSetMessages
        })
      );

      act(() => {
        result.current.addUserMessage('User question');
        result.current.addAssistantMessage('Assistant answer');
        result.current.addErrorMessage();
      });

      expect(mockSetMessages).toHaveBeenCalledTimes(3);

      // Verify the sequence of operations
      let currentMessages = initialMessages;

      // Add user message
      let setMessagesFn = mockSetMessages.mock.calls[0][0];
      currentMessages = setMessagesFn(currentMessages);
      expect(currentMessages[2].role).toBe('user');

      // Add assistant message
      setMessagesFn = mockSetMessages.mock.calls[1][0];
      currentMessages = setMessagesFn(currentMessages);
      expect(currentMessages[3].role).toBe('assistant');
      expect(currentMessages[3].content).toBe('Assistant answer');

      // Add error message
      setMessagesFn = mockSetMessages.mock.calls[2][0];
      currentMessages = setMessagesFn(currentMessages);
      expect(currentMessages[4].role).toBe('assistant');
      expect(currentMessages[4].content).toContain("I apologize");
    });
  });

  describe('state updates', () => {
    it('should call setMessages with function updater', () => {
      const { result } = renderHook(() =>
        useMessageState({
          messages: initialMessages,
          setMessages: mockSetMessages
        })
      );

      act(() => {
        result.current.addUserMessage('Test');
      });

      expect(mockSetMessages).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should not mutate original messages array', () => {
      const originalMessages = [...initialMessages];
      
      const { result } = renderHook(() =>
        useMessageState({
          messages: initialMessages,
          setMessages: mockSetMessages
        })
      );

      act(() => {
        result.current.addUserMessage('New message');
      });

      // Original array should remain unchanged
      expect(initialMessages).toEqual(originalMessages);
      
      // The function passed to setMessages should create a new array
      const setMessagesFn = mockSetMessages.mock.calls[0][0];
      const newMessages = setMessagesFn(initialMessages);
      expect(newMessages).not.toBe(initialMessages);
      expect(newMessages.length).toBe(initialMessages.length + 1);
    });

    it('should handle rapid successive updates', () => {
      const { result } = renderHook(() =>
        useMessageState({
          messages: [],
          setMessages: mockSetMessages
        })
      );

      act(() => {
        for (let i = 0; i < 10; i++) {
          result.current.addUserMessage(`Message ${i}`);
        }
      });

      expect(mockSetMessages).toHaveBeenCalledTimes(10);
    });
  });

  describe('return value structure', () => {
    it('should return correct interface', () => {
      const { result } = renderHook(() =>
        useMessageState({
          messages: initialMessages,
          setMessages: mockSetMessages
        })
      );

      expect(result.current).toEqual({
        addUserMessage: expect.any(Function),
        addAssistantMessage: expect.any(Function),
        addErrorMessage: expect.any(Function)
      });
    });

    it('should maintain consistent function types across re-renders', () => {
      const { result, rerender } = renderHook(
        (props) => useMessageState(props),
        {
          initialProps: {
            messages: initialMessages,
            setMessages: mockSetMessages
          }
        }
      );

      expect(typeof result.current.addUserMessage).toBe('function');
      expect(typeof result.current.addAssistantMessage).toBe('function');
      expect(typeof result.current.addErrorMessage).toBe('function');

      // Re-render with same props
      rerender({
        messages: initialMessages,
        setMessages: mockSetMessages
      });

      expect(typeof result.current.addUserMessage).toBe('function');
      expect(typeof result.current.addAssistantMessage).toBe('function');
      expect(typeof result.current.addErrorMessage).toBe('function');
    });

    it('should update function references when setMessages changes', () => {
      const newSetMessages = vi.fn();
      
      const { result, rerender } = renderHook(
        (props) => useMessageState(props),
        {
          initialProps: {
            messages: initialMessages,
            setMessages: mockSetMessages
          }
        }
      );

      const initialAddUser = result.current.addUserMessage;

      // Re-render with different setMessages
      rerender({
        messages: initialMessages,
        setMessages: newSetMessages
      });

      // Functions should be different since setMessages dependency changed
      expect(result.current.addUserMessage).not.toBe(initialAddUser);
    });
  });

  describe('edge cases', () => {
    it('should handle empty messages array', () => {
      const { result } = renderHook(() =>
        useMessageState({
          messages: [],
          setMessages: mockSetMessages
        })
      );

      act(() => {
        result.current.addUserMessage('First message');
      });

      const setMessagesFn = mockSetMessages.mock.calls[0][0];
      const newMessages = setMessagesFn([]);

      expect(newMessages).toHaveLength(1);
      expect(newMessages[0].role).toBe('user');
      expect(newMessages[0].content).toBe('First message');
    });

    it('should handle special characters in messages', () => {
      const { result } = renderHook(() =>
        useMessageState({
          messages: [],
          setMessages: mockSetMessages
        })
      );

      const specialContent = 'Hello 🌍! @user #hashtag $100 100% "quotes" <tags>';

      act(() => {
        result.current.addUserMessage(specialContent);
      });

      const setMessagesFn = mockSetMessages.mock.calls[0][0];
      const newMessages = setMessagesFn([]);

      expect(newMessages[0].content).toBe(specialContent);
    });

    it('should handle very large message arrays', () => {
      const largeMessageArray: Message[] = Array.from({ length: 1000 }, (_, i) => ({
        role: i % 2 === 0 ? 'user' : 'assistant',
        content: `Message ${i}`,
        created_at: new Date(Date.now() - (1000 - i) * 1000).toISOString()
      }));

      const { result } = renderHook(() =>
        useMessageState({
          messages: largeMessageArray,
          setMessages: mockSetMessages
        })
      );

      act(() => {
        result.current.addUserMessage('New message');
      });

      const setMessagesFn = mockSetMessages.mock.calls[0][0];
      const newMessages = setMessagesFn(largeMessageArray);

      expect(newMessages).toHaveLength(1001);
      expect(newMessages[1000].content).toBe('New message');
    });
  });
}); 