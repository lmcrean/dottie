import { AssessmentResult } from '@/src/pages/assessment/steps/context/types';
import { RECOMMENDATIONS } from '@/src/pages/assessment/steps/context/types/recommendations';

/**
 * Generates recommendations based on assessment results and pattern
 * Follows the logic tree outcomes:
 * O1: Irregular Timing Pattern
 * O2: Heavy or Prolonged Flow Pattern
 * O3: Pain-Predominant Pattern
 * O4: Regular Menstrual Cycles
 * O5: Developing Pattern
 */
export const generateRecommendations = (result: AssessmentResult) => {
  const recommendations = new Set([RECOMMENDATIONS.track_cycle]); // Always include tracking

  // Pattern-specific recommendations based on logic tree outcomes
  if (result.pattern) {
    switch (result.pattern) {
      case 'irregular': // O1: Irregular Timing Pattern
        recommendations.add(RECOMMENDATIONS.irregular_consult);
        break;
      case 'heavy': // O2: Heavy or Prolonged Flow Pattern
        recommendations.add(RECOMMENDATIONS.heavy_iron);
        break;
      case 'pain': // O3: Pain-Predominant Pattern
        recommendations.add(RECOMMENDATIONS.pain_management);
        break;
      case 'regular': // O4: Regular Menstrual Cycles
        recommendations.add(RECOMMENDATIONS.regular_maintenance);
        break;
      case 'developing': // O5: Developing Pattern
        recommendations.add(RECOMMENDATIONS.developing_patience);
        break;
    }
  }

  return Array.from(recommendations);
};
