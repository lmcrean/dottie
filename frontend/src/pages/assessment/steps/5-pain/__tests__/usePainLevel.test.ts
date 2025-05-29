import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { usePainLevel } from '../hooks/use-pain-level';
import { useAssessmentContext } from '../../context/hooks/use-assessment-context';

// Mock the assessment context
vi.mock('../../context/hooks/use-assessment-context', () => ({
  useAssessmentContext: vi.fn()
}));

describe('usePainLevel', () => {
  // Setup mock context before each test
  beforeEach(() => {
    const mockUpdateResult = vi.fn();
    (useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });
  });

  it('should initialize with undefined pain level', () => {
    const { result } = renderHook(() => usePainLevel());
    expect(result.current.painLevel).toBeUndefined();
  });

  it('should return pain level from context state', () => {
    (useAssessmentContext as any).mockReturnValue({
      state: { result: { pain_level: 'moderate' } },
      updateResult: vi.fn()
    });

    const { result } = renderHook(() => usePainLevel());
    expect(result.current.painLevel).toBe('moderate');
  });

  it('should update pain level when setPainLevel is called', () => {
    const mockUpdateResult = vi.fn();
    (useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });

    const { result } = renderHook(() => usePainLevel());
    
    act(() => {
      result.current.setPainLevel('moderate');
    });

    expect(mockUpdateResult).toHaveBeenCalledWith({ pain_level: 'moderate' });
  });

  it('matches the page implementation in pain page', () => {
    // Tests that the hook implementation matches how it's used in the page
    // The pain page at /assessment/steps/pain/page.tsx uses the usePainLevel hook 
    // to manage pain level selection
    const mockUpdateResult = vi.fn();
    (useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });

    const { result } = renderHook(() => usePainLevel());
    
    act(() => {
      // This simulates the user selecting a pain level in the UI
      // In the page, this happens when handlePainChange is called with 'severe'
      result.current.setPainLevel('severe');
    });

    // Verify the context was updated as expected
    expect(mockUpdateResult).toHaveBeenCalledWith({ pain_level: 'severe' });
  });
}); 