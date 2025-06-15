import logger from '../../../../../services/logger.js';

/**
 * Validate that a user owns an assessment
 * @param {string} userId - User ID
 * @param {string} assessmentId - Assessment ID
 * @returns {Promise<boolean>} - True if user owns assessment
 */
export const validateAssessmentOwnership = async (userId, assessmentId) => {
  if (!userId || !assessmentId) return false;
  
  try {
    // Import Assessment model dynamically to avoid circular dependencies
    const { default: Assessment } = await import('../../../../assessment/Assessment.js');
    
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      logger.warn(`Assessment not found: ${assessmentId}`);
      return false;
    }
    
    // Check if user owns this assessment
    const isOwner = assessment.user_id === userId;
    
    if (!isOwner) {
      logger.warn(`User ${userId} does not own assessment ${assessmentId}`);
    }
    
    return isOwner;
  } catch (error) {
    logger.error('Error validating assessment ownership:', error);
    return false;
  }
};

/**
 * Validate assessment exists and is accessible
 * @param {string} assessmentId - Assessment ID
 * @returns {Promise<boolean>} - True if assessment is valid and accessible
 */
export const validateAssessmentExists = async (assessmentId) => {
  if (!assessmentId) return false;
  
  try {
    const { default: Assessment } = await import('../../../../assessment/Assessment.js');
    
    const assessment = await Assessment.findById(assessmentId);
    return !!assessment;
  } catch (error) {
    logger.error('Error validating assessment exists:', error);
    return false;
  }
};

/**
 * Validate assessment and get its details
 * @param {string} userId - User ID
 * @param {string} assessmentId - Assessment ID
 * @returns {Promise<Object|null>} - Assessment details or null
 */
export const validateAndGetAssessment = async (userId, assessmentId) => {
  if (!userId || !assessmentId) return null;
  
  try {
    const { default: Assessment } = await import('../../../../assessment/Assessment.js');
    
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      logger.warn(`Assessment not found: ${assessmentId}`);
      return null;
    }
    
    // Check ownership
    if (assessment.user_id !== userId) {
      logger.warn(`User ${userId} does not own assessment ${assessmentId}`);
      return null;
    }
    
    return {
      id: assessment.id,
      user_id: assessment.user_id,
      pattern: assessment.pattern || assessment.assessment_pattern,
      created_at: assessment.created_at,
      updated_at: assessment.updated_at,
      isValid: true
    };
  } catch (error) {
    logger.error('Error validating and getting assessment:', error);
    return null;
  }
};

/**
 * Validate multiple assessments for a user
 * @param {string} userId - User ID
 * @param {Array<string>} assessmentIds - Array of assessment IDs
 * @returns {Promise<Object>} - Validation results
 */
export const validateMultipleAssessments = async (userId, assessmentIds) => {
  const results = {
    valid: [],
    invalid: [],
    notFound: [],
    notOwned: []
  };
  
  try {
    for (const assessmentId of assessmentIds) {
      const assessment = await validateAndGetAssessment(userId, assessmentId);
      
      if (assessment) {
        results.valid.push(assessmentId);
      } else {
        // Check if it exists but user doesn't own it
        const exists = await validateAssessmentExists(assessmentId);
        if (exists) {
          results.notOwned.push(assessmentId);
        } else {
          results.notFound.push(assessmentId);
        }
      }
    }
    
    logger.info(`Validated ${assessmentIds.length} assessments for user ${userId}: ${results.valid.length} valid`);
    return results;
  } catch (error) {
    logger.error('Error validating multiple assessments:', error);
    throw error;
  }
}; 