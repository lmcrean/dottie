/**
 * Assessment Data Generators for Integration Tests
 */

/**
 * Calculate pattern based on assessment data (matches frontend logic)
 * @param {Object} data - Assessment data
 * @returns {string} - Calculated pattern
 */
function calculatePattern(data) {
  const { age, cycle_length, period_duration, flow_heaviness, pain_level } = data;
  
  // Developing Pattern (O5)
  if (age === 'under-13' || age === '13-17') {
    return 'developing';
  }
  
  // Irregular Timing Pattern (O1)
  if (cycle_length === 'irregular' || cycle_length === 'less-than-21' || cycle_length === '36-40') {
    return 'irregular';
  }
  
  // Heavy Flow Pattern (O2)
  if (flow_heaviness === 'heavy' || flow_heaviness === 'very-heavy' || period_duration === '8-plus') {
    return 'heavy';
  }
  
  // Pain-Predominant Pattern (O3)
  if (pain_level === 'severe' || pain_level === 'debilitating') {
    return 'pain';
  }
  
  // Regular Menstrual Cycles (O4) - default
  return 'regular';
}

/**
 * Generate default assessment data for testing
 * @returns {Object} Default assessment data
 */
export function generateDefaultAssessment() {
  const baseData = {
    age: "18-24",
    cycleLength: "26-30",
    periodDuration: "4-5",
    flowHeaviness: "moderate",
    painLevel: "moderate",
    symptoms: {
      physical: ["Bloating", "Headaches"],
      emotional: ["Mood swings", "Irritability"],
    },
  };

  // Convert to snake_case for pattern calculation
  const snakeCaseData = {
    age: baseData.age,
    cycle_length: baseData.cycleLength,
    period_duration: baseData.periodDuration,
    flow_heaviness: baseData.flowHeaviness,
    pain_level: baseData.painLevel,
  };

  // Calculate pattern
  const pattern = calculatePattern(snakeCaseData);

  // Return with pattern included
  return {
    ...baseData,
    pattern
  };
}

/**
 * Generate a more severe assessment profile
 * @returns {Object} Severe assessment data
 */
export function generateSevereAssessment() {
  const baseData = {
    age: "18-24",
    cycleLength: "31-35",
    periodDuration: "6-7",
    flowHeaviness: "heavy",
    painLevel: "severe",
    symptoms: {
      physical: ["Severe Cramps", "Nausea", "Vomiting", "Dizziness"],
      emotional: ["Depression", "Anxiety", "Mood swings", "Irritability"],
    },
  };

  // Convert to snake_case for pattern calculation
  const snakeCaseData = {
    age: baseData.age,
    cycle_length: baseData.cycleLength,
    period_duration: baseData.periodDuration,
    flow_heaviness: baseData.flowHeaviness,
    pain_level: baseData.painLevel,
  };

  // Calculate pattern
  const pattern = calculatePattern(snakeCaseData);

  // Return with pattern included
  return {
    ...baseData,
    pattern
  };
} 