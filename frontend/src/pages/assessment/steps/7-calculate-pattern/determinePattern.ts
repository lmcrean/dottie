import { AssessmentResult, MenstrualPattern } from '@/src/pages/assessment/steps/context/types';

/**
 * Determines the menstrual pattern based on assessment results
 */
export const determinePattern = (result: AssessmentResult): MenstrualPattern => {
  // Create a safe copy with defaults for missing values
  const safeResult = {
    ...result,
    age: result.age || undefined,
    cycle_length: result.cycle_length || undefined,
    period_duration: result.period_duration || undefined,
    flow_heaviness: result.flow_heaviness || undefined,
    pain_level: result.pain_level || undefined,
    physical_symptoms: Array.isArray(result.physical_symptoms) ? result.physical_symptoms : [],
    emotional_symptoms: Array.isArray(result.emotional_symptoms) ? result.emotional_symptoms : []
  };

  const { age, cycle_length, period_duration, flow_heaviness, pain_level } = safeResult;

  console.log('determinePattern received data:', {
    age,
    cycle_length,
    period_duration,
    flow_heaviness,
    pain_level,
    physical_symptoms_count: safeResult.physical_symptoms.length,
    emotional_symptoms_count: safeResult.emotional_symptoms.length
  });

  // Developing Pattern (O5)
  if (age === 'under-13' || age === '13-17') {
    console.log('Pattern determined as "developing" due to age:', age);
    return 'developing';
  }

  // Irregular Timing Pattern (O1)
  if (cycle_length === 'irregular' || cycle_length === 'less-than-21' || cycle_length === '36-40') {
    console.log('Pattern determined as "irregular" due to cycle_length:', cycle_length);
    return 'irregular';
  }

  // Heavy Flow Pattern (O2)
  if (
    flow_heaviness === 'heavy' ||
    flow_heaviness === 'very-heavy' ||
    period_duration === '8-plus'
  ) {
    console.log(
      'Pattern determined as "heavy" due to flow_heaviness:',
      flow_heaviness,
      'or period_duration:',
      period_duration
    );
    return 'heavy';
  }

  // Pain-Predominant Pattern (O3)
  if (pain_level === 'severe' || pain_level === 'debilitating') {
    console.log('Pattern determined as "pain" due to pain_level:', pain_level);
    return 'pain';
  }

  // If we don't have enough data to determine pattern, attempt to infer from symptoms
  if (!cycle_length && !period_duration && !flow_heaviness && !pain_level) {
    // Check if there are pain-related symptoms
    const painSymptoms = ['back-pain', 'breast-tenderness', 'headaches'];
    const hasPainSymptoms = safeResult.physical_symptoms.some((symptom) =>
      painSymptoms.includes(symptom)
    );

    if (hasPainSymptoms) {
      console.log('Pattern inferred as "pain" from pain-related symptoms');
      return 'pain';
    }

    // Check if there are heavy-flow related symptoms
    const heavyFlowSymptoms = ['fatigue', 'dizziness'];
    const hasHeavyFlowSymptoms = safeResult.physical_symptoms.some((symptom) =>
      heavyFlowSymptoms.includes(symptom)
    );

    if (hasHeavyFlowSymptoms) {
      console.log('Pattern inferred as "heavy" from heavy-flow related symptoms');
      return 'heavy';
    }
  }

  // Regular Menstrual Cycles (O4)
  console.log('Pattern determined as "regular" as no other conditions matched');
  return 'regular';
};
