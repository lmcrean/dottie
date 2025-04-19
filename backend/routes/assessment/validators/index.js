/**
 * Validates assessment data
 * @param {Object} assessment - The assessment data to validate
 * @returns {Object} - Object with isValid flag and errors array
 */
export function validateAssessmentData(assessment) {
  const errors = [];
  
  // If userId is explicitly required
  if (assessment.hasOwnProperty('userId') && !assessment.userId) {
    errors.push('userId is required');
  }
  
  // Handle both camelCase and snake_case naming
  if (!assessment.assessmentData && !assessment.assessment_data) {
    errors.push('assessment_data is required');
    return { isValid: errors.length === 0, errors };
  }
  
  // Handle both legacy and nested structures
  let assessmentData = assessment.assessmentData || assessment.assessment_data;
  
  // Handle deeply nested structures - first level
  if (typeof assessmentData === 'object' && (assessmentData.assessment_data || assessmentData.assessmentData)) {
    // We found a nested structure - go one level deeper
    const innerData = assessmentData.assessment_data || assessmentData.assessmentData;
    
    // Check if we need to go one more level deep
    if (typeof innerData === 'object' && (innerData.assessment_data || innerData.assessmentData)) {
      assessmentData = innerData.assessment_data || innerData.assessmentData;
    } else {
      assessmentData = innerData;
    }
  }
  
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
  
  // Validate recommendations structure if present
  if (assessmentData.recommendations && Array.isArray(assessmentData.recommendations)) {
    for (const rec of assessmentData.recommendations) {
      if (!rec.title || typeof rec.title !== 'string') {
        errors.push('Each recommendation must have a title');
      }
      if (!rec.description || typeof rec.description !== 'string') {
        errors.push('Each recommendation must have a description');
      }
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// Helper validation functions
function isValidAge(age) {
  // Use hyphen and underscore versions
  const validAges = [
    'under-13', 'under_13',
    '13-17', '13_17',
    '18-24', '18_24',
    '25-29', '25_29',
    '30-plus', '30_plus',
    'under-18', 'under_18',
    '25-plus', '25_plus'
  ];
  return validAges.includes(age);
}

function isValidCycleLength(cycleLength) {
  const validCycleLengths = [
    'less-than-21', 'less_than_21',
    '21-25', '21_25',
    '26-30', '26_30',
    '31-35', '31_35',
    '36-40', '36_40',
    'irregular',
    'not-sure', 'not_sure',
    'other'
  ];
  return validCycleLengths.includes(cycleLength);
}

function isValidPeriodDuration(duration) {
  const validDurations = [
    '1-3', '1_3',
    '4-5', '4_5',
    '6-7', '6_7',
    '8-plus', '8_plus',
    'varies', 
    'not-sure', 'not_sure',
    'other'
  ];
  return validDurations.includes(duration);
}

function isValidFlowHeaviness(flow) {
  const validFlows = [
    'light', 
    'moderate', 
    'heavy', 
    'very-heavy', 'very_heavy',
    'varies',
    'not-sure', 'not_sure'
  ];
  return validFlows.includes(flow);
}

function isValidPainLevel(pain) {
  const validPainLevels = [
    'no-pain', 'no_pain',
    'mild', 
    'moderate', 
    'severe', 
    'debilitating', 
    'varies'
  ];
  return validPainLevels.includes(pain);
} 