import DbService from '../../../../../services/db-service/dbService.js';
import logger from '../../../../../services/logger.js';

/**
 * Fetch and structure assessment object for conversation linking
 * @param {string} assessmentId - Assessment ID to fetch
 * @returns {Promise<Object|null>} - Structured assessment data or null
 */
export const fetchAssessmentObject = async (assessmentId) => {
  try {
    if (!assessmentId) {
      logger.debug('No assessment ID provided for fetching');
      return null;
    }

    // Fetch the assessment from database
    const assessment = await DbService.findById('assessments', assessmentId);
    
    if (!assessment) {
      logger.warn(`Assessment ${assessmentId} not found`);
      return null;
    }

    // Structure the assessment object with all relevant fields
    const assessmentObject = {
      id: assessment.id,
      user_id: assessment.user_id,
      age: assessment.age,
      pattern: assessment.pattern,
      cycle_length: assessment.cycle_length,
      period_duration: assessment.period_duration,
      flow_heaviness: assessment.flow_heaviness,
      pain_level: assessment.pain_level,
      physical_symptoms: assessment.physical_symptoms || [],
      emotional_symptoms: assessment.emotional_symptoms || [],
      other_symptoms: assessment.other_symptoms || null,
      recommendations: assessment.recommendations || [],
      created_at: assessment.created_at,
      updated_at: assessment.updated_at
    };

    logger.info(`Successfully fetched assessment object for ${assessmentId}`, {
      pattern: assessmentObject.pattern
    });

    return assessmentObject;
  } catch (error) {
    logger.error(`Error fetching assessment object for ${assessmentId}:`, error);
    throw new Error(`Failed to fetch assessment data: ${error.message}`);
  }
};

/**
 * Extract pattern from assessment object
 * @param {Object} assessmentObject - Assessment object
 * @returns {string|null} - Pattern value or null
 */
export const extractAssessmentPattern = (assessmentObject) => {
  if (!assessmentObject || !assessmentObject.pattern) {
    return null;
  }
  return assessmentObject.pattern;
}; 