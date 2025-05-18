import { useCallback } from 'react';
import { useAssessmentContext } from '../../context/hooks/use-assessment-context';
import { CycleLength } from '../../context/types';

export function useCycleLength() {
  const { state, updateResult } = useAssessmentContext();

  const setCycleLength = useCallback(
    (cycleLength: CycleLength) => {
      updateResult({ cycle_length: cycleLength });
    },
    [updateResult]
  );

  return {
    cycleLength: state.result?.cycle_length,
    setCycleLength
  };
}
