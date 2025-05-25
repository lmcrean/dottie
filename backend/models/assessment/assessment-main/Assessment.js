import { AssessmentBase } from '../assessment-base/AssessmentBase.js';
import CreateAssessment from './CreateAssessment.js';
import UpdateAssessment from './UpdateAssessment.js';
import ReadAssessment from './ReadAssessment.js';

class Assessment extends AssessmentBase {
  /**
   * Create a new assessment
   * @param {Object} assessmentData - Assessment data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Created assessment object
   */
  static async create(assessmentData, userId) {
    try {
      const createdAssessment = await CreateAssessment.execute(assessmentData, userId);
      
      // Transform to API format before returning if not in test mode
      if (createdAssessment && !createdAssessment.user_id) {
        // This means it came from the database and needs transformation
        const transformedAssessment = ReadAssessment.transformDbRecordToApiResponse(createdAssessment);
        
        // Remove updated_at field if it exists
        if (transformedAssessment.updated_at) {
          delete transformedAssessment.updated_at;
        }
        if (transformedAssessment.updatedAt) {
          delete transformedAssessment.updatedAt;
        }
        
        return transformedAssessment;
      }
      
      return createdAssessment;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update an assessment
   * @param {string} id - Assessment ID
   * @param {Object} assessmentData - Updated assessment data
   * @returns {Promise<Object>} Updated assessment object
   */
  static async update(id, assessmentData) {
    try {
      const updatedAssessment = await UpdateAssessment.execute(id, assessmentData);
      
      // Transform to API format before returning if not in test mode
      if (updatedAssessment && !Array.isArray(updatedAssessment.physical_symptoms)) {
        // This means it came from the database and needs transformation
        return ReadAssessment.transformDbRecordToApiResponse(updatedAssessment);
      }
      
      return updatedAssessment;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find an assessment by ID
   * @param {string} id - Assessment ID
   * @returns {Promise<Object|null>} Assessment object or null if not found
   */
  static async findById(id) {
    return ReadAssessment.findById(id);
  }

  /**
   * Transform database record to API response format
   * @param {Object} record - Database record
   * @returns {Object} API response object
   */
  static _transformDbRecordToApiResponse(record) {
    return ReadAssessment.transformDbRecordToApiResponse(record);
  }

  /**
   * Check if this class can process the given record format
   * @param {Object} record - Database record
   * @returns {boolean} True if this class can process the record
   */
  static _canProcessRecord(record) {
    return ReadAssessment.canProcessRecord(record);
  }
}

export default Assessment; 