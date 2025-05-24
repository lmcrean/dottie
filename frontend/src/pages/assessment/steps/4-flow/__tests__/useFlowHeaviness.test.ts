import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { useFlowHeaviness } from '../hooks/use-flow-heaviness';
import { useAssessmentContext } from '@/src/pages/assessment/steps/context/hooks/use-assessment-context';

// Mock the assessment context
vi.mock('@/src/pages/assessment/steps/context/hooks/use-assessment-context', () => ({
  useAssessmentContext: vi.fn()
}));

describe('useFlowHeaviness', () => {
  // Setup mock context before each test
  beforeEach(() => {
    const mockUpdateResult = vi.fn();
    (useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });
  });

  it('should initialize with undefined flow heaviness', () => {
    const { result } = renderHook(() => useFlowHeaviness());
    expect(result.current.flowHeaviness).toBeUndefined();
  });

  it('should return flow heaviness from context state', () => {
    (useAssessmentContext as any).mockReturnValue({
      state: { result: { flow_heaviness: 'moderate' } },
      updateResult: vi.fn()
    });

    const { result } = renderHook(() => useFlowHeaviness());
    expect(result.current.flowHeaviness).toBe('moderate');
  });

  it('should update flow heaviness when setFlowHeaviness is called', () => {
    const mockUpdateResult = vi.fn();
    (useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });

    const { result } = renderHook(() => useFlowHeaviness());
    
    act(() => {
      result.current.setFlowHeaviness('moderate');
    });

    expect(mockUpdateResult).toHaveBeenCalledWith({ flow_heaviness: 'moderate' });
  });

  it('matches the page implementation in flow page', () => {
    // Tests that the hook implementation matches how it's used in the page
    // The flow page at /assessment/steps/flow/page.tsx uses the useFlowHeaviness 
    // hook to manage flow heaviness selection
    const mockUpdateResult = vi.fn();
    (useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });

    const { result } = renderHook(() => useFlowHeaviness());
    
    act(() => {
      // This simulates the user selecting a flow heaviness in the UI
      // In the page, this happens when the user selects an option like "heavy"
      result.current.setFlowHeaviness('heavy');
    });

    // Verify the context was updated as expected, similar to how it would be
    // when a user interacts with the flow page
    expect(mockUpdateResult).toHaveBeenCalledWith({ flow_heaviness: 'heavy' });
  });
}); 