import { v4 as uuidv4 } from 'uuid';
import DbService from '../../../services/dbService.js';
import TransformApiToDb from '../transformers/TransformApiToDb.js';
import type { AssessmentApiInput, AssessmentDbRecord } from '../types.js';

class CreateAssessment {
  /**
   * Create a new assessment
   * @param assessmentData - Assessment data
   * @param userId - User ID
   * @returns Created assessment object
   */
  static async execute(assessmentData: AssessmentApiInput, userId: string): Promise<AssessmentDbRecord> {
    try {
      const id = uuidv4();
      const now = new Date();

      // Transform API data to database payload
      const transformedData = TransformApiToDb.transform(assessmentData);

      // Create full payload with metadata
      const payload = {
        id,
        user_id: userId,
        created_at: now.toISOString(),
        ...transformedData
      };

      // Insert into database
      const inserted = await DbService.create<AssessmentDbRecord>('assessments', payload);

      return inserted;
    } catch (error) {
      throw error;
    }
  }
}

export default CreateAssessment;
