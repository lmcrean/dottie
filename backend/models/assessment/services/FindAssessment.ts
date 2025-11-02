import DbService from '../../../services/dbService.js';
import TransformDbToApi from '../transformers/TransformDbToApi.js';
import type {
  AssessmentDbRecord,
  AssessmentResult,
  AssessmentListResult,
  AssessmentApiResponse,
  TransformerFunction,
  RecordProcessorFunction
} from '../types.js';

class FindAssessment {
  /**
   * Find an assessment by ID
   * @param id - Assessment ID
   * @param transformMethod - Method to transform DB record to API response
   * @param canProcessMethod - Method to check if record can be processed
   * @returns Assessment object or null if not found
   */
  static async findById(
    id: string,
    transformMethod?: TransformerFunction,
    canProcessMethod?: RecordProcessorFunction
  ): Promise<AssessmentResult> {
    try {
      // Get the assessment from database
      const assessment = await DbService.findById<AssessmentDbRecord>('assessments', id);

      if (!assessment) return null;

      // Check if this class can handle this format
      if (canProcessMethod && !canProcessMethod(assessment)) {
        return null;
      }

      // Transform to API format before returning
      return transformMethod ? transformMethod(assessment) : (assessment as any);
    } catch (error) {
      throw error;
    }
  }

  /**
   * List all assessments for a user
   * @param userId - User ID
   * @returns Array of assessment objects
   */
  static async listByUser(userId: string): Promise<AssessmentListResult> {
    try {
      // Get all assessments for user
      const rawAssessments = await DbService.findBy<AssessmentDbRecord>('assessments', 'user_id', userId);

      const transformedAssessments = rawAssessments
        .map(assessment => TransformDbToApi.transform(assessment))
        .filter((assessment): assessment is AssessmentApiResponse => assessment !== null);

      return transformedAssessments;
    } catch (error) {
      console.error(`[FindAssessment.listByUser] Error listing assessments for userId ${userId}:`, error);
      throw error;
    }
  }
}

export default FindAssessment;
