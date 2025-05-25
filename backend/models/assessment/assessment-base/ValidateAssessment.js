import db from '../../../db/index.js';

class ValidateAssessment {
  /**
   * Check if this class can process the given record format
   * Must be implemented by subclasses
   * @param {Object} record - Database record
   * @returns {boolean} True if this class can process the record
   */
  static _canProcessRecord(record) {
    // Base implementation always returns false
    // Subclasses should override with specific format checks
    return false;
  }

  /**
   * Validate if user is the owner of assessment
   * @param {string} assessmentId - Assessment ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} True if user is owner, false otherwise
   */
  static async validateOwnership(assessmentId, userId) {
    try {
      // Database check using direct query for reliability
      const assessment = await db('assessments')
        .where('id', assessmentId)
        .where('user_id', userId)
        .first();
      
      // If assessment exists and user is the owner, return true
      return !!assessment;
    } catch (error) {
      console.error('Error validating ownership:', error);
      return false;
    }
  }
}

export default ValidateAssessment; 