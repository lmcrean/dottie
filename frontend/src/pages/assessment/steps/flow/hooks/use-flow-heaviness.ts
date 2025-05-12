import { useCallback } from 'react';
import { useAssessmentContext } from '../../../context/hooks/use-assessment-context';
import { FlowHeaviness } from '../../../context/assessment/types';

export function useFlowHeaviness() {
  const { state, updateResult } = useAssessmentContext();

  const setFlowHeaviness = useCallback(
    (flowHeaviness: FlowHeaviness) => {
      updateResult({ flow_heaviness: flowHeaviness });
    },
    [updateResult]
  );

  return {
    flowHeaviness: state.result?.flow_heaviness,
    setFlowHeaviness
  };
}
