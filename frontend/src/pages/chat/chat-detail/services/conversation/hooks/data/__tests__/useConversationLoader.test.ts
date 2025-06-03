import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useConversationLoader } from '../useConversationLoader';
import { conversationApi } from '../../../api';

// Mock the conversation API
vi.mock('../../../api');

const mockConversationApi = vi.mocked(conversationApi);

describe('useConversationLoader', () => {
  const mockSetters = {
    setMessages: vi.fn(),
    setCurrentConversationId: vi.fn(),
    setAssessmentId: vi.fn(),
    setAssessmentObject: vi.fn()
  };

  const mockProps = {
    conversationId: 'conv-123',
    currentConversationId: null,
    ...mockSetters
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state false', () => {
    const { result } = renderHook(() => useConversationLoader({
      ...mockProps,
      conversationId: undefined, // No conversationId so no auto-loading
      currentConversationId: null
    }));

    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.loadConversation).toBe('function');
  });

  it('should load conversation successfully', async () => {
    const mockConversation = {
      id: 'conv-123',
      messages: [
        { id: 'msg-1', content: 'Hello', role: 'user', created_at: '2024-01-01T10:00:00Z' },
        { id: 'msg-2', content: 'Hi there!', role: 'assistant', created_at: '2024-01-01T10:01:00Z' }
      ],
      assessment_id: 'assess-1',
      assessment_object: {
        id: 'assess-1',
        pattern: 'regular',
        key_findings: ['Normal cycle']
      }
    };
    mockConversationApi.fetchConversation.mockResolvedValue(mockConversation);

    const { result } = renderHook(() => useConversationLoader({
      ...mockProps,
      conversationId: undefined, // No auto-loading
      currentConversationId: null
    }));

    let success: boolean;
    await act(async () => {
      success = await result.current.loadConversation('conv-123');
    });

    expect(success!).toBe(true);
    expect(mockConversationApi.fetchConversation).toHaveBeenCalledWith('conv-123');
    expect(mockSetters.setMessages).toHaveBeenCalledWith([
      { role: 'user', content: 'Hello', created_at: '2024-01-01T10:00:00Z' },
      { role: 'assistant', content: 'Hi there!', created_at: '2024-01-01T10:01:00Z' }
    ]);
    expect(mockSetters.setCurrentConversationId).toHaveBeenCalledWith('conv-123');
    expect(mockSetters.setAssessmentId).toHaveBeenCalledWith('assess-1');
    expect(mockSetters.setAssessmentObject).toHaveBeenCalledWith(mockConversation.assessment_object);
  });

  it('should handle loading errors gracefully', async () => {
    const mockError = new Error('Network failed');
    mockConversationApi.fetchConversation.mockRejectedValue(mockError);

    const { result } = renderHook(() => useConversationLoader({
      ...mockProps,
      conversationId: undefined, // No auto-loading
      currentConversationId: null
    }));

    let success: boolean;
    await act(async () => {
      success = await result.current.loadConversation('conv-123');
    });

    expect(success!).toBe(false);
    expect(mockConversationApi.fetchConversation).toHaveBeenCalledWith('conv-123');
    
    // Should not call setters on error
    expect(mockSetters.setMessages).not.toHaveBeenCalled();
    expect(mockSetters.setCurrentConversationId).not.toHaveBeenCalled();
    expect(mockSetters.setAssessmentId).not.toHaveBeenCalled();
    expect(mockSetters.setAssessmentObject).not.toHaveBeenCalled();
  });

  it('should handle null response (404 case) gracefully', async () => {
    mockConversationApi.fetchConversation.mockResolvedValue(null);

    const { result } = renderHook(() => useConversationLoader({
      ...mockProps,
      conversationId: undefined, // No auto-loading
      currentConversationId: null
    }));

    let success: boolean;
    await act(async () => {
      success = await result.current.loadConversation('nonexistent-conv');
    });

    expect(success!).toBe(false);
    expect(mockConversationApi.fetchConversation).toHaveBeenCalledWith('nonexistent-conv');
    
    // Should not call setters for null response
    expect(mockSetters.setMessages).not.toHaveBeenCalled();
    expect(mockSetters.setCurrentConversationId).not.toHaveBeenCalled();
  });

  it('should manage loading state correctly during async operations', async () => {
    let resolvePromise: (value: any) => void;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockConversationApi.fetchConversation.mockReturnValue(pendingPromise);

    const { result } = renderHook(() => useConversationLoader(mockProps));

    // Start loading
    const loadPromise = act(async () => {
      return result.current.loadConversation('conv-123');
    });

    // Check loading state is true during loading
    expect(result.current.isLoading).toBe(true);

    // Resolve the promise
    resolvePromise!({
      id: 'conv-123',
      messages: [],
      assessment_id: null
    });

    await loadPromise;

    // Check loading state is false after completion
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle conversation without assessment data', async () => {
    const mockConversation = {
      id: 'conv-no-assessment',
      messages: [
        { id: 'msg-1', content: 'General chat', role: 'user', created_at: '2024-01-01T10:00:00Z' }
      ]
    };
    mockConversationApi.fetchConversation.mockResolvedValue(mockConversation);

    const { result } = renderHook(() => useConversationLoader({
      ...mockProps,
      conversationId: undefined, // No auto-loading
      currentConversationId: null
    }));

    let success: boolean;
    await act(async () => {
      success = await result.current.loadConversation('conv-no-assessment');
    });

    expect(success!).toBe(true);
    expect(mockSetters.setMessages).toHaveBeenCalledWith([
      { role: 'user', content: 'General chat', created_at: '2024-01-01T10:00:00Z' }
    ]);
    expect(mockSetters.setCurrentConversationId).toHaveBeenCalledWith('conv-no-assessment');
    expect(mockSetters.setAssessmentId).toHaveBeenCalledWith(null);
    expect(mockSetters.setAssessmentObject).toHaveBeenCalledWith(null);
  });

  it('should handle empty messages array', async () => {
    const mockConversation = {
      id: 'conv-empty',
      messages: [],
      assessment_id: 'assess-1'
    };
    mockConversationApi.fetchConversation.mockResolvedValue(mockConversation);

    const { result } = renderHook(() => useConversationLoader({
      ...mockProps,
      conversationId: undefined, // No auto-loading
      currentConversationId: null
    }));

    let success: boolean;
    await act(async () => {
      success = await result.current.loadConversation('conv-empty');
    });

    expect(success!).toBe(true);
    expect(mockSetters.setMessages).toHaveBeenCalledWith([]);
    expect(mockSetters.setCurrentConversationId).toHaveBeenCalledWith('conv-empty');
    expect(mockSetters.setAssessmentId).toHaveBeenCalledWith('assess-1');
  });

  it('should handle multiple concurrent load operations', async () => {
    const mockConversation1 = { id: 'conv-1', messages: [] };
    const mockConversation2 = { id: 'conv-2', messages: [] };

    mockConversationApi.fetchConversation
      .mockResolvedValueOnce(mockConversation1)
      .mockResolvedValueOnce(mockConversation2);

    const { result } = renderHook(() => useConversationLoader({
      ...mockProps,
      conversationId: undefined, // No auto-loading
      currentConversationId: null
    }));

    let success1: boolean, success2: boolean;

    await act(async () => {
      const [result1, result2] = await Promise.all([
        result.current.loadConversation('conv-1'),
        result.current.loadConversation('conv-2')
      ]);
      success1 = result1;
      success2 = result2;
    });

    expect(success1!).toBe(true);
    expect(success2!).toBe(true);
    expect(mockConversationApi.fetchConversation).toHaveBeenCalledTimes(2);
  });

  it('should handle auto-loading on mount when conversationId provided', () => {
    const mockConversation = { id: 'conv-123', messages: [] };
    mockConversationApi.fetchConversation.mockResolvedValue(mockConversation);

    renderHook(() => useConversationLoader({
      ...mockProps,
      conversationId: 'conv-123',
      currentConversationId: null
    }));

    // Should auto-load when conversationId is provided and different from current
    expect(mockConversationApi.fetchConversation).toHaveBeenCalledWith('conv-123');
  });

  it('should auto-load when conversationId is provided even if it matches currentConversationId', () => {
    renderHook(() => useConversationLoader({
      ...mockProps,
      conversationId: 'conv-123',
      currentConversationId: 'conv-123'
    }));

    // Should auto-load when conversationId is provided, even if IDs match but conversation hasn't been loaded yet
    expect(mockConversationApi.fetchConversation).toHaveBeenCalledWith('conv-123');
  });

  it('should not auto-load when no conversationId provided', () => {
    renderHook(() => useConversationLoader({
      ...mockProps,
      conversationId: undefined,
      currentConversationId: null
    }));

    // Should not auto-load when no conversationId
    expect(mockConversationApi.fetchConversation).not.toHaveBeenCalled();
  });

  it('should handle conversationId changes during component lifecycle', () => {
    const mockConversation1 = { id: 'conv-1', messages: [] };
    const mockConversation2 = { id: 'conv-2', messages: [] };

    mockConversationApi.fetchConversation
      .mockResolvedValueOnce(mockConversation1)
      .mockResolvedValueOnce(mockConversation2);

    const { rerender } = renderHook(
      ({ conversationId }) => useConversationLoader({
        ...mockProps,
        conversationId,
        currentConversationId: null
      }),
      { initialProps: { conversationId: 'conv-1' } }
    );

    expect(mockConversationApi.fetchConversation).toHaveBeenCalledWith('conv-1');

    // Change conversationId
    rerender({ conversationId: 'conv-2' });

    expect(mockConversationApi.fetchConversation).toHaveBeenCalledWith('conv-2');
    expect(mockConversationApi.fetchConversation).toHaveBeenCalledTimes(2);
  });
}); 