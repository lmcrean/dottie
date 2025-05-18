import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCycleLength } from '../use-cycle-length';
import * as AssessmentContextModule from '../../context/hooks/use-assessment-context';
import { CycleLength } from '../../../../context/types';

// Mock the context hook
vi.mock('../../use-assessment-context', () => ({
  useAssessmentContext: vi.fn()
}));

describe('useCycleLength hook', () => {
  const mockUpdateResult = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    (AssessmentContextModule.useAssessmentContext as any).mockReturnValue({
      state: { result: { cycle_length: '26-30' as CycleLength } },
      updateResult: mockUpdateResult
    });
  });

  it('should return cycleLength from context state', () => {
    const { result } = renderHook(() => useCycleLength());
    
    expect(result.current.cycleLength).toBe('26-30');
    expect(AssessmentContextModule.useAssessmentContext).toHaveBeenCalledTimes(1);
  });

  it('should call updateResult when setCycleLength is called', () => {
    const { result } = renderHook(() => useCycleLength());
    
    act(() => {
      result.current.setCycleLength('31-35');
    });
    
    expect(mockUpdateResult).toHaveBeenCalledWith({ cycle_length: '31-35' });
  });

  it('should handle undefined cycleLength in context', () => {
    (AssessmentContextModule.useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });
    
    const { result } = renderHook(() => useCycleLength());
    
    expect(result.current.cycleLength).toBeUndefined();
  });
}); 