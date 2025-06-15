import { useEffect } from 'react';
import { useAssessmentContext } from '@/src/pages/assessment/steps/context/hooks/use-assessment-context';
import { MenstrualPattern } from '@/src/pages/assessment/steps/context/types';
import { determinePattern } from '../determinePattern';
import { AssessmentResult } from '@/src/pages/assessment/steps/context/types';

/**
 * Hook to calculate and store the determined menstrual pattern in the assessment context
 * This ensures the pattern is calculated and available for recommendation generation
 */
export const useDeterminedPattern = (): { pattern: MenstrualPattern } => {
  const { state, updateResult } = useAssessmentContext();
  const result = state?.result;

  useEffect(() => {
    if (!result) return;

    // Only calculate pattern if not already set or if key inputs changed
    if (!result.pattern || hasPatternFactorsChanged(result)) {
      const calculatedPattern = determinePattern(result as AssessmentResult);

      // Update pattern in context if it's different
      if (calculatedPattern !== result.pattern) {
        updateResult({ pattern: calculatedPattern });
      }
    }
  }, [
    result?.age,
    result?.cycle_length,
    result?.period_duration,
    result?.flow_heaviness,
    result?.pain_level,
    result,
    updateResult
  ]);

  // Helper to determine if any pattern-influencing factors have changed
  const hasPatternFactorsChanged = (data: AssessmentResult) => {
    if (!data) return false;

    // Check if any of the pattern-determining factors are present
    return data.age || data.cycle_length || data.flow_heaviness || data.pain_level;
  };

  return {
    pattern: result?.pattern || 'regular'
  };
};

export default useDeterminedPattern;
