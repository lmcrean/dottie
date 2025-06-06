import DbService from '../../../services/dbService.js';
import TransformDbToApi from '../transformers/TransformDbToApi.js';

class FindAssessment {
  /**
   * Find an assessment by ID
   * @param {string} id - Assessment ID
   * @param {Function} transformMethod - Method to transform DB record to API response
   * @param {Function} canProcessMethod - Method to check if record can be processed
   * @returns {Promise<Object|null>} Assessment object or null if not found
   */
  static async findById(id, transformMethod, canProcessMethod) {
    try {
      // Get the assessment from database
      const assessment = await DbService.findById('assessments', id);
      
      if (!assessment) return null;
      
      // Check if this class can handle this format
      if (canProcessMethod && !canProcessMethod(assessment)) {
        return null;
      }
      
      // Transform to API format before returning
      return transformMethod ? transformMethod(assessment) : assessment;
    } catch (error) {
      throw error;
    }
  }

  /**
   * List all assessments for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of assessment objects
   */
  static async listByUser(userId) {
    try {
      // Get all assessments for user
      const rawAssessments = await DbService.findBy('assessments', 'user_id', userId);

      const transformedAssessments = rawAssessments.map(assessment => 
        TransformDbToApi.transform(assessment)
      );

      return transformedAssessments;
    } catch (error) {
      console.error(`[FindAssessment.listByUser] Error listing assessments for userId ${userId}:`, error);
      throw error;
    }
  }
}

export default FindAssessment; 