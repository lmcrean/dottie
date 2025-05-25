import DbService from '../../../services/dbService.js';

class DeleteAssessment {
  /**
   * Delete an assessment
   * @param {string} id - Assessment ID
   * @returns {Promise<boolean>} True if successful
   */
  static async delete(id) {
    try {
      return await DbService.delete('assessments', id);
    } catch (error) {
      throw error;
    }
  }
}

export default DeleteAssessment; 