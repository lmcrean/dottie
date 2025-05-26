import DbService from '';
import TransformApiToDb from '';

class UpdateAssessment {
  /**
   * Update an assessment
   * @param {string} id - Assessment ID
   * @param {Object} assessmentData - Updated assessment data
   * @returns {Promise<Object>} Updated assessment object
   */
  static async execute(id, assessmentData) {
    try {
      // Transform API data to database payload
      const updates = TransformApiToDb.transform(assessmentData);
      
      // Update database
      const updated = await DbService.update('assessments', id, updates);
      
      return updated;
    } catch (error) {
      throw error;
    }
  }
}

export default UpdateAssessment; 
