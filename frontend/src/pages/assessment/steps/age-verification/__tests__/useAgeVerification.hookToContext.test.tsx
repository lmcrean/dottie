import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAgeVerification } from '../use-age-verification';
import * as AssessmentContextModule from '../../context/hooks/use-assessment-context';
import { AgeRange } from '../../../../context/types';

// Mock the context hook
vi.mock('../../use-assessment-context', () => ({
  useAssessmentContext: vi.fn()
}));

describe('useAgeVerification hook', () => {
  const mockUpdateResult = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    (AssessmentContextModule.useAssessmentContext as any).mockReturnValue({
      state: { result: { age: '18-24' as AgeRange } },
      updateResult: mockUpdateResult
    });
  });

  it('should return age from context state', () => {
    const { result } = renderHook(() => useAgeVerification());
    
    expect(result.current.age).toBe('18-24');
    expect(AssessmentContextModule.useAssessmentContext).toHaveBeenCalledTimes(1);
  });

  it('should call updateResult when setAge is called', () => {
    const { result } = renderHook(() => useAgeVerification());
    
    act(() => {
      result.current.setAge('25-plus');
    });
    
    expect(mockUpdateResult).toHaveBeenCalledWith({ age: '25-plus' });
  });

  it('should handle undefined age in context', () => {
    (AssessmentContextModule.useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });
    
    const { result } = renderHook(() => useAgeVerification());
    
    expect(result.current.age).toBeUndefined();
  });
}); 