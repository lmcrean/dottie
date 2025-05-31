import { PainLevel } from '@/src/pages/assessment/steps/context';
import { useAssessmentContext } from '@/src/pages/assessment/steps/context';

/**
 * Custom hook to manage pain level state
 */
export const usePainLevel = () => {
  const { state, updateResult } = useAssessmentContext();

  // Get the pain level from the assessment context, or undefined if not set
  const painLevel = state.result?.pain_level;

  // Function to update pain level in the assessment context
  const setPainLevel = (value: PainLevel) => {
    updateResult({ pain_level: value });
  };

  return {
    painLevel,
    setPainLevel
  };
};

export default usePainLevel;
