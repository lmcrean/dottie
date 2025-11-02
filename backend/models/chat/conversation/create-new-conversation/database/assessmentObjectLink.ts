import DbService from '../../../../../services/db-service/dbService.js';
import logger from '../../../../../services/logger.js';

/**
 * Structured assessment object for conversation linking
 */
export interface AssessmentObject {
  id: number | string;
  user_id: number | string;
  age: number;
  pattern: string;
  cycle_length: number;
  period_duration: number;
  flow_heaviness: string;
  pain_level: number;
  physical_symptoms: any[];
  emotional_symptoms: any[];
  other_symptoms: any;
  recommendations: any[];
  created_at: Date | string;
  updated_at: Date | string;
}

/**
 * Fetch and structure assessment object for conversation linking
 * @param assessmentId - Assessment ID to fetch
 * @returns Structured assessment data or null
 */
export const fetchAssessmentObject = async (
  assessmentId: number | string
): Promise<AssessmentObject | null> => {
  try {
    if (!assessmentId) {
      logger.debug('No assessment ID provided for fetching');
      return null;
    }

    // Fetch the assessment from database
    const assessment = await DbService.findById('assessments', assessmentId) as any;

    if (!assessment) {
      logger.warn(`Assessment ${assessmentId} not found`);
      return null;
    }

    // Structure the assessment object with all relevant fields
    const assessmentObject: AssessmentObject = {
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
    throw new Error(`Failed to fetch assessment data: ${(error as Error).message}`);
  }
};

/**
 * Extract pattern from assessment object
 * @param assessmentObject - Assessment object
 * @returns Pattern value or null
 */
export const extractAssessmentPattern = (
  assessmentObject: AssessmentObject | null
): string | null => {
  if (!assessmentObject || !assessmentObject.pattern) {
    return null;
  }
  return assessmentObject.pattern;
};
