import { AssessmentResult, Recommendation } from '../../hooks/use-assessment-result';

/**
 * Generates recommendations based on assessment results and pattern
 */
export const generateRecommendations = (result: AssessmentResult): Recommendation[] => {
  const recommendations: Recommendation[] = [];
  const { pattern, symptoms } = result;

  // Base recommendations for all patterns
  recommendations.push({
    title: 'Track Your Cycle',
    description: 'Keep a record of when your period starts and stops to identify patterns.'
  });

  // Pattern-specific recommendations
  switch (pattern) {
    case 'irregular':
      recommendations.push({
        title: 'Consult a Healthcare Provider',
        description: 'Irregular cycles may need medical evaluation to identify underlying causes.'
      });
      break;
    case 'heavy':
      recommendations.push({
        title: 'Iron-Rich Diet',
        description:
          'Consider increasing iron intake through diet or supplements to prevent anemia.'
      });
      break;
    case 'pain':
      recommendations.push({
        title: 'Pain Management',
        description: 'Over-the-counter pain relievers like ibuprofen can help with cramps.'
      });
      break;
    case 'developing':
      recommendations.push({
        title: 'Be Patient',
        description:
          "Your cycles are still establishing. It's normal for them to be irregular during adolescence."
      });
      break;
  }

  // Symptom-specific recommendations
  if (symptoms.physical.includes('Fatigue')) {
    recommendations.push({
      title: 'Rest and Sleep',
      description: 'Ensure you get adequate rest and maintain a regular sleep schedule.'
    });
  }

  if (symptoms.emotional.length > 0) {
    recommendations.push({
      title: 'Emotional Support',
      description:
        'Consider talking to a counselor or joining a support group about emotional symptoms.'
    });
  }

  return recommendations;
};
