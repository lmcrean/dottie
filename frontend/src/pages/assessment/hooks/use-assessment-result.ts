import { useAssessmentContext } from './use-assessment-context';
import { AssessmentResult, MenstrualPattern } from '../../context/assessment/types/index';
import { Assessment } from '../../../api/assessment/types';

/**
 * Hook to access assessment result data from context
 * and provide utilities for the results page
 */
export function useAssessmentResult() {
  const { state } = useAssessmentContext();

  /**
   * Transforms the assessment result data into the flattened format
   * required for API submission
   */
  const transformToFlattenedFormat = (
    result: AssessmentResult
  ): Omit<Assessment, 'id' | 'created_at' | 'updated_at' | 'user_id'> => {
    return {
      age: result.age || '',
      cycle_length: result.cycle_length || '',
      period_duration: result.period_duration || '',
      flow_heaviness: result.flow_heaviness || '',
      pain_level: result.pain_level || '',
      physical_symptoms: result.physical_symptoms || [],
      emotional_symptoms: result.emotional_symptoms || [],
      pattern: result.pattern || determinePattern(result),
      recommendations: result.recommendations || []
    };
  };

  /**
   * Determines the pattern based on assessment data
   */
  const determinePattern = (result: AssessmentResult): MenstrualPattern => {
    if (!result) return 'regular';

    // Apply pattern determination logic
    if (result.cycle_length === 'less-than-21' || result.cycle_length === 'irregular') {
      return 'irregular';
    } else if (result.flow_heaviness === 'heavy' || result.flow_heaviness === 'very-heavy') {
      return 'heavy';
    } else if (result.pain_level === 'severe' || result.pain_level === 'debilitating') {
      return 'pain';
    } else if (result.age === 'under-13' || result.age === '13-17') {
      return 'developing';
    }

    return 'regular';
  };

  return {
    result: state.result,
    pattern: state.result?.pattern || (state.result ? determinePattern(state.result) : 'regular'),
    recommendations: state.result?.recommendations,
    transformToFlattenedFormat
  };
}
