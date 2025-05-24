import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSymptoms } from '../hooks/use-symptoms';
import * as AssessmentContextModule from '../../context/hooks/use-assessment-context';
import { PhysicalSymptomId, EmotionalSymptomId } from '../../../../context/types';

// Mock the context hook
vi.mock('../../context/hooks/use-assessment-context', () => ({
  useAssessmentContext: vi.fn()
}));

describe('useSymptoms hook', () => {
  const mockUpdateResult = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    (AssessmentContextModule.useAssessmentContext as any).mockReturnValue({
      state: { 
        result: { 
          physical_symptoms: ['bloating', 'headaches'] as PhysicalSymptomId[],
          emotional_symptoms: ['anxiety', 'mood-swings'] as EmotionalSymptomId[]
        }
      },
      updateResult: mockUpdateResult
    });
  });

  it('should return physical and emotional symptoms from context state', () => {
    const { result } = renderHook(() => useSymptoms());
    
    expect(result.current.physicalSymptoms).toEqual(['bloating', 'headaches']);
    expect(result.current.emotionalSymptoms).toEqual(['anxiety', 'mood-swings']);
    expect(AssessmentContextModule.useAssessmentContext).toHaveBeenCalledTimes(1);
  });

  it('should call updateResult when setPhysicalSymptoms is called', () => {
    const { result } = renderHook(() => useSymptoms());
    
    act(() => {
      result.current.setPhysicalSymptoms(['back-pain', 'fatigue']);
    });
    
    expect(mockUpdateResult).toHaveBeenCalledWith({ physical_symptoms: ['back-pain', 'fatigue'] });
  });

  it('should call updateResult when setEmotionalSymptoms is called', () => {
    const { result } = renderHook(() => useSymptoms());
    
    act(() => {
      result.current.setEmotionalSymptoms(['depression', 'irritability']);
    });
    
    expect(mockUpdateResult).toHaveBeenCalledWith({ emotional_symptoms: ['depression', 'irritability'] });
  });

  it('should handle undefined symptoms arrays in context', () => {
    (AssessmentContextModule.useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });
    
    const { result } = renderHook(() => useSymptoms());
    
    expect(result.current.physicalSymptoms).toEqual([]);
    expect(result.current.emotionalSymptoms).toEqual([]);
  });
}); 