import DbService from '../../../services/dbService.js';
import TransformApiToDb from '../transformers/TransformApiToDb.js';
import type { AssessmentUpdateInput, AssessmentDbRecord } from '../types.js';

class UpdateAssessment {
  /**
   * Update an assessment
   * @param id - Assessment ID
   * @param assessmentData - Updated assessment data
   * @returns Updated assessment object
   */
  static async execute(id: string, assessmentData: AssessmentUpdateInput): Promise<AssessmentDbRecord> {
    try {
      // Transform API data to database payload
      const updates = TransformApiToDb.transform(assessmentData as any);

      // Update database
      const updated = await DbService.update<AssessmentDbRecord>('assessments', id, updates);

      return updated;
    } catch (error) {
      throw error;
    }
  }
}

export default UpdateAssessment;
