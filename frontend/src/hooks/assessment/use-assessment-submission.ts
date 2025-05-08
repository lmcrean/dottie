import { useCallback } from 'react';
import { useAssessmentContext } from './use-assessment-context';
import { determinePattern } from '../../services/assessment/determinePattern';
import { generateRecommendations } from '../../services/assessment/generateRecommendations';

export function useAssessmentSubmission() {
  const { state, setResult, resetResult } = useAssessmentContext();

  const completeAssessment = useCallback(() => {
    if (!state.result) return null;

    const pattern = determinePattern(state.result);
    const recommendations = generateRecommendations({ ...state.result, pattern });

    const completeResult = {
      ...state.result,
      pattern,
      recommendations
    };

    setResult(completeResult);
    return completeResult;
  }, [state.result, setResult]);

  const clearAssessment = useCallback(() => {
    resetResult();
  }, [resetResult]);

  return {
    isComplete: state.isComplete,
    result: state.result,
    completeAssessment,
    clearAssessment
  };
}
