import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useConversationLoader } from '../useConversationLoader';
import { conversationService } from '../../../conversationService';

// Mock the conversation service
vi.mock('../../../conversationService');

const mockConversationService = vi.mocked(conversationService);

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
    const { result } = renderHook(() => useConversationLoader(mockProps));

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
    mockConversationService.fetchConversation.mockResolvedValue(mockConversation);

    const { result } = renderHook(() => useConversationLoader(mockProps));

    let success: boolean;
    await act(async () => {
      success = await result.current.loadConversation('conv-123');
    });

    expect(success!).toBe(true);
    expect(mockConversationService.fetchConversation).toHaveBeenCalledWith('conv-123');
    expect(mockSetters.setMessages).toHaveBeenCalledWith(mockConversation.messages);
    expect(mockSetters.setCurrentConversationId).toHaveBeenCalledWith('conv-123');
    expect(mockSetters.setAssessmentId).toHaveBeenCalledWith('assess-1');
    expect(mockSetters.setAssessmentObject).toHaveBeenCalledWith(mockConversation.assessment_object);
  });

  it('should handle loading errors gracefully', async () => {
    const mockError = new Error('Network failed');
    mockConversationService.fetchConversation.mockRejectedValue(mockError);

    const { result } = renderHook(() => useConversationLoader(mockProps));

    let success: boolean;
    await act(async () => {
      success = await result.current.loadConversation('conv-123');
    });

    expect(success!).toBe(false);
    expect(mockConversationService.fetchConversation).toHaveBeenCalledWith('conv-123');
    
    // Should not call setters on error
    expect(mockSetters.setMessages).not.toHaveBeenCalled();
    expect(mockSetters.setCurrentConversationId).not.toHaveBeenCalled();
    expect(mockSetters.setAssessmentId).not.toHaveBeenCalled();
    expect(mockSetters.setAssessmentObject).not.toHaveBeenCalled();
  });

  it('should handle null response (404 case) gracefully', async () => {
    mockConversationService.fetchConversation.mockResolvedValue(null);

    const { result } = renderHook(() => useConversationLoader(mockProps));

    let success: boolean;
    await act(async () => {
      success = await result.current.loadConversation('nonexistent-conv');
    });

    expect(success!).toBe(false);
    expect(mockConversationService.fetchConversation).toHaveBeenCalledWith('nonexistent-conv');
    
    // Should not call setters for null response
    expect(mockSetters.setMessages).not.toHaveBeenCalled();
    expect(mockSetters.setCurrentConversationId).not.toHaveBeenCalled();
  });

  it('should manage loading state correctly during async operations', async () => {
    let resolvePromise: (value: any) => void;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockConversationService.fetchConversation.mockReturnValue(pendingPromise);

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
      assessment_id: undefined
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
    mockConversationService.fetchConversation.mockResolvedValue(mockConversation);

    const { result } = renderHook(() => useConversationLoader(mockProps));

    let success: boolean;
    await act(async () => {
      success = await result.current.loadConversation('conv-no-assessment');
    });

    expect(success!).toBe(true);
    expect(mockSetters.setMessages).toHaveBeenCalledWith(mockConversation.messages);
    expect(mockSetters.setCurrentConversationId).toHaveBeenCalledWith('conv-no-assessment');
    expect(mockSetters.setAssessmentId).toHaveBeenCalledWith(undefined);
    expect(mockSetters.setAssessmentObject).toHaveBeenCalledWith(undefined);
  });

  it('should handle empty messages array', async () => {
    const mockConversation = {
      id: 'conv-empty',
      messages: [],
      assessment_id: 'assess-1'
    };
    mockConversationService.fetchConversation.mockResolvedValue(mockConversation);

    const { result } = renderHook(() => useConversationLoader(mockProps));

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

    mockConversationService.fetchConversation
      .mockResolvedValueOnce(mockConversation1)
      .mockResolvedValueOnce(mockConversation2);

    const { result } = renderHook(() => useConversationLoader(mockProps));

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
    expect(mockConversationService.fetchConversation).toHaveBeenCalledTimes(2);
  });

  it('should handle auto-loading on mount when conversationId provided', () => {
    const mockConversation = { id: 'conv-123', messages: [] };
    mockConversationService.fetchConversation.mockResolvedValue(mockConversation);

    renderHook(() => useConversationLoader({
      ...mockProps,
      conversationId: 'conv-123',
      currentConversationId: null
    }));

    // Should auto-load when conversationId is provided and different from current
    expect(mockConversationService.fetchConversation).toHaveBeenCalledWith('conv-123');
  });

  it('should not auto-load when conversationId matches currentConversationId', () => {
    renderHook(() => useConversationLoader({
      ...mockProps,
      conversationId: 'conv-123',
      currentConversationId: 'conv-123'
    }));

    // Should not auto-load when IDs match
    expect(mockConversationService.fetchConversation).not.toHaveBeenCalled();
  });

  it('should not auto-load when no conversationId provided', () => {
    renderHook(() => useConversationLoader({
      ...mockProps,
      conversationId: undefined,
      currentConversationId: null
    }));

    // Should not auto-load when no conversationId
    expect(mockConversationService.fetchConversation).not.toHaveBeenCalled();
  });

  it('should handle conversationId changes during component lifecycle', () => {
    const mockConversation1 = { id: 'conv-1', messages: [] };
    const mockConversation2 = { id: 'conv-2', messages: [] };

    mockConversationService.fetchConversation
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

    expect(mockConversationService.fetchConversation).toHaveBeenCalledWith('conv-1');

    // Change conversationId
    rerender({ conversationId: 'conv-2' });

    expect(mockConversationService.fetchConversation).toHaveBeenCalledWith('conv-2');
    expect(mockConversationService.fetchConversation).toHaveBeenCalledTimes(2);
  });
}); 