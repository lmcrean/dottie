import CleanAssessmentOperations from './assessment-base/CleanAssessmentOperations.js';

/**
 * Unified Assessment class - single entry point for all assessment operations
 * Automatically handles both legacy and current format assessments
 */
class UnifiedAssessment {
  /**
   * Find an assessment by ID
   * @param {string} id - Assessment ID
   * @returns {Promise<Object|null>} Assessment object or null if not found
   */
  static async findById(id) {
    return await CleanAssessmentOperations.findById(id);
  }

  /**
   * Create a new assessment
   * @param {Object} assessmentData - Assessment data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Created assessment object
   */
  static async create(assessmentData, userId) {
    return await CleanAssessmentOperations.create(assessmentData, userId);
  }

  /**
   * Update an assessment
   * @param {string} id - Assessment ID
   * @param {Object} assessmentData - Updated assessment data
   * @returns {Promise<Object>} Updated assessment object
   */
  static async update(id, assessmentData) {
    return await CleanAssessmentOperations.update(id, assessmentData);
  }

  /**
   * List all assessments for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of assessment objects
   */
  static async listByUser(userId) {
    return await CleanAssessmentOperations.listByUser(userId);
  }

  /**
   * Delete an assessment
   * @param {string} id - Assessment ID
   * @returns {Promise<boolean>} True if successful
   */
  static async delete(id) {
    return await CleanAssessmentOperations.delete(id);
  }

  /**
   * Validate if user is the owner of assessment
   * @param {string} assessmentId - Assessment ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} True if user is owner, false otherwise
   */
  static async validateOwnership(assessmentId, userId) {
    return await CleanAssessmentOperations.validateOwnership(assessmentId, userId);
  }
}

export default UnifiedAssessment; 