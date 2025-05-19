import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFlowHeaviness } from '../hooks/use-flow-heaviness';
import * as AssessmentContextModule from '@/src/pages/assessment/steps/context/hooks/use-assessment-context';
import { FlowHeaviness } from '@/src/pages/assessment/steps/context/types';

// Mock the context hook
vi.mock('@/src/pages/assessment/steps/context/hooks/use-assessment-context', () => ({
  useAssessmentContext: vi.fn()
}));

describe('useFlowHeaviness hook', () => {
  const mockUpdateResult = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    (AssessmentContextModule.useAssessmentContext as any).mockReturnValue({
      state: { result: { flow_heaviness: 'moderate' as FlowHeaviness } },
      updateResult: mockUpdateResult
    });
  });

  it('should return flowHeaviness from context state', () => {
    const { result } = renderHook(() => useFlowHeaviness());
    
    expect(result.current.flowHeaviness).toBe('moderate');
    expect(AssessmentContextModule.useAssessmentContext).toHaveBeenCalledTimes(1);
  });

  it('should call updateResult when setFlowHeaviness is called', () => {
    const { result } = renderHook(() => useFlowHeaviness());
    
    act(() => {
      result.current.setFlowHeaviness('heavy');
    });
    
    expect(mockUpdateResult).toHaveBeenCalledWith({ flow_heaviness: 'heavy' });
  });

  it('should handle undefined flowHeaviness in context', () => {
    (AssessmentContextModule.useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });
    
    const { result } = renderHook(() => useFlowHeaviness());
    
    expect(result.current.flowHeaviness).toBeUndefined();
  });
}); 