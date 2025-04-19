/**
 * Validates assessment data
 * @param {Object} assessment - The assessment data to validate
 * @returns {Object} - Object with isValid flag and errors array
 */
export function validateAssessmentData(assessment) {
  const errors = [];
  
  console.log("validateAssessmentData received:", JSON.stringify(assessment, null, 2));
  
  // Skip userId validation when it's coming from the controller (where userId is in req.user)
  const isFromController = !assessment.userId && assessment.assessmentData;

  // Only validate userId if it's not coming from the controller
  if (!isFromController && !assessment.userId) {
    errors.push('userId is required');
  }
  
  // Use camelCase consistently
  if (!assessment.assessmentData) {
    // For backward compatibility, try to convert snake_case to camelCase
    if (assessment.assessment_data) {
      assessment.assessmentData = assessment.assessment_data;
      console.log("Converted snake_case to camelCase");
    } else {
      errors.push('assessmentData is required');
      console.log("Missing assessmentData field");
      return { isValid: errors.length === 0, errors };
    }
  }
  
  // Handle both legacy and nested structures
  let assessmentData = assessment.assessmentData;
  console.log("Initial assessmentData:", JSON.stringify(assessmentData, null, 2));
  
  // Handle deeply nested structures - first level
  if (typeof assessmentData === 'object' && (assessmentData.assessmentData || assessmentData.assessment_data)) {
    // We found a nested structure - go one level deeper
    const innerData = assessmentData.assessmentData || assessmentData.assessment_data;
    console.log("Found nested structure, innerData:", JSON.stringify(innerData, null, 2));
    
    // Check if we need to go one more level deep
    if (typeof innerData === 'object' && (innerData.assessmentData || innerData.assessment_data)) {
      assessmentData = innerData.assessmentData || innerData.assessment_data;
      console.log("Found double-nested structure, final assessmentData:", JSON.stringify(assessmentData, null, 2));
    } else {
      assessmentData = innerData;
      console.log("Using innerData as assessmentData");
    }
  }
  
  console.log("Final assessmentData to validate:", JSON.stringify(assessmentData, null, 2));
  
  // Validate required assessment fields
  if (!assessmentData.age) {
    errors.push('age is required');
    console.log("Missing required field: age");
  } else if (!isValidAge(assessmentData.age)) {
    errors.push('Invalid age value');
    console.log(`Invalid age value: ${assessmentData.age}`);
  }
  
  if (!assessmentData.cycleLength) {
    errors.push('cycleLength is required');
    console.log("Missing required field: cycleLength");
  } else if (!isValidCycleLength(assessmentData.cycleLength)) {
    errors.push('Invalid cycleLength value');
    console.log(`Invalid cycleLength value: ${assessmentData.cycleLength}`);
  }
  
  // Validate optional fields if they exist
  if (assessmentData.periodDuration && !isValidPeriodDuration(assessmentData.periodDuration)) {
    errors.push('Invalid periodDuration value');
    console.log(`Invalid periodDuration value: ${assessmentData.periodDuration}`);
  }
  
  if (assessmentData.flowHeaviness && !isValidFlowHeaviness(assessmentData.flowHeaviness)) {
    errors.push('Invalid flowHeaviness value');
    console.log(`Invalid flowHeaviness value: ${assessmentData.flowHeaviness}`);
  }
  
  if (assessmentData.painLevel && !isValidPainLevel(assessmentData.painLevel)) {
    errors.push('Invalid painLevel value');
    console.log(`Invalid painLevel value: ${assessmentData.painLevel}`);
  }
  
  // Validate recommendations structure if present
  if (assessmentData.recommendations && Array.isArray(assessmentData.recommendations)) {
    for (const rec of assessmentData.recommendations) {
      if (!rec.title || typeof rec.title !== 'string') {
        errors.push('Each recommendation must have a title');
        console.log("Recommendation missing title");
      }
      if (!rec.description || typeof rec.description !== 'string') {
        errors.push('Each recommendation must have a description');
        console.log("Recommendation missing description");
      }
    }
  }
  
  const isValid = errors.length === 0;
  console.log(`Validation result: ${isValid ? 'VALID' : 'INVALID'}, Errors:`, errors);
  
  return {
    isValid,
    errors
  };
}

// Helper validation functions - Convert to consistent camelCase
function isValidAge(age) {
  // Use camelCase versions and maintain compatibility with hypen/underscore
  const validAges = [
    'under-13', 'under_13', 'under13',
    '13-17', '13_17', '1317',
    '18-24', '18_24', '1824',
    '25-29', '25_29', '2529',
    '30-plus', '30_plus', '30plus',
    'under-18', 'under_18', 'under18',
    '25-plus', '25_plus', '25plus'
  ];
  return validAges.includes(age);
}

function isValidCycleLength(cycleLength) {
  const validCycleLengths = [
    'less-than-21', 'less_than_21', 'lessThan21',
    '21-25', '21_25', '2125',
    '26-30', '26_30', '2630',
    '31-35', '31_35', '3135',
    '36-40', '36_40', '3640',
    'irregular',
    'not-sure', 'not_sure', 'notSure',
    'other'
  ];
  return validCycleLengths.includes(cycleLength);
}

function isValidPeriodDuration(duration) {
  const validDurations = [
    '1-3', '1_3', '13',
    '4-5', '4_5', '45',
    '6-7', '6_7', '67',
    '8-plus', '8_plus', '8plus',
    'varies', 
    'not-sure', 'not_sure', 'notSure',
    'other'
  ];
  return validDurations.includes(duration);
}

function isValidFlowHeaviness(flow) {
  const validFlows = [
    'light', 
    'moderate', 
    'heavy', 
    'very-heavy', 'very_heavy', 'veryHeavy',
    'varies',
    'not-sure', 'not_sure', 'notSure'
  ];
  return validFlows.includes(flow);
}

function isValidPainLevel(pain) {
  const validPainLevels = [
    'no-pain', 'no_pain', 'noPain',
    'mild', 
    'moderate', 
    'severe', 
    'debilitating', 
    'varies'
  ];
  return validPainLevels.includes(pain);
} 