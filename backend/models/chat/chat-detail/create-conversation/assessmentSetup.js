import logger from '../../../../services/logger.js';
import { getAssessmentPattern } from '../shared/assessment/assessmentHelper.js';
import { validateAssessmentOwnership } from '../shared/assessment/assessmentValidator.js';

/**
 * Setup assessment context for a new conversation
 * @param {string} userId - User ID
 * @param {string} assessmentId - Assessment ID
 * @returns {Promise<Object>} - Assessment setup result
 */
export const setupAssessmentContext = async (userId, assessmentId) => {
  try {
    // Validate that user owns the assessment
    const isOwner = await validateAssessmentOwnership(userId, assessmentId);
    if (!isOwner) {
      throw new Error('User does not own this assessment');
    }

    // Get the assessment pattern
    const assessmentPattern = await getAssessmentPattern(assessmentId);
    if (!assessmentPattern) {
      throw new Error('Assessment pattern not found');
    }

    logger.info(`Assessment setup successful for user ${userId}, assessment ${assessmentId}`);
    return {
      assessmentId,
      assessmentPattern,
      isValid: true
    };

  } catch (error) {
    logger.error('Error setting up assessment context:', error);
    throw error;
  }
};

/**
 * Validate assessment context before conversation creation
 * @param {string} userId - User ID
 * @param {string} assessmentId - Assessment ID
 * @returns {Promise<boolean>} - Validation result
 */
export const validateAssessmentContext = async (userId, assessmentId) => {
  try {
    if (!assessmentId) return true; // Assessment is optional

    const isOwner = await validateAssessmentOwnership(userId, assessmentId);
    const pattern = await getAssessmentPattern(assessmentId);

    return isOwner && !!pattern;
  } catch (error) {
    logger.error('Error validating assessment context:', error);
    return false;
  }
}; 