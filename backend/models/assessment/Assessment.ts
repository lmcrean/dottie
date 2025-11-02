import RouteAssessment from './services/RouteAssessment.js';
import type {
  AssessmentResult,
  AssessmentListResult,
  AssessmentApiInput,
  AssessmentUpdateInput,
  AssessmentDbRecord
} from './types.js';

/**
 * Assessment - Unified entry point for all assessment operations
 */
class Assessment {
  /**
   * Find an assessment by ID
   * @param id - Assessment ID
   * @returns Assessment object or null if not found
   */
  static async findById(id: string): Promise<AssessmentResult> {
    return await RouteAssessment.findById(id);
  }

  /**
   * Create a new assessment
   * @param assessmentData - Assessment data
   * @param userId - User ID
   * @returns Created assessment object
   */
  static async create(assessmentData: AssessmentApiInput, userId: string): Promise<AssessmentDbRecord> {
    return await RouteAssessment.create(assessmentData, userId);
  }

  /**
   * Update an assessment
   * @param id - Assessment ID
   * @param assessmentData - Updated assessment data
   * @returns Updated assessment object
   */
  static async update(id: string, assessmentData: AssessmentUpdateInput): Promise<AssessmentDbRecord> {
    return await RouteAssessment.update(id, assessmentData);
  }

  /**
   * List all assessments for a user
   * @param userId - User ID
   * @returns Array of assessment objects
   */
  static async listByUser(userId: string): Promise<AssessmentListResult> {
    return await RouteAssessment.listByUser(userId);
  }

  /**
   * Delete an assessment
   * @param id - Assessment ID
   * @returns True if successful
   */
  static async delete(id: string): Promise<boolean> {
    return await RouteAssessment.delete(id);
  }

  /**
   * Validate if user is the owner of assessment
   * @param assessmentId - Assessment ID
   * @param userId - User ID
   * @returns True if user is owner, false otherwise
   */
  static async validateOwnership(assessmentId: string, userId: string): Promise<boolean> {
    return await RouteAssessment.validateOwnership(assessmentId, userId);
  }
}

export default Assessment;
