import { AssessmentResult } from '../../context/assessment/types';
import { RECOMMENDATIONS } from '../../context/assessment/recommendations';

/**
 * Generates recommendations based on assessment results and pattern
 */
export const generateRecommendations = (result: AssessmentResult) => {
  const recommendations = new Set([RECOMMENDATIONS.track_cycle]); // Always include tracking

  // Pattern-specific recommendations
  if (result.pattern) {
    switch (result.pattern) {
      case 'irregular':
        recommendations.add(RECOMMENDATIONS.irregular_consult);
        break;
      case 'heavy':
        recommendations.add(RECOMMENDATIONS.heavy_iron);
        break;
      case 'pain':
        recommendations.add(RECOMMENDATIONS.pain_management);
        break;
      case 'developing':
        recommendations.add(RECOMMENDATIONS.developing_patience);
        break;
    }
  }

  // Physical symptom recommendations
  if (result.physical_symptoms.includes('fatigue')) {
    recommendations.add(RECOMMENDATIONS.fatigue_rest);
  }
  if (result.physical_symptoms.includes('nausea')) {
    recommendations.add(RECOMMENDATIONS.nausea_management);
  }
  if (result.physical_symptoms.includes('headaches')) {
    recommendations.add(RECOMMENDATIONS.headache_management);
  }

  // Emotional symptom recommendations
  if (result.emotional_symptoms.length > 0) {
    recommendations.add(RECOMMENDATIONS.emotional_support);
    recommendations.add(RECOMMENDATIONS.stress_management);
  }

  // Add lifestyle recommendations
  recommendations.add(RECOMMENDATIONS.exercise);
  recommendations.add(RECOMMENDATIONS.nutrition);

  // Convert Set to Array and sort by priority
  return Array.from(recommendations).sort((a, b) => b.priority - a.priority);
};
