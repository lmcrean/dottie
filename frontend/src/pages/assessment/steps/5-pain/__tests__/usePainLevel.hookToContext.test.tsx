import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { usePainLevel } from '../hooks/use-pain-level';
import * as AssessmentContextModule from '../../context/hooks/use-assessment-context';
import { PainLevel } from '../../../../context/types';

// Mock the context hook
vi.mock('../../context/hooks/use-assessment-context');

describe('usePainLevel hook', () => {
  const mockUpdateResult = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Use vi.spyOn to mock the implementation
    vi.spyOn(AssessmentContextModule, 'useAssessmentContext').mockImplementation(() => ({
      state: { result: { pain_level: 'moderate' as PainLevel } },
      updateResult: mockUpdateResult
    }));
  });

  it('should return painLevel from context state', () => {
    const { result } = renderHook(() => usePainLevel());
    
    expect(result.current.painLevel).toBe('moderate');
    expect(AssessmentContextModule.useAssessmentContext).toHaveBeenCalledTimes(1);
  });

  it('should call updateResult when setPainLevel is called', () => {
    const { result } = renderHook(() => usePainLevel());
    
    act(() => {
      result.current.setPainLevel('severe');
    });
    
    expect(mockUpdateResult).toHaveBeenCalledWith({ pain_level: 'severe' });
  });

  it('should handle undefined painLevel in context', () => {
    // Override the mock for this specific test
    vi.spyOn(AssessmentContextModule, 'useAssessmentContext').mockImplementation(() => ({
      state: { result: {} },
      updateResult: mockUpdateResult
    }));
    
    const { result } = renderHook(() => usePainLevel());
    
    expect(result.current.painLevel).toBeUndefined();
  });
}); 