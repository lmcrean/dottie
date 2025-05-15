import { useCallback, useEffect } from 'react';
import { useAssessmentContext } from '../../../context/hooks/use-assessment-context';
import { PainLevel } from '../../../context/types';

export function usePainLevel() {
  const { state, updateResult } = useAssessmentContext();

  // Add logging to track pain level state
  console.log('usePainLevel - Current state result:', state.result);
  console.log('usePainLevel - Current pain level from state:', state.result?.pain_level);

  // Initialize context if it's null and we have a pain level in session storage
  useEffect(() => {
    if (!state.result) {
      // If there's a pain level in session storage, use it to initialize
      const storedPainLevel = sessionStorage.getItem('painLevel') as PainLevel | null;
      if (storedPainLevel) {
        console.log('usePainLevel - Initializing context with stored pain level:', storedPainLevel);
        updateResult({ pain_level: storedPainLevel });
      }
    }
  }, [state.result, updateResult]);

  const setPainLevel = useCallback(
    (painLevel: PainLevel) => {
      console.log('usePainLevel - Setting pain level to:', painLevel);

      // Set in context
      updateResult({ pain_level: painLevel });

      // Also set in session storage as a backup
      sessionStorage.setItem('painLevel', painLevel);

      console.log('usePainLevel - Updated pain level in context and session storage');
    },
    [updateResult]
  );

  return {
    painLevel: state.result?.pain_level,
    setPainLevel
  };
}
