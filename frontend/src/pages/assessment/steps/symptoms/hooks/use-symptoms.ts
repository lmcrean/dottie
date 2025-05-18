import { useCallback } from 'react';
import { useAssessmentContext } from '../../context/hooks/use-assessment-context';
import { PhysicalSymptomId, EmotionalSymptomId } from '../../context/types';

export function useSymptoms() {
  const { state, updateResult } = useAssessmentContext();

  const setPhysicalSymptoms = useCallback(
    (symptoms: PhysicalSymptomId[]) => {
      updateResult({ physical_symptoms: symptoms });
    },
    [updateResult]
  );

  const setEmotionalSymptoms = useCallback(
    (symptoms: EmotionalSymptomId[]) => {
      updateResult({ emotional_symptoms: symptoms });
    },
    [updateResult]
  );

  const setOtherSymptoms = useCallback(
    (otherSymptoms: string) => {
      updateResult({ other_symptoms: otherSymptoms });
    },
    [updateResult]
  );

  return {
    physicalSymptoms: state.result?.physical_symptoms || [],
    emotionalSymptoms: state.result?.emotional_symptoms || [],
    otherSymptoms: state.result?.other_symptoms || '',
    setPhysicalSymptoms,
    setEmotionalSymptoms,
    setOtherSymptoms
  };
}
