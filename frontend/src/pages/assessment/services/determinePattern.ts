import { AssessmentResult, MenstrualPattern } from '../steps/context/types';

/**
 * Determines the menstrual pattern based on assessment results
 */
export const determinePattern = (result: AssessmentResult): MenstrualPattern => {
  const { age, cycle_length, period_duration, flow_heaviness, pain_level } = result;

  // Developing Pattern (O5)
  if (age === 'under-13' || age === '13-17') {
    return 'developing';
  }

  // Irregular Timing Pattern (O1)
  if (cycle_length === 'irregular' || cycle_length === 'less-than-21' || cycle_length === '36-40') {
    return 'irregular';
  }

  // Heavy Flow Pattern (O2)
  if (
    flow_heaviness === 'heavy' ||
    flow_heaviness === 'very-heavy' ||
    period_duration === '8-plus'
  ) {
    return 'heavy';
  }

  // Pain-Predominant Pattern (O3)
  if (pain_level === 'severe' || pain_level === 'debilitating') {
    return 'pain';
  }

  // Regular Menstrual Cycles (O4)
  return 'regular';
};
