import DbService from '../../../services/dbService.js';
import TransformDbToApi from '../transformers/TransformDbToApi.js';
import CreateAssessment from './CreateAssessment.js';
import UpdateAssessment from './UpdateAssessment.js';
import type {
  AssessmentResult,
  AssessmentListResult,
  AssessmentApiInput,
  AssessmentUpdateInput,
  AssessmentDbRecord
} from '../types.js';

class RouteAssessment {
  /**
   * Find an assessment by ID
   * @param id - Assessment ID
   * @returns Assessment object or null if not found
   */
  static async findById(id: string): Promise<AssessmentResult> {
    try {
      const rawRecord = await DbService.findById<AssessmentDbRecord>('assessments', id);

      if (!rawRecord) {
        return null;
      }

      return TransformDbToApi.transform(rawRecord);
    } catch (error) {
      console.error(`Error finding assessment by ID ${id}:`, error);
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
      const rawAssessments = await DbService.findBy<AssessmentDbRecord>('assessments', 'user_id', userId);

      const transformedAssessments = rawAssessments
        .map(assessment => TransformDbToApi.transform(assessment))
        .filter((assessment): assessment is NonNullable<typeof assessment> => assessment !== null);

      return transformedAssessments;
    } catch (error) {
      console.error(`Error listing assessments for userId ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Delete an assessment
   * @param id - Assessment ID
   * @returns True if successful
   */
  static async delete(id: string): Promise<boolean> {
    try {
      return await DbService.delete('assessments', id);
    } catch (error) {
      console.error(`Error deleting assessment ${id}:`, error);
      throw error;
    }
  }

  /**
   * Validate if user is the owner of assessment
   * @param assessmentId - Assessment ID
   * @param userId - User ID
   * @returns True if user is owner, false otherwise
   */
  static async validateOwnership(assessmentId: string, userId: string): Promise<boolean> {
    try {
      const db = (await import('../../../db/index.js')).default;
      const assessment = await db('assessments')
        .where('id', assessmentId)
        .where('user_id', userId)
        .first();

      return !!assessment;
    } catch (error) {
      console.error('Error validating ownership:', error);
      return false;
    }
  }

  /**
   * Create assessment
   * @param assessmentData - Assessment data
   * @param userId - User ID
   * @returns Created assessment object
   */
  static async create(assessmentData: AssessmentApiInput, userId: string): Promise<AssessmentDbRecord> {
    return await CreateAssessment.execute(assessmentData, userId);
  }

  /**
   * Update assessment
   * @param id - Assessment ID
   * @param assessmentData - Updated assessment data
   * @returns Updated assessment object
   */
  static async update(id: string, assessmentData: AssessmentUpdateInput): Promise<AssessmentDbRecord> {
    return await UpdateAssessment.execute(id, assessmentData);
  }
}

export default RouteAssessment;
