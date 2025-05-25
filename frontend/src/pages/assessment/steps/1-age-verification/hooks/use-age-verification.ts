import { useCallback } from 'react';
import { useAssessmentContext } from '../../context/hooks/use-assessment-context';
import { AgeRange } from '../../context/types';

export function useAgeVerification() {
  const { state, updateResult } = useAssessmentContext();

  const setAge = useCallback(
    (age: AgeRange) => {
      updateResult({ age });
    },
    [updateResult]
  );

  return {
    age: state.result?.age,
    setAge
  };
}
