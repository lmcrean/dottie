import LegacyAssessment from './archive/LegacyAssessment.js';
import FlattenedAssessment from './FlattenedAssessment.js';
import { testAssessments, isTestMode } from './AssessmentBase.js';

class Assessment {
  /**
   * Find an assessment by ID
   * @param {string} id - Assessment ID
   * @returns {Promise<Object|null>} Assessment object or null if not found
   */
  static async findById(id) {    
    // Check test mode first
    if (isTestMode && testAssessments[id]) {
      return testAssessments[id];
    }
    
    // Get the raw record first to determine its format
    const DbService = (await import('../../services/dbService.js')).default;
    const rawRecord = await DbService.findById('assessments', id);
    
    if (!rawRecord) {
      return null;
    }
    
    // Properly determine format by checking for assessment_data field
    if (rawRecord.assessment_data) {
      return await LegacyAssessment.findById(id);
    } else {
      return await FlattenedAssessment.findById(id);
    }
  }

  /**
   * Create a new assessment, choosing the appropriate format
   * @param {Object} assessmentData - Assessment data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Created assessment object
   */
  static async create(assessmentData, userId) {
    // Use legacy format if assessment_data is present
    if (assessmentData.assessment_data) {
      return await LegacyAssessment.create(assessmentData, userId);
    } else {
      // Use flattened format
      return await FlattenedAssessment.create(assessmentData, userId);
    }
  }

  /**
   * Update an assessment, choosing the appropriate format
   * @param {string} id - Assessment ID
   * @param {Object} assessmentData - Updated assessment data
   * @returns {Promise<Object>} Updated assessment object
   */
  static async update(id, assessmentData) {
    // Use legacy format if assessment_data is present
    if (assessmentData.assessment_data) {
      return await LegacyAssessment.update(id, assessmentData);
    } else {
      // Use flattened format
      return await FlattenedAssessment.update(id, assessmentData);
    }
  }

  /**
   * List all assessments for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of assessment objects
   */
  static async listByUser(userId) {
    // Either class can handle this since they both provide the same transformation output
    return await LegacyAssessment.listByUser(userId);
  }

  /**
   * Delete an assessment
   * @param {string} id - Assessment ID
   * @returns {Promise<boolean>} True if successful
   */
  static async delete(id) {
    // Either class can handle this
    return await LegacyAssessment.delete(id);
  }

  /**
   * Validate if user is the owner of assessment
   * @param {string} assessmentId - Assessment ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} True if user is owner, false otherwise
   */
  static async validateOwnership(assessmentId, userId) {
    // Either class can handle this
    return await LegacyAssessment.validateOwnership(assessmentId, userId);
  }

  /**
   * Transform database record to API response format
   * Decides between legacy and flattened formats automatically
   * @param {Object} record - Database record
   * @returns {Object} API response object
   * @private
   */
  static _transformDbRecordToApiResponse(record) {
    if (!record) return null;
    
    // Route to the appropriate transformer based on record format
    if (record.assessment_data) {
      return LegacyAssessment._transformDbRecordToApiResponse(record);
    } else {
      return FlattenedAssessment._transformDbRecordToApiResponse(record);
    }
  }
}

export default Assessment; 