import DbService from '../../../services/dbService.js';

class DeleteAssessment {
  /**
   * Delete an assessment
   * @param id - Assessment ID
   * @returns True if successful
   */
  static async delete(id: string): Promise<boolean> {
    try {
      return await DbService.delete('assessments', id);
    } catch (error) {
      throw error;
    }
  }
}

export default DeleteAssessment;
