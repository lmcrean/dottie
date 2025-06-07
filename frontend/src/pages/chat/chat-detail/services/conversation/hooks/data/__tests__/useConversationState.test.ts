import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useConversationState } from '../useConversationState';

describe('useConversationState', () => {
  it('should initialize with empty state by default', () => {
    const { result } = renderHook(() => useConversationState({}));

    expect(result.current.messages).toEqual([]);
    expect(result.current.currentConversationId).toBeNull();
    expect(result.current.assessmentId).toBeNull();
    expect(result.current.assessmentObject).toBeNull();
  });

  it('should initialize with provided conversationId', () => {
    const { result } = renderHook(() => useConversationState({ 
      initialConversationId: 'conv-123' 
    }));

    expect(result.current.currentConversationId).toBe('conv-123');
    expect(result.current.messages).toEqual([]);
    expect(result.current.assessmentId).toBeNull();
    expect(result.current.assessmentObject).toBeNull();
  });

  it('should update messages correctly', () => {
    const { result } = renderHook(() => useConversationState({}));

    const testMessages = [
      { id: 'msg-1', content: 'Hello', role: 'user' as const, created_at: '2024-01-01T10:00:00Z' },
      { id: 'msg-2', content: 'Hi there!', role: 'assistant' as const, created_at: '2024-01-01T10:01:00Z' }
    ];

    act(() => {
      result.current.setMessages(testMessages);
    });

    expect(result.current.messages).toEqual(testMessages);
    expect(result.current.messages).toHaveLength(2);
  });

  it('should update currentConversationId correctly', () => {
    const { result } = renderHook(() => useConversationState({}));

    act(() => {
      result.current.setCurrentConversationId('conv-456');
    });

    expect(result.current.currentConversationId).toBe('conv-456');
  });

  it('should update assessmentId correctly', () => {
    const { result } = renderHook(() => useConversationState({}));

    act(() => {
      result.current.setAssessmentId('assess-789');
    });

    expect(result.current.assessmentId).toBe('assess-789');
  });

  it('should update assessmentObject correctly', () => {
    const { result } = renderHook(() => useConversationState({}));

    const testAssessment = {
      id: 'assess-123',
      pattern: 'irregular',
      key_findings: ['Long cycle', 'Heavy flow']
    };

    act(() => {
      result.current.setAssessmentObject(testAssessment);
    });

    expect(result.current.assessmentObject).toEqual(testAssessment);
  });

  it('should clear conversation correctly', () => {
    const { result } = renderHook(() => useConversationState({ 
      initialConversationId: 'conv-123' 
    }));

    // Set some state first
    act(() => {
      result.current.setMessages([
        { id: 'msg-1', content: 'Hello', role: 'user', created_at: '2024-01-01T10:00:00Z' }
      ]);
      result.current.setAssessmentId('assess-123');
      result.current.setAssessmentObject({
        id: 'assess-123',
        pattern: 'regular',
        key_findings: ['Normal cycle']
      });
    });

    // Verify state is set
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.currentConversationId).toBe('conv-123');
    expect(result.current.assessmentId).toBe('assess-123');
    expect(result.current.assessmentObject).toBeTruthy();

    // Clear conversation
    act(() => {
      result.current.clearConversation();
    });

    // Verify all state is cleared
    expect(result.current.messages).toEqual([]);
    expect(result.current.currentConversationId).toBeNull();
    expect(result.current.assessmentId).toBeNull();
    expect(result.current.assessmentObject).toBeNull();
  });

  it('should handle multiple sequential updates', () => {
    const { result } = renderHook(() => useConversationState({}));

    act(() => {
      result.current.setCurrentConversationId('conv-1');
    });

    act(() => {
      result.current.setMessages([
        { id: 'msg-1', content: 'First message', role: 'user', created_at: '2024-01-01T10:00:00Z' }
      ]);
    });

    act(() => {
      result.current.setAssessmentId('assess-1');
    });

    expect(result.current.currentConversationId).toBe('conv-1');
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.assessmentId).toBe('assess-1');

    // Update again
    act(() => {
      result.current.setCurrentConversationId('conv-2');
      result.current.setMessages([
        { id: 'msg-2', content: 'Second message', role: 'assistant', created_at: '2024-01-01T10:02:00Z' }
      ]);
    });

    expect(result.current.currentConversationId).toBe('conv-2');
    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].content).toBe('Second message');
  });

  it('should handle null and undefined values correctly', () => {
    const { result } = renderHook(() => useConversationState({}));

    act(() => {
      result.current.setCurrentConversationId(null);
      result.current.setAssessmentId(null);
      result.current.setAssessmentObject(null);
    });

    expect(result.current.currentConversationId).toBeNull();
    expect(result.current.assessmentId).toBeNull();
    expect(result.current.assessmentObject).toBeNull();
  });

  it('should provide functional state setters', () => {
    const { result } = renderHook(() => useConversationState({}));

    expect(typeof result.current.setMessages).toBe('function');
    expect(typeof result.current.setCurrentConversationId).toBe('function');
    expect(typeof result.current.setAssessmentId).toBe('function');
    expect(typeof result.current.setAssessmentObject).toBe('function');
    expect(typeof result.current.clearConversation).toBe('function');
  });

  it('should handle empty messages array correctly', () => {
    const { result } = renderHook(() => useConversationState({}));

    act(() => {
      result.current.setMessages([]);
    });

    expect(result.current.messages).toEqual([]);
    expect(result.current.messages).toHaveLength(0);
  });

  it('should be callable multiple times safely', () => {
    const { result } = renderHook(() => useConversationState({}));

    // Clear multiple times
    act(() => {
      result.current.clearConversation();
      result.current.clearConversation();
      result.current.clearConversation();
    });

    expect(result.current.messages).toEqual([]);
    expect(result.current.currentConversationId).toBeNull();
    expect(result.current.assessmentId).toBeNull();
    expect(result.current.assessmentObject).toBeNull();
  });

  it('should handle undefined initialConversationId', () => {
    const { result } = renderHook(() => useConversationState({ 
      initialConversationId: undefined 
    }));

    expect(result.current.currentConversationId).toBeNull();
  });

  it('should maintain state consistency across re-renders', () => {
    const { result, rerender } = renderHook(() => useConversationState({}));

    act(() => {
      result.current.setMessages([
        { id: 'msg-1', content: 'Persistent message', role: 'user', created_at: '2024-01-01T10:00:00Z' }
      ]);
      result.current.setCurrentConversationId('persistent-conv');
    });

    rerender();

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].content).toBe('Persistent message');
    expect(result.current.currentConversationId).toBe('persistent-conv');
  });
}); 