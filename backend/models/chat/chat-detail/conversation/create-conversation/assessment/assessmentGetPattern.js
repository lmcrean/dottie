import logger from '../../../../../services/logger.js';

/**
 * Get assessment pattern from assessment ID
 * @param {string} assessmentId - Assessment ID
 * @returns {Promise<string|null>} - Assessment pattern or null
 */
export const getAssessmentPattern = async (assessmentId) => {
  if (!assessmentId) return null;
  
  try {
    // Import Assessment model dynamically to avoid circular dependencies
    const { default: Assessment } = await import('../../../../assessment/Assessment.js');
    
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      logger.warn(`Assessment not found: ${assessmentId}`);
      return null;
    }
    
    // Return the pattern field - this could be from different formats
    return assessment.pattern || assessment.assessment_pattern || null;
  } catch (error) {
    logger.error('Error getting assessment pattern:', error);
    return null;
  }
}; 