import { useCallback } from 'react';
import { useAssessmentContext } from '../../../hooks/use-assessment-context';
import { PeriodDuration } from '../../../context/assessment/types';

export function usePeriodDuration() {
  const { state, updateResult } = useAssessmentContext();

  const setPeriodDuration = useCallback(
    (periodDuration: PeriodDuration) => {
      updateResult({ period_duration: periodDuration });
    },
    [updateResult]
  );

  return {
    periodDuration: state.result?.period_duration,
    setPeriodDuration
  };
}
