import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAssessmentServices } from '../use-assessment-services';
import * as AssessmentContextModule from '../use-assessment-context';
import { AssessmentResult } from '../../../context/assessment/types/index';

// Mock the imports
vi.mock('../use-assessment-context', () => ({
  useAssessmentContext: vi.fn()
}));

// Mock the service functions
vi.mock('../../../services/assessment/determinePattern', () => ({
  determinePattern: vi.fn().mockReturnValue('regular')
}));

vi.mock('../../../services/assessment/generateRecommendations', () => ({
  generateRecommendations: vi.fn().mockReturnValue([
    { id: '1', title: 'Test recommendation', description: 'Test description' }
  ])
}));

vi.mock('../../../services/assessment/transformToFlattenedFormat', () => ({
  transformToFlattenedFormat: vi.fn().mockReturnValue({ age: 'mocked-age' })
}));

describe('useAssessmentServices hook', () => {
  const mockSetResult = vi.fn();
  const mockResetResult = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    (AssessmentContextModule.useAssessmentContext as any).mockReturnValue({
      state: {
        result: { 
          age: '25-plus',
          physical_symptoms: [],
          emotional_symptoms: []
        },
        isComplete: false
      },
      setResult: mockSetResult,
      resetResult: mockResetResult
    });
  });
  
  it('should return result and isComplete from context', () => {
    const { result } = renderHook(() => useAssessmentServices());
    
    expect(result.current.result).toEqual({
      age: '25-plus',
      physical_symptoms: [],
      emotional_symptoms: []
    });
    expect(result.current.isComplete).toBe(false);
  });
  
  it('should process assessment and update context', () => {
    const { result } = renderHook(() => useAssessmentServices());
    
    act(() => {
      result.current.processAssessment();
    });
    
    expect(mockSetResult).toHaveBeenCalledWith({
      age: '25-plus',
      physical_symptoms: [],
      emotional_symptoms: [],
      pattern: 'regular',
      recommendations: [
        { id: '1', title: 'Test recommendation', description: 'Test description' }
      ]
    });
  });
  
  it('should return null when calling processAssessment with no result', () => {
    (AssessmentContextModule.useAssessmentContext as any).mockReturnValue({
      state: { result: null },
      setResult: mockSetResult,
      resetResult: mockResetResult
    });
    
    const { result } = renderHook(() => useAssessmentServices());
    
    const returnValue = result.current.processAssessment();
    expect(returnValue).toBeNull();
    expect(mockSetResult).not.toHaveBeenCalled();
  });
  
  it('should get flattened data', () => {
    const { result } = renderHook(() => useAssessmentServices());
    
    const flattenedData = result.current.getFlattenedData();
    
    expect(flattenedData).toEqual({ age: 'mocked-age' });
  });
  
  it('should clear assessment', () => {
    const { result } = renderHook(() => useAssessmentServices());
    
    act(() => {
      result.current.clearAssessment();
    });
    
    expect(mockResetResult).toHaveBeenCalledTimes(1);
  });
}); 