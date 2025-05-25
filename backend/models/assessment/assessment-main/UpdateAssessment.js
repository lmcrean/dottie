import { testAssessments, isTestMode } from '../assessment-base/AssessmentTestUtils.js';
import DbService from '../../../services/dbService.js';
import TransformApiToDb from './TransformApiToDb.js';

class UpdateAssessment {
  /**
   * Update an assessment
   * @param {string} id - Assessment ID
   * @param {Object} assessmentData - Updated assessment data
   * @returns {Promise<Object>} Updated assessment object
   */
  static async execute(id, assessmentData) {
    try {
      // Use in-memory store for tests
      if (isTestMode) {
        if (!testAssessments[id]) {
          throw new Error(`Assessment with ID ${id} not found`);
        }

        // Extract data
        const {
          age, pattern, cycle_length, period_duration, flow_heaviness, pain_level, 
          physical_symptoms, emotional_symptoms, other_symptoms, recommendations
        } = assessmentData;
        
        // Update with snake_case keys
        testAssessments[id] = {
          ...testAssessments[id],
          age,
          pattern,
          cycle_length,
          period_duration,
          flow_heaviness,
          pain_level,
          physical_symptoms: physical_symptoms || [],
          emotional_symptoms: emotional_symptoms || [],
          other_symptoms: other_symptoms || '',
          recommendations: recommendations || []
        };

        return testAssessments[id];
      }
      
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