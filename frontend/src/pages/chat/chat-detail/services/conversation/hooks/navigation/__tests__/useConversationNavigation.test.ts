import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useConversationNavigation } from '../useConversationNavigation';

// Mock react-router-dom
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate
}));

describe('useConversationNavigation', () => {
  const mockCallbacks = {
    onConversationLoad: vi.fn(),
    onConversationClear: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with navigation functions', () => {
    const { result } = renderHook(() => useConversationNavigation(mockCallbacks));

    expect(typeof result.current.handleConversationSelect).toBe('function');
    expect(typeof result.current.handleNewChat).toBe('function');
    expect(typeof result.current.navigateToConversation).toBe('function');
    expect(typeof result.current.navigateToChat).toBe('function');
  });

  describe('navigateToConversation', () => {
    it('should navigate to conversation with correct URL', () => {
      const { result } = renderHook(() => useConversationNavigation(mockCallbacks));

      result.current.navigateToConversation('conv-123');

      expect(mockNavigate).toHaveBeenCalledWith('/chat/conv-123', { replace: false });
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });

    it('should handle numeric conversation IDs', () => {
      const { result } = renderHook(() => useConversationNavigation(mockCallbacks));

      result.current.navigateToConversation('456');

      expect(mockNavigate).toHaveBeenCalledWith('/chat/456', { replace: false });
    });

    it('should handle empty string conversation IDs', () => {
      const { result } = renderHook(() => useConversationNavigation(mockCallbacks));

      result.current.navigateToConversation('');

      expect(mockNavigate).toHaveBeenCalledWith('/chat/', { replace: false });
    });
  });

  describe('navigateToChat', () => {
    it('should navigate to chat home correctly', () => {
      const { result } = renderHook(() => useConversationNavigation(mockCallbacks));

      result.current.navigateToChat();

      expect(mockNavigate).toHaveBeenCalledWith('/chat', { replace: false });
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  describe('handleConversationSelect', () => {
    it('should call onConversationLoad with correct ID', async () => {
      mockCallbacks.onConversationLoad.mockResolvedValue(true);
      
      const { result } = renderHook(() => useConversationNavigation(mockCallbacks));

      const conversation = { 
        id: 'conv-123', 
        title: 'Test Chat',
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z'
      };

      result.current.handleConversationSelect(conversation);

      expect(mockCallbacks.onConversationLoad).toHaveBeenCalledWith('conv-123');
      expect(mockCallbacks.onConversationLoad).toHaveBeenCalledTimes(1);
    });

    it('should handle numeric conversation IDs', () => {
      const { result } = renderHook(() => useConversationNavigation(mockCallbacks));

      const conversation = { 
        id: 456, 
        title: 'Numeric ID Chat',
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z'
      };

      result.current.handleConversationSelect(conversation);

      expect(mockCallbacks.onConversationLoad).toHaveBeenCalledWith('456');
    });

    it('should handle conversation load errors gracefully', async () => {
      const mockError = new Error('Load failed');
      mockCallbacks.onConversationLoad.mockRejectedValue(mockError);
      
      const { result } = renderHook(() => useConversationNavigation(mockCallbacks));

      const conversation = { 
        id: 'conv-error', 
        title: 'Error Chat',
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z'
      };

      // Should not throw
      expect(() => {
        result.current.handleConversationSelect(conversation);
      }).not.toThrow();

      expect(mockCallbacks.onConversationLoad).toHaveBeenCalledWith('conv-error');
    });

    it('should work without onConversationLoad callback', () => {
      const { result } = renderHook(() => useConversationNavigation({}));

      const conversation = { 
        id: 'conv-123', 
        title: 'Test Chat',
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z'
      };

      // Should not throw when callback is not provided
      expect(() => {
        result.current.handleConversationSelect(conversation);
      }).not.toThrow();
    });
  });

  describe('handleNewChat', () => {
    it('should call onConversationClear callback', () => {
      const { result } = renderHook(() => useConversationNavigation(mockCallbacks));

      result.current.handleNewChat();

      expect(mockCallbacks.onConversationClear).toHaveBeenCalledTimes(1);
      expect(mockCallbacks.onConversationClear).toHaveBeenCalledWith();
    });

    it('should work without onConversationClear callback', () => {
      const { result } = renderHook(() => useConversationNavigation({}));

      // Should not throw when callback is not provided
      expect(() => {
        result.current.handleNewChat();
      }).not.toThrow();
    });
  });

  describe('callback coordination', () => {
    it('should support undefined callbacks', () => {
      const { result } = renderHook(() => useConversationNavigation({
        onConversationLoad: undefined,
        onConversationClear: undefined
      }));

      // Should not throw with undefined callbacks
      expect(() => {
        result.current.handleNewChat();
        result.current.handleConversationSelect({ 
          id: 'test', 
          title: 'Test',
          created_at: '2024-01-01T10:00:00Z',
          updated_at: '2024-01-01T10:00:00Z'
        });
      }).not.toThrow();
    });

    it('should handle async conversation loading', async () => {
      mockCallbacks.onConversationLoad.mockImplementation(() => 
        new Promise(resolve => setTimeout(() => resolve(true), 10))
      );

      const { result } = renderHook(() => useConversationNavigation(mockCallbacks));

      const conversation = { 
        id: 'async-conv', 
        title: 'Async Chat',
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z'
      };

      result.current.handleConversationSelect(conversation);

      expect(mockCallbacks.onConversationLoad).toHaveBeenCalledWith('async-conv');
    });
  });

  describe('navigation independence', () => {
    it('should not navigate when handling conversation selection', () => {
      const { result } = renderHook(() => useConversationNavigation(mockCallbacks));

      const conversation = { 
        id: 'conv-123', 
        title: 'Test Chat',
        created_at: '2024-01-01T10:00:00Z',
        updated_at: '2024-01-01T10:00:00Z'
      };

      result.current.handleConversationSelect(conversation);

      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should not navigate when handling new chat', () => {
      const { result } = renderHook(() => useConversationNavigation(mockCallbacks));

      result.current.handleNewChat();

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('multiple operations', () => {
    it('should handle multiple conversation selections', () => {
      const { result } = renderHook(() => useConversationNavigation(mockCallbacks));

      const conversations = [
        { id: 'conv-1', title: 'Chat 1', created_at: '2024-01-01T10:00:00Z', updated_at: '2024-01-01T10:00:00Z' },
        { id: 'conv-2', title: 'Chat 2', created_at: '2024-01-01T10:01:00Z', updated_at: '2024-01-01T10:01:00Z' },
        { id: 'conv-3', title: 'Chat 3', created_at: '2024-01-01T10:02:00Z', updated_at: '2024-01-01T10:02:00Z' }
      ];

      conversations.forEach(conv => {
        result.current.handleConversationSelect(conv);
      });

      expect(mockCallbacks.onConversationLoad).toHaveBeenCalledTimes(3);
      expect(mockCallbacks.onConversationLoad).toHaveBeenCalledWith('conv-1');
      expect(mockCallbacks.onConversationLoad).toHaveBeenCalledWith('conv-2');
      expect(mockCallbacks.onConversationLoad).toHaveBeenCalledWith('conv-3');
    });

    it('should handle multiple navigation calls', () => {
      const { result } = renderHook(() => useConversationNavigation(mockCallbacks));

      result.current.navigateToConversation('conv-1');
      result.current.navigateToChat();
      result.current.navigateToConversation('conv-2');

      expect(mockNavigate).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenNthCalledWith(1, '/chat/conv-1', { replace: false });
      expect(mockNavigate).toHaveBeenNthCalledWith(2, '/chat', { replace: false });
      expect(mockNavigate).toHaveBeenNthCalledWith(3, '/chat/conv-2', { replace: false });
    });
  });
}); 