import { testAssessments, isTestMode } from '../assessment-base/AssessmentTestUtils.js';
import DbService from '../../../services/dbService.js';
import TransformDbToApi from './TransformDbToApi.js';
import ValidateAssessmentFormat from './ValidateAssessmentFormat.js';

class ReadAssessment {
  /**
   * Find an assessment by ID
   * @param {string} id - Assessment ID
   * @returns {Promise<Object|null>} Assessment object or null if not found
   */
  static async findById(id) {
    try {
      if (isTestMode && testAssessments[id]) {
        return testAssessments[id];
      }

      // Get the assessment from database
      const assessment = await DbService.findById('assessments', id);
      
      if (!assessment) {
        return null;
      }
      
      // Check if this class can handle this format
      if (!ValidateAssessmentFormat.canProcessRecord(assessment)) {
        return null;
      }
      
      // Transform to API format before returning
      return TransformDbToApi.transform(assessment);
    } catch (error) {
      console.error(`Error finding assessment by ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Transform database record to API response format
   * @param {Object} record - Database record
   * @returns {Object} API response object
   */
  static transformDbRecordToApiResponse(record) {
    return TransformDbToApi.transform(record);
  }

  /**
   * Check if this class can process the given record format
   * @param {Object} record - Database record
   * @returns {boolean} True if this class can process the record
   */
  static canProcessRecord(record) {
    return ValidateAssessmentFormat.canProcessRecord(record);
  }
}

export default ReadAssessment; 