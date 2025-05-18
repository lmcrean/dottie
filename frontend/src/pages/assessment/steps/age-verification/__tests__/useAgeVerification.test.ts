import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { useAgeVerification } from '../use-age-verification';
import { useAssessmentContext } from '../../context/hooks/use-assessment-context';

// Mock the assessment context
vi.mock('../../use-assessment-context', () => ({
  useAssessmentContext: vi.fn()
}));

describe('useAgeVerification', () => {
  // Setup mock context before each test
  beforeEach(() => {
    const mockUpdateResult = vi.fn();
    (useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });
  });

  it('should initialize with undefined age', () => {
    const { result } = renderHook(() => useAgeVerification());
    expect(result.current.age).toBeUndefined();
  });

  it('should return age from context state', () => {
    (useAssessmentContext as any).mockReturnValue({
      state: { result: { age: '18-24' } },
      updateResult: vi.fn()
    });

    const { result } = renderHook(() => useAgeVerification());
    expect(result.current.age).toBe('18-24');
  });

  it('should update age when setAge is called', () => {
    const mockUpdateResult = vi.fn();
    (useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });

    const { result } = renderHook(() => useAgeVerification());
    
    act(() => {
      result.current.setAge('18-24');
    });

    expect(mockUpdateResult).toHaveBeenCalledWith({ age: '18-24' });
  });

  it('matches the page implementation in age-verification page', () => {
    // Tests that the hook implementation matches how it's used in the page
    // The age-verification page at /assessment/steps/age-verification/page.tsx
    // uses the useAgeVerification hook to manage age selection
    const mockUpdateResult = vi.fn();
    (useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });

    const { result } = renderHook(() => useAgeVerification());
    
    act(() => {
      // This simulates the user selecting an age range in the UI
      result.current.setAge('25-plus');
    });

    // Verify the context was updated as expected
    expect(mockUpdateResult).toHaveBeenCalledWith({ age: '25-plus' });
  });
}); 