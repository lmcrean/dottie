import DbService from '../../../services/dbService.js';
import TransformDbToApi from '../transformers/TransformDbToApi.js';
import CreateAssessment from './CreateAssessment.js';
import UpdateAssessment from './UpdateAssessment.js';

class RouteAssessment {
  /**
   * Find an assessment by ID
   * @param {string} id - Assessment ID
   * @returns {Promise<Object|null>} Assessment object or null if not found
   */
  static async findById(id) {
    try {
      const rawRecord = await DbService.findById('assessments', id);
      
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
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of assessment objects
   */
  static async listByUser(userId) {
    try {
      const rawAssessments = await DbService.findBy('assessments', 'user_id', userId);
      
      const transformedAssessments = rawAssessments.map(assessment => 
        TransformDbToApi.transform(assessment)
      );

      return transformedAssessments.filter(Boolean);
    } catch (error) {
      console.error(`Error listing assessments for userId ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Delete an assessment
   * @param {string} id - Assessment ID
   * @returns {Promise<boolean>} True if successful
   */
  static async delete(id) {
    try {
      return await DbService.delete('assessments', id);
    } catch (error) {
      console.error(`Error deleting assessment ${id}:`, error);
      throw error;
    }
  }

  /**
   * Validate if user is the owner of assessment
   * @param {string} assessmentId - Assessment ID
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} True if user is owner, false otherwise
   */
  static async validateOwnership(assessmentId, userId) {
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
   * @param {Object} assessmentData - Assessment data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Created assessment object
   */
  static async create(assessmentData, userId) {
    return await CreateAssessment.execute(assessmentData, userId);
  }

  /**
   * Update assessment
   * @param {string} id - Assessment ID
   * @param {Object} assessmentData - Updated assessment data
   * @returns {Promise<Object>} Updated assessment object
   */
  static async update(id, assessmentData) {
    return await UpdateAssessment.execute(id, assessmentData);
  }
}

export default RouteAssessment; 