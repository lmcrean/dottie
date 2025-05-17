import { useCallback } from 'react';
import { useAssessmentContext } from '../../../context/hooks/use-assessment-context';
import { AgeRange } from '../../../context/types';

export function useAgeVerification() {
  const { state, updateResult } = useAssessmentContext();

  console.log('useAgeVerification - Current state result:', state.result);
  console.log('useAgeVerification - Current age from state:', state.result?.age);

  const setAge = useCallback(
    (age: AgeRange) => {
      console.log('useAgeVerification - Setting age to:', age);
      updateResult({ age });
    },
    [updateResult]
  );

  return {
    age: state.result?.age,
    setAge
  };
}
