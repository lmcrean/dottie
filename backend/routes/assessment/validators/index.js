/**
 * Validates assessment data
 * @param {Object} assessment - The assessment data to validate
 * @returns {Object} - Object with isValid flag and errors array
 */
export function validateAssessmentData(assessment) {
  const errors = [];
  

  // Check for required fields
  // if (!assessment.userId) {
  //   errors.push('userId is required');
  // }
  
  if (!assessment.assessment_data) {
    errors.push('assessment_data is required');
    return { isValid: errors.length === 0, errors };
  }
  
  const assessmentData = assessment.assessment_data;
  // console.log('Validating assessment data:', assessmentData);
  
  // Validate required assessment fields
  if (!assessmentData.age) {
    errors.push('age is required');
  } else if (!isValidAge(assessmentData.age)) {
    errors.push('Invalid age value');
  }
  
  if (!assessmentData.cycleLength) {
    errors.push('cycleLength is required');
  } else if (!isValidCycleLength(assessmentData.cycleLength)) {
    errors.push('Invalid cycleLength value');
  }
  
  // Validate optional fields if they exist
  if (assessmentData.periodDuration && !isValidPeriodDuration(assessmentData.periodDuration)) {
    errors.push('Invalid periodDuration value');
  }
  
  if (assessmentData.flowHeaviness && !isValidFlowHeaviness(assessmentData.flowHeaviness)) {
    errors.push('Invalid flowHeaviness value');
  }
  
  if (assessmentData.painLevel && !isValidPainLevel(assessmentData.painLevel)) {
    errors.push('Invalid painLevel value');
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