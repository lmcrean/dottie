import { useCallback, useContext } from 'react';
import { determinePattern } from '../services/assessment/determinePattern';
import { generateRecommendations } from '../services/assessment/generateRecommendations';
import { transformToFlattenedFormat } from '../services/assessment/transformToFlattenedFormat';
import { AssessmentResult, Symptoms } from '../context/assessment/types';
import { AssessmentResultContext } from '../context/assessment/AssessmentResultContext';

// Main hook with all functionality
export function useAssessmentResult() {
  const context = useContext(AssessmentResultContext);
  if (context === undefined) {
    throw new Error('useAssessmentResult must be used within an AssessmentResultProvider');
  }

  const { state, setResult, updateResult, resetResult, setPattern, setRecommendations } = context;

  // Function to save assessment result to session storage
  const saveToSessionStorage = useCallback((result: AssessmentResult) => {
    Object.entries(result).forEach(([key, value]) => {
      sessionStorage.setItem(key, JSON.stringify(value));
    });
  }, []);

  // Function to load assessment result from session storage
  const loadFromSessionStorage = useCallback((): Partial<AssessmentResult> => {
    const result: Partial<AssessmentResult> = {};
    const keys: (keyof AssessmentResult)[] = [
      'age',
      'cycleLength',
      'periodDuration',
      'flowHeaviness',
      'painLevel',
      'symptoms',
      'pattern',
      'recommendations'
    ];

    keys.forEach((key) => {
      const value = sessionStorage.getItem(key);
      if (value) {
        result[key] = JSON.parse(value);
      }
    });

    return result;
  }, []);

  // Function to update symptoms
  const updateSymptoms = useCallback(
    (type: keyof Symptoms, symptoms: string[]) => {
      if (!state.result) return;

      const updatedSymptoms: Symptoms = {
        ...state.result.symptoms,
        [type]: symptoms
      };

      updateResult({ symptoms: updatedSymptoms });
    },
    [state.result, updateResult]
  );

  // Function to complete the assessment
  const completeAssessment = useCallback(
    (result: AssessmentResult) => {
      const pattern = determinePattern(result);
      const recommendations = generateRecommendations({ ...result, pattern });

      const completeResult = {
        ...result,
        pattern,
        recommendations
      };

      setResult(completeResult);
      saveToSessionStorage(completeResult);
    },
    [setResult, saveToSessionStorage]
  );

  // Function to clear assessment data
  const clearAssessment = useCallback(() => {
    resetResult();
    sessionStorage.clear();
  }, [resetResult]);

  return {
    ...state,
    setResult,
    updateResult,
    resetResult,
    setPattern,
    setRecommendations,
    saveToSessionStorage,
    loadFromSessionStorage,
    updateSymptoms,
    completeAssessment,
    clearAssessment,
    transformToFlattenedFormat
  };
}
