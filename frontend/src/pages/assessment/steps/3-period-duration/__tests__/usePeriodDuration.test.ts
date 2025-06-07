import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { usePeriodDuration } from '../../../../pages/assessment/steps/period-duration/hooks/use-period-duration';
import { useAssessmentContext } from '../../../../pages/assessment/context/hooks/use-assessment-context';

// Mock the assessment context
vi.mock('../../use-assessment-context', () => ({
  useAssessmentContext: vi.fn()
}));

describe('usePeriodDuration', () => {
  // Setup mock context before each test
  beforeEach(() => {
    const mockUpdateResult = vi.fn();
    (useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });
  });

  it('should initialize with undefined period duration', () => {
    const { result } = renderHook(() => usePeriodDuration());
    expect(result.current.periodDuration).toBeUndefined();
  });

  it('should return period duration from context state', () => {
    (useAssessmentContext as any).mockReturnValue({
      state: { result: { period_duration: '4-5' } },
      updateResult: vi.fn()
    });

    const { result } = renderHook(() => usePeriodDuration());
    expect(result.current.periodDuration).toBe('4-5');
  });

  it('should update period duration when setPeriodDuration is called', () => {
    const mockUpdateResult = vi.fn();
    (useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });

    const { result } = renderHook(() => usePeriodDuration());
    
    act(() => {
      result.current.setPeriodDuration('4-5');
    });

    expect(mockUpdateResult).toHaveBeenCalledWith({ period_duration: '4-5' });
  });

  it('matches the page implementation in period-duration page', () => {
    // Tests that the hook implementation matches how it's used in the page
    // The period-duration page at /assessment/steps/period-duration/page.tsx
    // uses the usePeriodDuration hook to manage period duration selection
    const mockUpdateResult = vi.fn();
    (useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });

    const { result } = renderHook(() => usePeriodDuration());
    
    act(() => {
      // This simulates the user selecting a period duration in the UI
      // In the page, this happens when handleDurationChange is called with '6-7'
      result.current.setPeriodDuration('6-7');
    });

    // Verify the context was updated as expected
    expect(mockUpdateResult).toHaveBeenCalledWith({ period_duration: '6-7' });
  });
}); 