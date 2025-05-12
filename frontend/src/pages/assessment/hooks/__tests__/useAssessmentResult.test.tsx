import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAssessmentResult } from '../use-assessment-result';
import * as AssessmentContextModule from '../use-assessment-context';
import { AssessmentResult } from '../../../context/assessment/types/index';

// Mock the context hook
vi.mock('../use-assessment-context', () => ({
  useAssessmentContext: vi.fn()
}));

describe('useAssessmentResult hook', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  
  it('should return result from context state', () => {
    const mockResult: AssessmentResult = {
      age: '25-plus',
      cycle_length: '26-30',
      period_duration: '4-5',
      flow_heaviness: 'moderate',
      pain_level: 'mild',
      physical_symptoms: ['bloating', 'headaches'],
      emotional_symptoms: ['anxiety']
    };
    
    (AssessmentContextModule.useAssessmentContext as any).mockReturnValue({
      state: { result: mockResult },
      setPattern: vi.fn()
    });
    
    const { result } = renderHook(() => useAssessmentResult());
    
    expect(result.current.result).toEqual(mockResult);
    expect(AssessmentContextModule.useAssessmentContext).toHaveBeenCalledTimes(1);
  });
  
  it('should determine pattern for regular cycles', () => {
    const mockResult: AssessmentResult = {
      age: '25-plus',
      cycle_length: '26-30',
      period_duration: '4-5',
      flow_heaviness: 'moderate',
      pain_level: 'mild',
      physical_symptoms: [],
      emotional_symptoms: []
    };
    
    (AssessmentContextModule.useAssessmentContext as any).mockReturnValue({
      state: { result: mockResult },
      setPattern: vi.fn()
    });
    
    const { result } = renderHook(() => useAssessmentResult());
    
    expect(result.current.pattern).toBe('regular');
  });
  
  it('should determine irregular pattern based on cycle length', () => {
    const mockResult: AssessmentResult = {
      age: '25-plus',
      cycle_length: 'irregular',
      period_duration: '4-5',
      flow_heaviness: 'moderate',
      pain_level: 'mild',
      physical_symptoms: [],
      emotional_symptoms: []
    };
    
    (AssessmentContextModule.useAssessmentContext as any).mockReturnValue({
      state: { result: mockResult },
      setPattern: vi.fn()
    });
    
    const { result } = renderHook(() => useAssessmentResult());
    
    expect(result.current.pattern).toBe('irregular');
  });
  
  it('should transform assessment data to flattened format', () => {
    const mockResult: AssessmentResult = {
      age: '25-plus',
      cycle_length: '26-30',
      period_duration: '4-5',
      flow_heaviness: 'moderate',
      pain_level: 'mild',
      physical_symptoms: ['bloating'],
      emotional_symptoms: ['anxiety'],
      pattern: 'regular',
      recommendations: [{ id: '1', title: 'Test', description: 'Test desc' }]
    };
    
    (AssessmentContextModule.useAssessmentContext as any).mockReturnValue({
      state: { result: mockResult },
      setPattern: vi.fn()
    });
    
    const { result } = renderHook(() => useAssessmentResult());
    
    const flattenedResult = result.current.transformToFlattenedFormat(mockResult);
    
    expect(flattenedResult).toEqual({
      age: '25-plus',
      cycle_length: '26-30',
      period_duration: '4-5',
      flow_heaviness: 'moderate',
      pain_level: 'mild',
      physical_symptoms: ['bloating'],
      emotional_symptoms: ['anxiety'],
      pattern: 'regular',
      recommendations: [{ id: '1', title: 'Test', description: 'Test desc' }]
    });
  });
}); 