import { useCallback } from 'react';
import { useAssessmentContext } from '../use-assessment-context';
import { PainLevel } from '../../../context/assessment/types';

export function usePainLevel() {
  const { state, updateResult } = useAssessmentContext();

  const setPainLevel = useCallback(
    (painLevel: PainLevel) => {
      updateResult({ pain_level: painLevel });
    },
    [updateResult]
  );

  return {
    painLevel: state.result?.pain_level,
    setPainLevel
  };
}
