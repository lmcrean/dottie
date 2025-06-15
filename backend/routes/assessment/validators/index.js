/**
 * Validates assessment data
 * @param {Object} assessmentData - The assessment data to validate
 * @returns {Object} - Object with isValid flag and errors array
 */
export function validateAssessmentData(assessmentData) {
  const errors = [];
  
  // Handle both nested (assessment_data) and flattened formats
  let dataToValidate = assessmentData;
  if (assessmentData.assessment_data) {
    dataToValidate = assessmentData.assessment_data;
  }
  
  // Check age - handle both camelCase and snake_case
  const age = dataToValidate.age;
  if (!age) {
    errors.push('age is required');
  } else if (!isValidAge(age)) {
    errors.push('Invalid age value');
  }
  
  // Check cycle length - handle both camelCase and snake_case
  const cycleLength = dataToValidate.cycleLength || dataToValidate.cycle_length;
  if (!cycleLength) {
    errors.push('cycle length is required');
  } else if (!isValidCycleLength(cycleLength)) {
    errors.push('Invalid cycle length value');
  }
  
  // Check period duration - handle both camelCase and snake_case
  const periodDuration = dataToValidate.periodDuration || dataToValidate.period_duration;
  if (periodDuration && !isValidPeriodDuration(periodDuration)) {
    errors.push('Invalid period duration value');
  }
  
  // Check flow heaviness - handle both camelCase and snake_case
  const flowHeaviness = dataToValidate.flowHeaviness || dataToValidate.flow_heaviness;
  if (flowHeaviness && !isValidFlowHeaviness(flowHeaviness)) {
    errors.push('Invalid flow heaviness value');
  }
  
  // Check pain level - handle both camelCase and snake_case
  const painLevel = dataToValidate.painLevel || dataToValidate.pain_level;
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