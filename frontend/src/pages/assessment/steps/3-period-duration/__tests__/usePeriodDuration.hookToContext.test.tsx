import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePeriodDuration } from '../../../../pages/assessment/steps/period-duration/hooks/use-period-duration';
import * as AssessmentContextModule from '../../../../pages/assessment/context/hooks/use-assessment-context';
import { PeriodDuration } from '../../../../context/types';

// Mock the context hook
vi.mock('../../use-assessment-context', () => ({
  useAssessmentContext: vi.fn()
}));

describe('usePeriodDuration hook', () => {
  const mockUpdateResult = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    (AssessmentContextModule.useAssessmentContext as any).mockReturnValue({
      state: { result: { period_duration: '4-5' as PeriodDuration } },
      updateResult: mockUpdateResult
    });
  });

  it('should return periodDuration from context state', () => {
    const { result } = renderHook(() => usePeriodDuration());
    
    expect(result.current.periodDuration).toBe('4-5');
    expect(AssessmentContextModule.useAssessmentContext).toHaveBeenCalledTimes(1);
  });

  it('should call updateResult when setPeriodDuration is called', () => {
    const { result } = renderHook(() => usePeriodDuration());
    
    act(() => {
      result.current.setPeriodDuration('6-7');
    });
    
    expect(mockUpdateResult).toHaveBeenCalledWith({ period_duration: '6-7' });
  });

  it('should handle undefined periodDuration in context', () => {
    (AssessmentContextModule.useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });
    
    const { result } = renderHook(() => usePeriodDuration());
    
    expect(result.current.periodDuration).toBeUndefined();
  });
}); 