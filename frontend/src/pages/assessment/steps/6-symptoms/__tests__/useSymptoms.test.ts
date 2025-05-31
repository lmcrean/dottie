import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { useSymptoms } from '../hooks/use-symptoms';
import { useAssessmentContext } from '../../context/hooks/use-assessment-context';

// Mock the assessment context
vi.mock('../../context/hooks/use-assessment-context', () => ({
  useAssessmentContext: vi.fn()
}));

describe('useSymptoms', () => {
  // Setup mock context before each test
  beforeEach(() => {
    const mockUpdateResult = vi.fn();
    (useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });
  });

  it('should initialize with empty arrays for symptoms', () => {
    const { result } = renderHook(() => useSymptoms());
    expect(result.current.physicalSymptoms).toEqual([]);
    expect(result.current.emotionalSymptoms).toEqual([]);
  });

  it('should return physical symptoms from context state', () => {
    const physicalSymptoms = ['headaches', 'fatigue'];
    (useAssessmentContext as any).mockReturnValue({
      state: { result: { physical_symptoms: physicalSymptoms } },
      updateResult: vi.fn()
    });

    const { result } = renderHook(() => useSymptoms());
    expect(result.current.physicalSymptoms).toEqual(physicalSymptoms);
  });

  it('should return emotional symptoms from context state', () => {
    const emotionalSymptoms = ['anxiety', 'mood-swings'];
    (useAssessmentContext as any).mockReturnValue({
      state: { result: { emotional_symptoms: emotionalSymptoms } },
      updateResult: vi.fn()
    });

    const { result } = renderHook(() => useSymptoms());
    expect(result.current.emotionalSymptoms).toEqual(emotionalSymptoms);
  });

  it('should update physical symptoms when setPhysicalSymptoms is called', () => {
    const mockUpdateResult = vi.fn();
    (useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });

    const { result } = renderHook(() => useSymptoms());
    const symptoms = ['headaches', 'fatigue'];
    
    act(() => {
      result.current.setPhysicalSymptoms(symptoms);
    });

    expect(mockUpdateResult).toHaveBeenCalledWith({ physical_symptoms: symptoms });
  });

  it('should update emotional symptoms when setEmotionalSymptoms is called', () => {
    const mockUpdateResult = vi.fn();
    (useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });

    const { result } = renderHook(() => useSymptoms());
    const symptoms = ['anxiety', 'mood-swings'];
    
    act(() => {
      result.current.setEmotionalSymptoms(symptoms);
    });

    expect(mockUpdateResult).toHaveBeenCalledWith({ emotional_symptoms: symptoms });
  });

  it('should handle multiple symptom updates', () => {
    const mockUpdateResult = vi.fn();
    (useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });

    const { result } = renderHook(() => useSymptoms());
    const physicalSymptoms = ['headaches', 'fatigue'];
    const emotionalSymptoms = ['anxiety', 'mood-swings'];
    
    act(() => {
      result.current.setPhysicalSymptoms(physicalSymptoms);
    });

    expect(mockUpdateResult).toHaveBeenCalledWith({ physical_symptoms: physicalSymptoms });

    act(() => {
      result.current.setEmotionalSymptoms(emotionalSymptoms);
    });

    expect(mockUpdateResult).toHaveBeenCalledWith({ emotional_symptoms: emotionalSymptoms });
  });

  it('matches the page implementation in symptoms page', () => {
    // Tests that the hook implementation matches how it's used in the page
    // The symptoms page at /assessment/steps/symptoms/page.tsx
    // uses the useSymptoms hook to manage physical and emotional symptoms
    const mockUpdateResult = vi.fn();
    (useAssessmentContext as any).mockReturnValue({
      state: { result: {} },
      updateResult: mockUpdateResult
    });

    const { result } = renderHook(() => useSymptoms());
    
    // In the page component, this happens when a user checks symptoms like 
    // 'bloating' and 'breast-tenderness'
    const physicalSelections = ['bloating', 'breast-tenderness'];
    act(() => {
      result.current.setPhysicalSymptoms(physicalSelections);
    });
    expect(mockUpdateResult).toHaveBeenCalledWith({ physical_symptoms: physicalSelections });
    
    // And similarly for emotional symptoms like 'anxiety' and 'mood-swings'
    const emotionalSelections = ['anxiety', 'mood-swings'];
    act(() => {
      result.current.setEmotionalSymptoms(emotionalSelections);
    });
    expect(mockUpdateResult).toHaveBeenCalledWith({ emotional_symptoms: emotionalSelections });
  });
}); 