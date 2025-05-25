import DbService from '../../../services/dbService.js';
import { testAssessments, isTestMode } from './AssessmentTestUtils.js';

class DeleteAssessment {
  /**
   * Delete an assessment
   * @param {string} id - Assessment ID
   * @returns {Promise<boolean>} True if successful
   */
  static async delete(id) {
    try {
      // Use in-memory store for tests
      if (isTestMode) {
        if (!testAssessments[id]) {
          throw new Error(`Assessment with ID ${id} not found`);
        }

        delete testAssessments[id];
        return true;
      }
      
      return await DbService.delete('assessments', id);
    } catch (error) {
      throw error;
    }
  }
}

export default DeleteAssessment; 