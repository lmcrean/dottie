import DbService from '../../../db/index.ts'
import TransformApiToDb from '../transformers/TransformApiToDb.ts'
import { v4 as uuidv4 } from 'uuid';
// TODO: Fix empty import
// TODO: Fix empty import

class CreateAssessment {
  /**
   * Create a new assessment
   * @param {Object} assessmentData - Assessment data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Created assessment object
   */
  static async execute(assessmentData, userId) {
    try {
      const id = uuidv4();
      const now = new Date();

      // Transform API data to database payload
      const transformedData = TransformApiToDb.transform(assessmentData);

      // Create full payload with metadata
      const payload = {
        id,
        user_id: userId,
        created_at: now,
        ...transformedData
      };

      // Insert into database
      const inserted = await DbService.create('assessments', payload);
      
      return inserted;
    } catch (error) {
      throw error;
    }
  }
}

export default CreateAssessment; 
