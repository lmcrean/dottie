import { useCallback } from 'react';
import { useAssessmentContext } from '../../../context/hooks/use-assessment-context';
import { PainLevel } from '../../../context/types';

export function usePainLevel() {
  const { state, updateResult } = useAssessmentContext();

  // Add logging to track pain level state
  console.log('usePainLevel - Current state result:', state.result);
  console.log('usePainLevel - Current pain level from state:', state.result?.pain_level);

  const setPainLevel = useCallback(
    (painLevel: PainLevel) => {
      console.log('usePainLevel - Setting pain level to:', painLevel);
      updateResult({ pain_level: painLevel });

      // Also log after update for debugging
      console.log('usePainLevel - Updated pain level in context');
    },
    [updateResult]
  );

  return {
    painLevel: state.result?.pain_level,
    setPainLevel
  };
}
