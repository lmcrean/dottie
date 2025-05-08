import { useCallback } from 'react';
import { useAssessmentContext } from './use-assessment-context';
import { determinePattern } from '../../services/assessment/determinePattern';
import { generateRecommendations } from '../../services/assessment/generateRecommendations';
import { transformToFlattenedFormat } from '../../services/assessment/transformToFlattenedFormat';

/**
 * Hook that bridges assessment context with assessment services
 * Handles processing assessment data through various services and updating context
 */
export function useAssessmentServices() {
  const { state, setResult, resetResult } = useAssessmentContext();

  /**
   * Process the assessment data to determine pattern and recommendations
   * Updates the context with the complete result
   */
  const processAssessment = useCallback(() => {
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

  /**
   * Transform context data to flattened format for API submission
   */
  const getFlattenedData = useCallback(() => {
    if (!state.result) return null;
    return transformToFlattenedFormat(state.result);
  }, [state.result]);

  /**
   * Reset the assessment data in context
   */
  const clearAssessment = useCallback(() => {
    resetResult();
  }, [resetResult]);

  return {
    isComplete: state.isComplete,
    result: state.result,
    processAssessment,
    getFlattenedData,
    clearAssessment
  };
}
