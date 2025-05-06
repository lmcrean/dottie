import { AssessmentResult, MenstrualPattern } from '../../hooks/use-assessment-result';

/**
 * Determines the menstrual pattern based on assessment results
 */
export const determinePattern = (result: AssessmentResult): MenstrualPattern => {
  const { age, cycleLength, periodDuration, flowHeaviness, painLevel } = result;

  // Developing Pattern (O5)
  if (age === 'under-13' || age === '13-17') {
    return 'developing';
  }

  // Irregular Timing Pattern (O1)
  if (cycleLength === 'irregular' || cycleLength === 'less-than-21' || cycleLength === '36-40') {
    return 'irregular';
  }

  // Heavy Flow Pattern (O2)
  if (flowHeaviness === 'heavy' || flowHeaviness === 'very-heavy' || periodDuration === '8-plus') {
    return 'heavy';
  }

  // Pain-Predominant Pattern (O3)
  if (painLevel === 'severe' || painLevel === 'debilitating') {
    return 'pain';
  }

  // Regular Menstrual Cycles (O4)
  return 'regular';
};
