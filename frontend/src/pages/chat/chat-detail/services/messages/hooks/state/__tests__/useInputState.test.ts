import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInputState } from '../useInputState';

describe('useInputState', () => {
  describe('initialization', () => {
    it('should initialize with empty string by default', () => {
      const { result } = renderHook(() => useInputState());

      expect(result.current.input).toBe('');
    });

    it('should initialize with provided initial value', () => {
      const { result } = renderHook(() => 
        useInputState({ initialValue: 'Hello world' })
      );

      expect(result.current.input).toBe('Hello world');
    });

    it('should handle undefined initial value', () => {
      const { result } = renderHook(() => 
        useInputState({ initialValue: undefined })
      );

      expect(result.current.input).toBe('');
    });
  });

  describe('input management', () => {
    it('should update input value', () => {
      const { result } = renderHook(() => useInputState());

      act(() => {
        result.current.setInput('New value');
      });

      expect(result.current.input).toBe('New value');
    });

    it('should clear input value', () => {
      const { result } = renderHook(() => 
        useInputState({ initialValue: 'Some text' })
      );

      expect(result.current.input).toBe('Some text');

      act(() => {
        result.current.clearInput();
      });

      expect(result.current.input).toBe('');
    });

    it('should handle multiple input updates', () => {
      const { result } = renderHook(() => useInputState());

      act(() => {
        result.current.setInput('First');
      });
      expect(result.current.input).toBe('First');

      act(() => {
        result.current.setInput('Second');
      });
      expect(result.current.input).toBe('Second');

      act(() => {
        result.current.setInput('Third');
      });
      expect(result.current.input).toBe('Third');
    });

    it('should handle empty string input', () => {
      const { result } = renderHook(() => 
        useInputState({ initialValue: 'Initial' })
      );

      act(() => {
        result.current.setInput('');
      });

      expect(result.current.input).toBe('');
    });

    it('should handle special characters and unicode', () => {
      const { result } = renderHook(() => useInputState());

      const specialText = 'Hello 🌍! @user #hashtag $100 100% ñoño';

      act(() => {
        result.current.setInput(specialText);
      });

      expect(result.current.input).toBe(specialText);
    });
  });

  describe('sendFromInput functionality', () => {
    it('should send message when input has content and onSend is provided', async () => {
      const mockOnSend = vi.fn().mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useInputState({
          initialValue: 'Hello world',
          onSend: mockOnSend
        })
      );

      await act(async () => {
        await result.current.sendFromInput();
      });

      expect(mockOnSend).toHaveBeenCalledWith('Hello world');
      expect(result.current.input).toBe(''); // Should clear after sending
    });

    it('should not send when input is empty', async () => {
      const mockOnSend = vi.fn();

      const { result } = renderHook(() =>
        useInputState({
          initialValue: '',
          onSend: mockOnSend
        })
      );

      await act(async () => {
        await result.current.sendFromInput();
      });

      expect(mockOnSend).not.toHaveBeenCalled();
    });

    it('should not send when onSend is not provided', async () => {
      const { result } = renderHook(() =>
        useInputState({ initialValue: 'Some text' })
      );

      await act(async () => {
        await result.current.sendFromInput();
      });

      // Should not throw and input should remain
      expect(result.current.input).toBe('Some text');
    });

    it('should trim whitespace before sending', async () => {
      const mockOnSend = vi.fn().mockResolvedValue(undefined);

      const { result } = renderHook(() =>
        useInputState({
          initialValue: '  Hello world  ',
          onSend: mockOnSend
        })
      );

      await act(async () => {
        await result.current.sendFromInput();
      });

      expect(mockOnSend).toHaveBeenCalledWith('Hello world');
    });

    it('should handle onSend errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const mockOnSend = vi.fn().mockRejectedValue(new Error('Send failed'));

      const { result } = renderHook(() =>
        useInputState({
          initialValue: 'Test message',
          onSend: mockOnSend
        })
      );

      await act(async () => {
        await result.current.sendFromInput();
      });

      expect(mockOnSend).toHaveBeenCalledWith('Test message');
      expect(result.current.input).toBe(''); // Should still clear input
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[useInputState] Failed to send message from input:',
        expect.any(Error)
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe('keyboard event handling', () => {
    it('should call onEnter when Enter key is pressed', () => {
      const mockOnEnter = vi.fn();
      const { result } = renderHook(() => useInputState());

      const mockEvent = {
        key: 'Enter',
        preventDefault: vi.fn()
      } as any;

      act(() => {
        result.current.handleKeyDown(mockEvent, mockOnEnter);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
      expect(mockOnEnter).toHaveBeenCalledTimes(1);
    });

    it('should call sendFromInput when Enter is pressed and no onEnter provided but onSend is available', async () => {
      const mockOnSend = vi.fn().mockResolvedValue(undefined);
      const { result } = renderHook(() => 
        useInputState({ 
          initialValue: 'Test message',
          onSend: mockOnSend 
        })
      );

      const mockEvent = {
        key: 'Enter',
        preventDefault: vi.fn()
      } as any;

      await act(async () => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
      expect(mockOnSend).toHaveBeenCalledWith('Test message');
    });

    it('should prioritize onEnter over sendFromInput', async () => {
      const mockOnEnter = vi.fn();
      const mockOnSend = vi.fn();
      
      const { result } = renderHook(() => 
        useInputState({ 
          initialValue: 'Test message',
          onSend: mockOnSend 
        })
      );

      const mockEvent = {
        key: 'Enter',
        preventDefault: vi.fn()
      } as any;

      act(() => {
        result.current.handleKeyDown(mockEvent, mockOnEnter);
      });

      expect(mockOnEnter).toHaveBeenCalledTimes(1);
      expect(mockOnSend).not.toHaveBeenCalled();
    });

    it('should not call onEnter for other keys', () => {
      const mockOnEnter = vi.fn();
      const { result } = renderHook(() => useInputState());

      const mockEvent = {
        key: 'Space',
        preventDefault: vi.fn()
      } as any;

      act(() => {
        result.current.handleKeyDown(mockEvent, mockOnEnter);
      });

      expect(mockEvent.preventDefault).not.toHaveBeenCalled();
      expect(mockOnEnter).not.toHaveBeenCalled();
    });

    it('should handle Enter without onEnter callback', () => {
      const { result } = renderHook(() => useInputState());

      const mockEvent = {
        key: 'Enter',
        preventDefault: vi.fn()
      } as any;

      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    });

    it('should handle various key combinations', () => {
      const mockOnEnter = vi.fn();
      const { result } = renderHook(() => useInputState());

      const keys = ['Escape', 'Tab', 'ArrowUp', 'ArrowDown', 'Backspace', 'Delete'];

      keys.forEach(key => {
        const mockEvent = {
          key,
          preventDefault: vi.fn()
        } as any;

        act(() => {
          result.current.handleKeyDown(mockEvent, mockOnEnter);
        });

        expect(mockEvent.preventDefault).not.toHaveBeenCalled();
        expect(mockOnEnter).not.toHaveBeenCalled();
      });
    });

    it('should prevent default on Enter regardless of callback presence', () => {
      const { result } = renderHook(() => useInputState());

      const mockEvent = {
        key: 'Enter',
        preventDefault: vi.fn()
      } as any;

      // Test without callback
      act(() => {
        result.current.handleKeyDown(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);

      // Reset mock
      mockEvent.preventDefault.mockClear();

      // Test with callback
      act(() => {
        result.current.handleKeyDown(mockEvent, vi.fn());
      });

      expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    });
  });

  describe('return value structure', () => {
    it('should return correct interface', () => {
      const { result } = renderHook(() => useInputState());

      expect(result.current).toEqual({
        input: expect.any(String),
        setInput: expect.any(Function),
        clearInput: expect.any(Function),
        handleKeyDown: expect.any(Function),
        sendFromInput: expect.any(Function)
      });
    });

    it('should maintain consistent function types across re-renders', () => {
      const { result, rerender } = renderHook((props) => useInputState(props), {
        initialProps: { initialValue: 'test' }
      });

      expect(typeof result.current.setInput).toBe('function');
      expect(typeof result.current.clearInput).toBe('function');
      expect(typeof result.current.handleKeyDown).toBe('function');
      expect(typeof result.current.sendFromInput).toBe('function');

      rerender({ initialValue: 'test' });

      expect(typeof result.current.setInput).toBe('function');
      expect(typeof result.current.clearInput).toBe('function');
      expect(typeof result.current.handleKeyDown).toBe('function');
      expect(typeof result.current.sendFromInput).toBe('function');
    });
  });

  describe('edge cases', () => {
    it('should handle null and undefined inputs gracefully', () => {
      const { result } = renderHook(() => useInputState());

      act(() => {
        result.current.setInput(null as any);
      });

      expect(result.current.input).toBe(null);

      act(() => {
        result.current.setInput(undefined as any);
      });

      expect(result.current.input).toBe(undefined);
    });

    it('should handle very long strings', () => {
      const { result } = renderHook(() => useInputState());

      const longString = 'A'.repeat(10000);

      act(() => {
        result.current.setInput(longString);
      });

      expect(result.current.input).toBe(longString);
      expect(result.current.input.length).toBe(10000);
    });

    it('should handle rapid state changes', () => {
      const { result } = renderHook(() => useInputState());

      act(() => {
        for (let i = 0; i < 100; i++) {
          result.current.setInput(`Value ${i}`);
        }
      });

      expect(result.current.input).toBe('Value 99');
    });
  });

  describe('props changes', () => {
    it('should not reset input when props change', () => {
      const { result, rerender } = renderHook(
        (props) => useInputState(props),
        { initialProps: { initialValue: 'initial' } }
      );

      expect(result.current.input).toBe('initial');

      // Change input value
      act(() => {
        result.current.setInput('user typed value');
      });

      expect(result.current.input).toBe('user typed value');

      // Re-render with different initial value - should not affect current input
      rerender({ initialValue: 'different initial' });

      expect(result.current.input).toBe('user typed value');
    });

    it('should only use initialValue on first render', () => {
      const { result, rerender } = renderHook(
        (props) => useInputState(props),
        { initialProps: { initialValue: 'first' } }
      );

      expect(result.current.input).toBe('first');

      rerender({ initialValue: 'second' });

      expect(result.current.input).toBe('first');

      rerender({ initialValue: 'third' });

      expect(result.current.input).toBe('first');
    });
  });

  describe('integration scenarios', () => {
    it('should work in a typical form interaction flow', () => {
      const mockOnEnter = vi.fn();
      const { result } = renderHook(() => useInputState());

      // User types message
      act(() => {
        result.current.setInput('Hello world');
      });

      expect(result.current.input).toBe('Hello world');

      // User presses Enter
      const enterEvent = {
        key: 'Enter',
        preventDefault: vi.fn()
      } as any;

      act(() => {
        result.current.handleKeyDown(enterEvent, mockOnEnter);
      });

      expect(mockOnEnter).toHaveBeenCalledTimes(1);
      expect(enterEvent.preventDefault).toHaveBeenCalledTimes(1);

      // Form clears input after submission
      act(() => {
        result.current.clearInput();
      });

      expect(result.current.input).toBe('');
    });

    it('should handle multiple concurrent interactions', () => {
      const mockOnEnter = vi.fn();
      const { result } = renderHook(() => useInputState());

      // Simulate typing and key events happening together
      act(() => {
        result.current.setInput('Test');
        
        const mockEvent = {
          key: 'Space',
          preventDefault: vi.fn()
        } as any;
        
        result.current.handleKeyDown(mockEvent, mockOnEnter);
        result.current.setInput('Test message');
      });

      expect(result.current.input).toBe('Test message');
      expect(mockOnEnter).not.toHaveBeenCalled();
    });
  });
}); 