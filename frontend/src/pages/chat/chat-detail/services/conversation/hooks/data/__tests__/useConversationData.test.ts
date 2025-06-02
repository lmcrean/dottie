import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useConversationData } from '../useConversationData';
import { useConversationState } from '../useConversationState';
import { useConversationLoader } from '../useConversationLoader';

// Mock the dependency hooks
vi.mock('../useConversationState');
vi.mock('../useConversationLoader');

const mockUseConversationState = vi.mocked(useConversationState);
const mockUseConversationLoader = vi.mocked(useConversationLoader);

describe('useConversationData', () => {
  const mockStateReturn = {
    messages: [],
    setMessages: vi.fn(),
    currentConversationId: null,
    setCurrentConversationId: vi.fn(),
    assessmentId: null,
    setAssessmentId: vi.fn(),
    assessmentObject: null,
    setAssessmentObject: vi.fn(),
    clearConversation: vi.fn()
  };

  const mockLoaderReturn = {
    isLoading: false,
    loadConversation: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseConversationState.mockReturnValue(mockStateReturn);
    mockUseConversationLoader.mockReturnValue(mockLoaderReturn);
  });

  it('should combine state and loader functionality', () => {
    const { result } = renderHook(() => useConversationData({ conversationId: 'conv-123' }));

    // Should include all state properties
    expect(result.current.messages).toEqual([]);
    expect(result.current.setMessages).toBe(mockStateReturn.setMessages);
    expect(result.current.currentConversationId).toBeNull();
    expect(result.current.setCurrentConversationId).toBe(mockStateReturn.setCurrentConversationId);
    expect(result.current.assessmentId).toBeNull();
    expect(result.current.setAssessmentId).toBe(mockStateReturn.setAssessmentId);
    expect(result.current.assessmentObject).toBeNull();
    expect(result.current.setAssessmentObject).toBe(mockStateReturn.setAssessmentObject);
    expect(result.current.clearConversation).toBe(mockStateReturn.clearConversation);

    // Should include loader properties
    expect(result.current.isLoading).toBe(false);
    expect(result.current.loadConversation).toBe(mockLoaderReturn.loadConversation);
  });

  it('should pass conversationId to useConversationState correctly', () => {
    renderHook(() => useConversationData({ conversationId: 'conv-123' }));

    expect(mockUseConversationState).toHaveBeenCalledWith({
      initialConversationId: 'conv-123'
    });
  });

  it('should pass required props to useConversationLoader', () => {
    renderHook(() => useConversationData({ conversationId: 'conv-123' }));

    expect(mockUseConversationLoader).toHaveBeenCalledWith({
      conversationId: 'conv-123',
      setMessages: mockStateReturn.setMessages,
      setCurrentConversationId: mockStateReturn.setCurrentConversationId,
      setAssessmentId: mockStateReturn.setAssessmentId,
      setAssessmentObject: mockStateReturn.setAssessmentObject,
      currentConversationId: mockStateReturn.currentConversationId
    });
  });

  it('should handle undefined conversationId', () => {
    renderHook(() => useConversationData({}));

    expect(mockUseConversationState).toHaveBeenCalledWith({
      initialConversationId: undefined
    });

    expect(mockUseConversationLoader).toHaveBeenCalledWith({
      conversationId: undefined,
      setMessages: mockStateReturn.setMessages,
      setCurrentConversationId: mockStateReturn.setCurrentConversationId,
      setAssessmentId: mockStateReturn.setAssessmentId,
      setAssessmentObject: mockStateReturn.setAssessmentObject,
      currentConversationId: mockStateReturn.currentConversationId
    });
  });

  it('should forward state updates correctly', () => {
    const updatedStateReturn = {
      ...mockStateReturn,
      messages: [{ id: 'msg-1', content: 'Hello', role: 'user' as const, created_at: '2024-01-01T10:00:00Z' }],
      currentConversationId: 'conv-123'
    };
    mockUseConversationState.mockReturnValue(updatedStateReturn);

    const { result } = renderHook(() => useConversationData({ conversationId: 'conv-123' }));

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.currentConversationId).toBe('conv-123');
  });

  it('should forward loading state correctly', () => {
    const updatedLoaderReturn = {
      ...mockLoaderReturn,
      isLoading: true
    };
    mockUseConversationLoader.mockReturnValue(updatedLoaderReturn);

    const { result } = renderHook(() => useConversationData({ conversationId: 'conv-123' }));

    expect(result.current.isLoading).toBe(true);
  });

  it('should provide all required interface methods', () => {
    const { result } = renderHook(() => useConversationData({ conversationId: 'conv-123' }));

    // State management
    expect(typeof result.current.setMessages).toBe('function');
    expect(typeof result.current.setCurrentConversationId).toBe('function');
    expect(typeof result.current.setAssessmentId).toBe('function');
    expect(typeof result.current.setAssessmentObject).toBe('function');
    expect(typeof result.current.clearConversation).toBe('function');

    // Loading operations
    expect(typeof result.current.loadConversation).toBe('function');
    expect(typeof result.current.isLoading).toBe('boolean');
  });

  it('should handle re-renders with changing conversationId', () => {
    const { rerender } = renderHook(
      ({ conversationId }) => useConversationData({ conversationId }),
      { initialProps: { conversationId: 'conv-123' } }
    );

    // Re-render with different ID
    rerender({ conversationId: 'conv-456' });

    // Should call hooks with new ID
    expect(mockUseConversationState).toHaveBeenLastCalledWith({
      initialConversationId: 'conv-456'
    });

    expect(mockUseConversationLoader).toHaveBeenLastCalledWith({
      conversationId: 'conv-456',
      setMessages: mockStateReturn.setMessages,
      setCurrentConversationId: mockStateReturn.setCurrentConversationId,
      setAssessmentId: mockStateReturn.setAssessmentId,
      setAssessmentObject: mockStateReturn.setAssessmentObject,
      currentConversationId: mockStateReturn.currentConversationId
    });
  });
}); 