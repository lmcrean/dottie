import { useEffect } from 'react';
import { useAssessmentContext } from '@/src/pages/assessment/steps/context/hooks/use-assessment-context';
import { Recommendation } from '@/src/pages/assessment/steps/context/types';
import { generateRecommendations } from '../generateRecommendations';

/**
 * Hook to generate pattern-specific recommendations based on assessment data
 * and store them in context
 */
export const useGenerateRecommendations = (): { recommendations: Recommendation[] } => {
  const { state, setRecommendations } = useAssessmentContext();
  const result = state?.result;

  useEffect(() => {
    if (!result || !result.pattern) return;

    // Only generate recommendations if they don't exist or the pattern has changed
    const shouldGenerateRecommendations =
      !result.recommendations ||
      result.recommendations.length === 0 ||
      !hasRecommendationForPattern(result.pattern, result.recommendations);

    if (shouldGenerateRecommendations) {
      const newRecommendations = generateRecommendations(result);

      // Update recommendations in context
      setRecommendations(newRecommendations);
    }
  }, [result?.pattern, result, setRecommendations]);

  // Helper to check if recommendations already include pattern-specific recommendation
  const hasRecommendationForPattern = (
    pattern: string,
    existingRecs: Recommendation[]
  ): boolean => {
    // Check if pattern-specific recommendation exists
    switch (pattern) {
      case 'regular':
        return existingRecs.some((rec) => rec.id === 'regular_maintenance');
      case 'irregular':
        return existingRecs.some((rec) => rec.id === 'irregular_consult');
      case 'heavy':
        return existingRecs.some((rec) => rec.id === 'heavy_iron');
      case 'pain':
        return existingRecs.some((rec) => rec.id === 'pain_management');
      case 'developing':
        return existingRecs.some((rec) => rec.id === 'developing_patience');
      default:
        return false;
    }
  };

  return {
    recommendations: result?.recommendations || []
  };
};

export default useGenerateRecommendations;
