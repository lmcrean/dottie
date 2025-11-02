import FindAssessment from '../services/FindAssessment.js';
import DeleteAssessment from '../services/DeleteAssessment.js';
import ValidateAssessmentData from '../validators/ValidateAssessmentData.js';
import ValidateAssessmentOwnership from '../validators/ValidateAssessmentOwnership.js';
import type {
  AssessmentResult,
  AssessmentListResult,
  AssessmentDbRecord,
  TransformerFunction,
  RecordProcessorFunction
} from '../types.js';

class AssessmentBase {
  /**
   * Find an assessment by ID
   * @param id - Assessment ID
   * @returns Assessment object or null if not found
   */
  static async findById(id: string): Promise<AssessmentResult> {
    return FindAssessment.findById(
      id,
      this._transformDbRecordToApiResponse?.bind(this) as TransformerFunction | undefined,
      this._canProcessRecord?.bind(this) as RecordProcessorFunction | undefined
    );
  }

  /**
   * Check if this class can process the given record format
   * Must be implemented by subclasses
   * @param record - Database record
   * @returns True if this class can process the record
   */
  static _canProcessRecord(record: AssessmentDbRecord): boolean {
    return ValidateAssessmentData._canProcessRecord(record);
  }

  /**
   * Transform database record to API response
   * Can be overridden by subclasses for custom transformations
   * @param record - Database record
   * @returns Transformed API response or null
   */
  static _transformDbRecordToApiResponse?(record: AssessmentDbRecord): AssessmentResult {
    // Default implementation - subclasses can override
    return null;
  }

  /**
   * List all assessments for a user
   * @param userId - User ID
   * @returns Array of assessment objects
   */
  static async listByUser(userId: string): Promise<AssessmentListResult> {
    return FindAssessment.listByUser(userId);
  }

  /**
   * Delete an assessment
   * @param id - Assessment ID
   * @returns True if successful
   */
  static async delete(id: string): Promise<boolean> {
    return DeleteAssessment.delete(id);
  }

  /**
   * Validate if user is the owner of assessment
   * @param assessmentId - Assessment ID
   * @param userId - User ID
   * @returns True if user is owner, false otherwise
   */
  static async validateOwnership(assessmentId: string, userId: string): Promise<boolean> {
    return ValidateAssessmentOwnership.validateOwnership(assessmentId, userId);
  }
}

export { AssessmentBase };
