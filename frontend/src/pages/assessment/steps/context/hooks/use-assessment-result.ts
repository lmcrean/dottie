import { useAssessmentContext } from './use-assessment-context';
import { Assessment } from '../../../api/types';

export function useAssessmentResult() {
  const { state } = useAssessmentContext();

  // Transform the result from context state to the flattened format expected by API
  const transformToFlattenedFormat = (): Omit<Assessment, 'id'> | null => {
    if (!state || !state.result) return null;

    const { result } = state;

    // Convert to the flattened format expected by the backend
    return {
      user_id: '', // This will be filled in by SaveResultsButton
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),

      // Ensure all required fields are present, using defaults if needed
      age: result.age || 'unknown',
      pattern: result.pattern || 'unknown',
      cycle_length: result.cycle_length || 'unknown',
      period_duration: result.period_duration || 'unknown',
      flow_heaviness: result.flow_heaviness || 'unknown',
      pain_level: result.pain_level || 'unknown',

      // Ensure array fields are present
      physical_symptoms: result.physical_symptoms || [],
      emotional_symptoms: result.emotional_symptoms || [],
      other_symptoms: result.other_symptoms ? [result.other_symptoms] : [],

      // Transform recommendations to match expected format
      recommendations:
        result.recommendations?.map((rec) => ({
          title: rec.title,
          description: rec.description
        })) || []
    };
  };

  return {
    ...state,
    transformToFlattenedFormat
  };
}
