import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useAssessmentResult } from '../use-assessment-result';
import { AssessmentResultProvider } from '@/src/context/AssessmentResultContext';

// Mock the context to prevent warnings
vi.mock('@/src/context/AssessmentResultContext', async () => {
  const actual = await vi.importActual('@/src/context/AssessmentResultContext');
  return {
    ...actual,
    useAssessmentResult: () => ({
      state: {
        result: {
          age: "25-plus",
          cycleLength: "26-30",
          periodDuration: "4-5",
          flowHeaviness: "moderate",
          painLevel: "mild",
          symptoms: {
            physical: ["Bloating", "Headache"],
            emotional: ["Irritability"]
          },
          pattern: "regular",
          recommendations: [
            { title: "Track Your Cycle", description: "Keep a record of your cycle" }
          ]
        },
        isComplete: true
      },
      setResult: vi.fn(),
      updateResult: vi.fn(),
      resetResult: vi.fn(),
      setPattern: vi.fn(),
      setRecommendations: vi.fn()
    })
  };
});

describe('useAssessmentResult', () => {
  it('transforms assessment result to flattened format with snake_case keys', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <AssessmentResultProvider>{children}</AssessmentResultProvider>
    );

    const { result } = renderHook(() => useAssessmentResult(), { wrapper });

    const assessmentResult = {
      age: "25-plus",
      cycleLength: "26-30",
      periodDuration: "4-5",
      flowHeaviness: "moderate",
      painLevel: "mild",
      symptoms: {
        physical: ["Bloating", "Headache"],
        emotional: ["Irritability"]
      },
      pattern: "regular",
      recommendations: [
        { title: "Track Your Cycle", description: "Keep a record of your cycle" }
      ]
    };

    const transformed = result.current.transformToFlattenedFormat(assessmentResult);

    // Verify the transformed object has snake_case keys
    expect(transformed).toEqual({
      age: "25-plus",
      pattern: "regular",
      cycle_length: "26-30",
      period_duration: "4-5",
      flow_heaviness: "moderate",
      pain_level: "mild",
      physical_symptoms: ["Bloating", "Headache"],
      emotional_symptoms: ["Irritability"],
      recommendations: [
        { title: "Track Your Cycle", description: "Keep a record of your cycle" }
      ]
    });

    // Ensure camelCase keys are not present
    expect(transformed).not.toHaveProperty("cycleLength");
    expect(transformed).not.toHaveProperty("periodDuration");
    expect(transformed).not.toHaveProperty("flowHeaviness");
    expect(transformed).not.toHaveProperty("painLevel");
    expect(transformed).not.toHaveProperty("symptoms");
  });
}); 