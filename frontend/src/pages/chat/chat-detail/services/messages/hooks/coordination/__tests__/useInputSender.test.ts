import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInputSender } from '../useInputSender';

describe('useInputSender', () => {
  let mockClearInput: ReturnType<typeof vi.fn>;
  let mockOnSend: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockClearInput = vi.fn();
    mockOnSend = vi.fn();
  });

  describe('sendFromInput functionality', () => {
    it('should send message when input has content', async () => {
      mockOnSend.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useInputSender({
          input: 'Hello world',
          clearInput: mockClearInput,
          onSend: mockOnSend
        })
      );

      await act(async () => {
        await result.current.sendFromInput();
      });

      expect(mockClearInput).toHaveBeenCalledTimes(1);
      expect(mockOnSend).toHaveBeenCalledWith('Hello world');
    });

    it('should not send message when input is empty', async () => {
      const { result } = renderHook(() =>
        useInputSender({
          input: '',
          clearInput: mockClearInput,
          onSend: mockOnSend
        })
      );

      await act(async () => {
        await result.current.sendFromInput();
      });

      expect(mockClearInput).not.toHaveBeenCalled();
      expect(mockOnSend).not.toHaveBeenCalled();
    });

    it('should not send message when input is only whitespace', async () => {
      const { result } = renderHook(() =>
        useInputSender({
          input: '   \n\t  ',
          clearInput: mockClearInput,
          onSend: mockOnSend
        })
      );

      await act(async () => {
        await result.current.sendFromInput();
      });

      expect(mockClearInput).not.toHaveBeenCalled();
      expect(mockOnSend).not.toHaveBeenCalled();
    });

    it('should trim whitespace from message before sending', async () => {
      mockOnSend.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useInputSender({
          input: '  Hello world  ',
          clearInput: mockClearInput,
          onSend: mockOnSend
        })
      );

      await act(async () => {
        await result.current.sendFromInput();
      });

      expect(mockClearInput).toHaveBeenCalledTimes(1);
      expect(mockOnSend).toHaveBeenCalledWith('Hello world');
    });

    it('should clear input immediately before sending', async () => {
      const callOrder: string[] = [];
      
      mockClearInput.mockImplementation(() => {
        callOrder.push('clearInput');
      });
      
      mockOnSend.mockImplementation(async () => {
        callOrder.push('onSend');
        return Promise.resolve();
      });

      const { result } = renderHook(() =>
        useInputSender({
          input: 'Test message',
          clearInput: mockClearInput,
          onSend: mockOnSend
        })
      );

      await act(async () => {
        await result.current.sendFromInput();
      });

      expect(callOrder).toEqual(['clearInput', 'onSend']);
    });
  });

  describe('error handling', () => {
    it('should handle onSend errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const sendError = new Error('Failed to send message');
      mockOnSend.mockRejectedValue(sendError);

      const { result } = renderHook(() =>
        useInputSender({
          input: 'Test message',
          clearInput: mockClearInput,
          onSend: mockOnSend
        })
      );

      await act(async () => {
        await result.current.sendFromInput();
      });

      expect(mockClearInput).toHaveBeenCalledTimes(1);
      expect(mockOnSend).toHaveBeenCalledWith('Test message');
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[useInputSender] Failed to send message from input:',
        sendError
      );

      consoleErrorSpy.mockRestore();
    });

    it('should not restore input when onSend fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockOnSend.mockRejectedValue(new Error('Network error'));

      const { result } = renderHook(() =>
        useInputSender({
          input: 'Test message',
          clearInput: mockClearInput,
          onSend: mockOnSend
        })
      );

      await act(async () => {
        await result.current.sendFromInput();
      });

      // Input should still be cleared even if send fails
      expect(mockClearInput).toHaveBeenCalledTimes(1);

      consoleErrorSpy.mockRestore();
    });
  });

  describe('integration scenarios', () => {
    it('should handle multiple consecutive sends', async () => {
      mockOnSend.mockResolvedValue(undefined);

      const { result, rerender } = renderHook(
        (props) => useInputSender(props),
        {
          initialProps: {
            input: 'First message',
            clearInput: mockClearInput,
            onSend: mockOnSend
          }
        }
      );

      // First send
      await act(async () => {
        await result.current.sendFromInput();
      });

      // Update props for second message
      rerender({
        input: 'Second message',
        clearInput: mockClearInput,
        onSend: mockOnSend
      });

      // Second send
      await act(async () => {
        await result.current.sendFromInput();
      });

      expect(mockClearInput).toHaveBeenCalledTimes(2);
      expect(mockOnSend).toHaveBeenNthCalledWith(1, 'First message');
      expect(mockOnSend).toHaveBeenNthCalledWith(2, 'Second message');
    });

    it('should handle async onSend operations', async () => {
      let resolveOnSend: (value?: unknown) => void;
      const onSendPromise = new Promise((resolve) => {
        resolveOnSend = resolve;
      });
      
      mockOnSend.mockReturnValue(onSendPromise);

      const { result } = renderHook(() =>
        useInputSender({
          input: 'Async message',
          clearInput: mockClearInput,
          onSend: mockOnSend
        })
      );

      // Start the send operation
      const sendPromise = act(async () => {
        await result.current.sendFromInput();
      });

      // Clear input should be called immediately
      expect(mockClearInput).toHaveBeenCalledTimes(1);
      expect(mockOnSend).toHaveBeenCalledWith('Async message');

      // Resolve the onSend promise
      resolveOnSend!();
      await sendPromise;
    });

    it('should handle rapid successive calls gracefully', async () => {
      mockOnSend.mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useInputSender({
          input: 'Rapid message',
          clearInput: mockClearInput,
          onSend: mockOnSend
        })
      );

      // Multiple rapid calls
      await act(async () => {
        const promises = [
          result.current.sendFromInput(),
          result.current.sendFromInput(),
          result.current.sendFromInput()
        ];
        await Promise.all(promises);
      });

      // All calls should go through since input isn't being checked for changes
      expect(mockClearInput).toHaveBeenCalledTimes(3);
      expect(mockOnSend).toHaveBeenCalledTimes(3);
    });
  });

  describe('return value structure', () => {
    it('should return object with sendFromInput function', () => {
      const { result } = renderHook(() =>
        useInputSender({
          input: 'Test',
          clearInput: mockClearInput,
          onSend: mockOnSend
        })
      );

      expect(result.current).toEqual({
        sendFromInput: expect.any(Function)
      });
    });

    it('should maintain consistent function type for sendFromInput', () => {
      const { result, rerender } = renderHook(
        (props) => useInputSender(props),
        {
          initialProps: {
            input: 'Test 1',
            clearInput: mockClearInput,
            onSend: mockOnSend
          }
        }
      );

      expect(typeof result.current.sendFromInput).toBe('function');

      rerender({
        input: 'Test 2',
        clearInput: mockClearInput,
        onSend: mockOnSend
      });

      // Should still be a function even if reference changes
      expect(typeof result.current.sendFromInput).toBe('function');
    });
  });
}); 