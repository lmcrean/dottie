import { FlowHeaviness, useAssessmentContext } from '@/src/pages/assessment/steps/context';

/**
 * Custom hook to manage flow heaviness state
 */
export const useFlowHeaviness = () => {
  const { state, updateResult } = useAssessmentContext();

  // Get the flow heaviness from the assessment context, or undefined if not set
  const flowHeaviness = state.result?.flow_heaviness;

  // Function to update flow heaviness in the assessment context
  const setFlowHeaviness = (value: FlowHeaviness) => {
    updateResult({ flow_heaviness: value });
  };

  return {
    flowHeaviness,
    setFlowHeaviness
  };
};

export default useFlowHeaviness;
