import { testAssessments, isTestMode } from '../assessment-base/AssessmentTestUtils.js';
import { v4 as uuidv4 } from 'uuid';
import DbService from '../../../services/dbService.js';
import TransformApiToDb from './TransformApiToDb.js';

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

      if (isTestMode) {
        // Extract data and create with snake_case keys
        const {
          age, pattern, cycle_length, period_duration, flow_heaviness, pain_level, 
          physical_symptoms, emotional_symptoms, other_symptoms, recommendations
        } = assessmentData;
        
        const assessment = {
          id,
          user_id: userId,
          created_at: now,
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
        
        testAssessments[id] = assessment;
        return assessment;
      }

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