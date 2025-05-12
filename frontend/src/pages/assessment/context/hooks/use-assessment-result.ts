import { useAssessmentContext } from './use-assessment-context';

export function useAssessmentResult() {
  const { state } = useAssessmentContext();

  // Add the missing transformation function
  const transformToFlattenedFormat = () => {
    if (!state || !state.result) return null;

    // Basic flattened format implementation
    return {
      ...state.result
      // Add any specific transformation logic needed
    };
  };

  return {
    ...state,
    transformToFlattenedFormat
  };
}
