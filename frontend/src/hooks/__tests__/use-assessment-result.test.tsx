import { renderHook } from '@testing-library/react-hooks';
import { useAssessmentResult } from '../use-assessment-result';
import { AssessmentResultProvider } from '@/src/hooks/use-assessment-result';
import { vi } from 'vitest';

// Mock the context
vi.mock('@/src/hooks/use-assessment-result', async () => {
  const actual = await vi.importActual('@/src/hooks/use-assessment-result');
  return {
    ...actual,
    useAssessmentResultContext: () => ({
      state: {
        result: {
          age: '25-plus',
          cycleLength: '26-30',
          periodDuration: '4-5',
          flowHeaviness: 'moderate',
          painLevel: 'mild',
          symptoms: {
            physical: ['Bloating'],
            emotional: []
          },
          pattern: 'regular'
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

// Create a wrapper for the context provider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AssessmentResultProvider>{children}</AssessmentResultProvider>
);

describe('useAssessmentResult', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should return the assessment result state', () => {
    const { result } = renderHook(() => useAssessmentResult(), { wrapper });
    
    expect(result.current.result).toEqual({
      age: '25-plus',
      cycleLength: '26-30',
      periodDuration: '4-5',
      flowHeaviness: 'moderate',
      painLevel: 'mild',
      symptoms: {
        physical: ['Bloating'],
        emotional: []
      },
      pattern: 'regular'
    });
    expect(result.current.isComplete).toBe(true);
  });

  it('should determine the correct pattern for regular cycles', () => {
    const { result } = renderHook(() => useAssessmentResult(), { wrapper });
    
    const testData = {
      age: '25-plus',
      cycleLength: '26-30',
      periodDuration: '4-5',
      flowHeaviness: 'moderate',
      painLevel: 'mild',
      symptoms: {
        physical: [],
        emotional: []
      }
    };
    
    expect(result.current.determinePattern(testData)).toBe('regular');
  });

  it('should determine the correct pattern for irregular cycles', () => {
    const { result } = renderHook(() => useAssessmentResult(), { wrapper });
    
    const testData = {
      age: '25-plus',
      cycleLength: 'irregular',
      periodDuration: '4-5',
      flowHeaviness: 'moderate',
      painLevel: 'mild',
      symptoms: {
        physical: [],
        emotional: []
      }
    };
    
    expect(result.current.determinePattern(testData)).toBe('irregular');
  });

  it('should determine the correct pattern for heavy flow', () => {
    const { result } = renderHook(() => useAssessmentResult(), { wrapper });
    
    const testData = {
      age: '25-plus',
      cycleLength: '26-30',
      periodDuration: '4-5',
      flowHeaviness: 'heavy',
      painLevel: 'mild',
      symptoms: {
        physical: [],
        emotional: []
      }
    };
    
    expect(result.current.determinePattern(testData)).toBe('heavy');
  });

  it('should determine the correct pattern for severe pain', () => {
    const { result } = renderHook(() => useAssessmentResult(), { wrapper });
    
    const testData = {
      age: '25-plus',
      cycleLength: '26-30',
      periodDuration: '4-5',
      flowHeaviness: 'moderate',
      painLevel: 'severe',
      symptoms: {
        physical: [],
        emotional: []
      }
    };
    
    expect(result.current.determinePattern(testData)).toBe('pain');
  });

  it('should determine the correct pattern for adolescents', () => {
    const { result } = renderHook(() => useAssessmentResult(), { wrapper });
    
    const testData = {
      age: '13-17',
      cycleLength: '26-30',
      periodDuration: '4-5',
      flowHeaviness: 'moderate',
      painLevel: 'mild',
      symptoms: {
        physical: [],
        emotional: []
      }
    };
    
    expect(result.current.determinePattern(testData)).toBe('developing');
  });

  it('should generate appropriate recommendations', () => {
    const { result } = renderHook(() => useAssessmentResult(), { wrapper });
    
    const testData = {
      age: '25-plus',
      cycleLength: '26-30',
      periodDuration: '4-5',
      flowHeaviness: 'moderate',
      painLevel: 'mild',
      pattern: 'regular',
      symptoms: {
        physical: ['Fatigue'],
        emotional: ['Irritability']
      }
    };
    
    const recommendations = result.current.generateRecommendations(testData);
    
    // Should have base recommendation
    expect(recommendations.some(r => r.title === 'Track Your Cycle')).toBe(true);
    
    // Should have fatigue recommendation
    expect(recommendations.some(r => r.title === 'Rest and Sleep')).toBe(true);
    
    // Should have emotional recommendation
    expect(recommendations.some(r => r.title === 'Emotional Support')).toBe(true);
  });
}); 