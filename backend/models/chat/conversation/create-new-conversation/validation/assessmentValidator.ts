import logger from '../../../../../services/logger.ts';

/**
 * Assessment validation details
 */
export interface AssessmentValidationDetails {
  id: string | number;
  user_id: string | number;
  pattern?: string | null;
  created_at: Date | string;
  updated_at: Date | string;
  isValid: boolean;
}

/**
 * Multiple assessments validation results
 */
export interface MultipleAssessmentsValidationResult {
  valid: (string | number)[];
  invalid: (string | number)[];
  notFound: (string | number)[];
  notOwned: (string | number)[];
}

/**
 * Validate that a user owns an assessment
 * @param userId - User ID
 * @param assessmentId - Assessment ID
 * @returns True if user owns assessment
 */
export const validateAssessmentOwnership = async (
  userId: string | number | undefined | null,
  assessmentId: string | number | undefined | null
): Promise<boolean> => {
  if (!userId || !assessmentId) return false;

  try {
    // Import Assessment model dynamically to avoid circular dependencies
    const { default: Assessment } = await import('../../../../assessment/Assessment.js');

    const assessment = await Assessment.findById(String(assessmentId));
    if (!assessment) {
      logger.warn(`Assessment not found: ${assessmentId}`);
      return false;
    }

    // Check if user owns this assessment
    const isOwner = assessment.user_id === userId || String(assessment.user_id) === String(userId);

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
 * @param assessmentId - Assessment ID
 * @returns True if assessment is valid and accessible
 */
export const validateAssessmentExists = async (
  assessmentId: string | number | undefined | null
): Promise<boolean> => {
  if (!assessmentId) return false;

  try {
    const { default: Assessment } = await import('../../../../assessment/Assessment.js');

    const assessment = await Assessment.findById(String(assessmentId));
    return !!assessment;
  } catch (error) {
    logger.error('Error validating assessment exists:', error);
    return false;
  }
};

/**
 * Validate assessment and get its details
 * @param userId - User ID
 * @param assessmentId - Assessment ID
 * @returns Assessment details or null
 */
export const validateAndGetAssessment = async (
  userId: string | number | undefined | null,
  assessmentId: string | number | undefined | null
): Promise<AssessmentValidationDetails | null> => {
  if (!userId || !assessmentId) return null;

  try {
    const { default: Assessment } = await import('../../../../assessment/Assessment.js');

    const assessment = await Assessment.findById(String(assessmentId));
    if (!assessment) {
      logger.warn(`Assessment not found: ${assessmentId}`);
      return null;
    }

    // Check ownership
    if (assessment.user_id !== userId && String(assessment.user_id) !== String(userId)) {
      logger.warn(`User ${userId} does not own assessment ${assessmentId}`);
      return null;
    }

    return {
      id: assessment.id,
      user_id: assessment.user_id,
      pattern: (assessment as any).pattern || (assessment as any).assessment_pattern,
      created_at: assessment.created_at,
      updated_at: (assessment as any).updated_at || assessment.created_at,
      isValid: true
    };
  } catch (error) {
    logger.error('Error validating and getting assessment:', error);
    return null;
  }
};

/**
 * Validate multiple assessments for a user
 * @param userId - User ID
 * @param assessmentIds - Array of assessment IDs
 * @returns Validation results
 */
export const validateMultipleAssessments = async (
  userId: string | number,
  assessmentIds: (string | number)[]
): Promise<MultipleAssessmentsValidationResult> => {
  const results: MultipleAssessmentsValidationResult = {
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
