import { v4 as uuidv4 } from 'uuid';
import FindAssessment from '../services/FindAssessment.js';
import DeleteAssessment from '../services/DeleteAssessment.js';
import ValidateAssessmentData from '../validators/ValidateAssessmentData.js';
import ValidateAssessmentOwnership from '../validators/ValidateAssessmentOwnership.js';

class AssessmentBase {
  /**
   * Find an assessment by ID
   * @param {string} id - Assessment ID
   * @returns {Promise<Object|null>} Assessment object or null if not found
   */
  static async findById(id) {
    return FindAssessment.findById(
      id,
      this._transformDbRecordToApiResponse?.bind(this),
      this._canProcessRecord?.bind(this)
    );
  }

  /**
   * Check if this class can process the given record format
   * Must be implemented by subclasses
   * @param {Object} record - Database record
   * @returns {boolean} True if this class can process the record
   */
  static _canProcessRecord(record) {
    return ValidateAssessmentData._canProcessRecord(record);
  }

  /**
   * List all assessments for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of assessment objects
   */
  static async listByUser(userId) {
    return FindAssessment.listByUser(userId);
  }

  /**
   * Delete an assessment
   * @param {string} id - Assessment ID
   * @returns {Promise<boolean>} True if successful
   */
  static async delete(id) {
    return DeleteAssessment.delete(id);
  }

  /**
   * Validate if user is the owner of assessment
   * @param {string} assessmentId - Assessment ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} True if user is owner, false otherwise
   */
  static async validateOwnership(assessmentId, userId) {
    return ValidateAssessmentOwnership.validateOwnership(assessmentId, userId);
  }
}

export { AssessmentBase }; 