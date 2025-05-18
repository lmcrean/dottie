import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { useCycleLength } from '../use-cycle-length';
import { useAssessmentContext } from '../../context/hooks/use-assessment-context';

// Mock the assessment context
vi.mock('../../use-assessment-context', () => ({
  useAssessmentContext: vi.fn()
}));

describe('useCycleLength', () => {
  // Setup mock context before each test
  beforeEach(() => {
    const mockUpdateResult = vi.fn();
    (useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });
  });

  it('should initialize with undefined cycle length', () => {
    const { result } = renderHook(() => useCycleLength());
    expect(result.current.cycleLength).toBeUndefined();
  });

  it('should return cycle length from context state', () => {
    (useAssessmentContext as any).mockReturnValue({
      state: { result: { cycle_length: '26-30' } },
      updateResult: vi.fn()
    });

    const { result } = renderHook(() => useCycleLength());
    expect(result.current.cycleLength).toBe('26-30');
  });

  it('should update cycle length when setCycleLength is called', () => {
    const mockUpdateResult = vi.fn();
    (useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });

    const { result } = renderHook(() => useCycleLength());
    
    act(() => {
      result.current.setCycleLength('26-30');
    });

    expect(mockUpdateResult).toHaveBeenCalledWith({ cycle_length: '26-30' });
  });

  it('matches the page implementation in cycle-length page', () => {
    // Tests that the hook implementation matches how it's used in the page
    // The cycle-length page at /assessment/steps/cycle-length/page.tsx
    // uses the useCycleLength hook to manage cycle length selection
    const mockUpdateResult = vi.fn();
    (useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });

    const { result } = renderHook(() => useCycleLength());
    
    act(() => {
      // This simulates the user selecting a cycle length in the UI
      // In the page component, this happens when the user clicks on a radio button
      result.current.setCycleLength('31-35');
    });

    // Verify the context was updated as expected
    expect(mockUpdateResult).toHaveBeenCalledWith({ cycle_length: '31-35' });
  });
}); 