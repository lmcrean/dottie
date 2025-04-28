/**
 * Validates assessment data
 * @param {Object} assessment - The assessment data to validate
 * @returns {Object} - Object with isValid flag and errors array
 */
export function validateAssessmentData(assessment) {
  const errors = [];
  
  // Handle both flattened and nested formats
  let assessmentData;
  
  if (assessment.assessment_data) {
    // Legacy nested format
    assessmentData = assessment.assessment_data;
  } else {
    // New flattened format - use the assessment object directly
    assessmentData = assessment;
  }
  
  // Validate required assessment fields
  if (!assessmentData.age) {
    errors.push('age is required');
  } else if (!isValidAge(assessmentData.age)) {
    errors.push('Invalid age value');
  }
  
  // Check for camelCase or snake_case for cycle length
  const cycleLength = assessmentData.cycleLength || assessmentData.cycle_length;
  if (!cycleLength) {
    errors.push('cycle length is required');
  } else if (!isValidCycleLength(cycleLength)) {
    errors.push('Invalid cycle length value');
  }
  
  // Validate optional fields if they exist (handling both naming conventions)
  const periodDuration = assessmentData.periodDuration || assessmentData.period_duration;
  if (periodDuration && !isValidPeriodDuration(periodDuration)) {
    errors.push('Invalid period duration value');
  }
  
  const flowHeaviness = assessmentData.flowHeaviness || assessmentData.flow_heaviness;
  if (flowHeaviness && !isValidFlowHeaviness(flowHeaviness)) {
    errors.push('Invalid flow heaviness value');
  }
  
  const painLevel = assessmentData.painLevel || assessmentData.pain_level;
  if (painLevel && !isValidPainLevel(painLevel)) {
    errors.push('Invalid pain level value');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Helper validation functions
function isValidAge(age) {
  const validAges = ['under-13', '13-17', '18-24', '25-plus'];
  return validAges.includes(age);
}

function isValidCycleLength(cycleLength) {
  const validCycleLengths = ['less-than-21', '21-25', '26-30', '31-35', '36-40', 'irregular', 'not-sure', 'other'];
  return validCycleLengths.includes(cycleLength);
}

function isValidPeriodDuration(duration) {
  const validDurations = ['1-3', '4-5', '6-7', '8-plus', 'varies', 'not-sure', 'other' ];
  return validDurations.includes(duration);
}

function isValidFlowHeaviness(flow) {
  const validFlows = ['light', 'moderate', 'heavy', 'very-heavy', 'varies', 'not-sure' ];
  return validFlows.includes(flow);
}

function isValidPainLevel(pain) {
  const validPainLevels = ['no-pain', 'mild', 'moderate', 'severe', 'debilitating', 'varies'];
  return validPainLevels.includes(pain);
} 