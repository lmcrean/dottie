import { AssessmentBase, testAssessments, isTestMode } from './AssessmentBase.js';
import { v4 as uuidv4 } from 'uuid';
import DbService from '../../services/dbService.js';

class FlattenedAssessment extends AssessmentBase {
  /**
   * Create a new assessment with flattened format
   * @param {Object} assessmentData - Assessment data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Created assessment object
   */
  static async create(assessmentData, userId) {
    try {
      const id = uuidv4();
      const now = new Date();

      if (isTestMode) {
        // Extract data for flattened format and create with snake_case keys
        const {
          age, pattern, cycleLength, periodDuration, flowHeaviness, painLevel, symptoms, recommendations
        } = assessmentData;
        
        const assessment = {
          id,
          user_id: userId,
          created_at: now,
          updated_at: now,
          age,
          pattern,
          cycle_length: cycleLength,
          period_duration: periodDuration,
          flow_heaviness: flowHeaviness,
          pain_level: painLevel,
          physical_symptoms: symptoms?.physical || [],
          emotional_symptoms: symptoms?.emotional || [],
          recommendations: recommendations || []
        };
        
        testAssessments[id] = assessment;
        return assessment;
      }

      // Extract data for flattened format
      const {
        age, pattern, cycleLength, periodDuration, flowHeaviness, painLevel, symptoms, recommendations
      } = assessmentData;
      
      // Use new flattened format
      const payload = {
        id,
        user_id: userId,
        created_at: now,
        updated_at: now,
        
        // Flattened fields
        age,
        pattern,
        cycle_length: cycleLength,
        period_duration: periodDuration,
        flow_heaviness: flowHeaviness,
        pain_level: painLevel,
        
        // Array fields as JSON strings
        physical_symptoms: symptoms?.physical ? JSON.stringify(symptoms.physical) : null,
        emotional_symptoms: symptoms?.emotional ? JSON.stringify(symptoms.emotional) : null,
        recommendations: recommendations ? JSON.stringify(recommendations) : null
      };

      // Insert into database
      const inserted = await DbService.create('assessments', payload);
      
      // Transform to API format before returning
      return this._transformDbRecordToApiResponse(inserted);
    } catch (error) {
      console.error('Error creating assessment:', error);
      throw error;
    }
  }

  /**
   * Update an assessment using flattened format
   * @param {string} id - Assessment ID
   * @param {Object} assessmentData - Updated assessment data
   * @returns {Promise<Object>} Updated assessment object
   */
  static async update(id, assessmentData) {
    try {
      const now = new Date();

      // Use in-memory store for tests
      if (isTestMode) {
        if (!testAssessments[id]) {
          throw new Error(`Assessment with ID ${id} not found`);
        }

        // Extract data for flattened format
        const {
          age, pattern, cycleLength, periodDuration, flowHeaviness, painLevel, symptoms, recommendations
        } = assessmentData;
        
        // Update with snake_case keys
        testAssessments[id] = {
          ...testAssessments[id],
          updated_at: now,
          age,
          pattern,
          cycle_length: cycleLength,
          period_duration: periodDuration,
          flow_heaviness: flowHeaviness,
          pain_level: painLevel,
          physical_symptoms: symptoms?.physical || [],
          emotional_symptoms: symptoms?.emotional || [],
          recommendations: recommendations || []
        };

        return testAssessments[id];
      }
      
      // Extract data for flattened format
      const {
        age, pattern, cycleLength, periodDuration, flowHeaviness, painLevel, symptoms, recommendations
      } = assessmentData;
      
      // Use flattened format
      const updates = {
        updated_at: now,
        
        // Flattened fields
        age,
        pattern,
        cycle_length: cycleLength,
        period_duration: periodDuration,
        flow_heaviness: flowHeaviness,
        pain_level: painLevel,
        
        // Array fields as JSON strings
        physical_symptoms: symptoms?.physical ? JSON.stringify(symptoms.physical) : null,
        emotional_symptoms: symptoms?.emotional ? JSON.stringify(symptoms.emotional) : null,
        recommendations: recommendations ? JSON.stringify(recommendations) : null
      };
      
      // Update database
      const updated = await DbService.update('assessments', id, updates);
      
      // Transform to API format before returning
      return this._transformDbRecordToApiResponse(updated);
    } catch (error) {
      console.error('Error updating assessment:', error);
      throw error;
    }
  }

  /**
   * Transform database record to API response format for flattened schema
   * @param {Object} record - Database record
   * @returns {Object} API response object
   */
  static _transformDbRecordToApiResponse(record) {
    if (!record) return null;
    
    // If record has legacy format, defer to LegacyAssessment handler
    if (record.assessment_data) {
      // This should be handled by the Assessment class which will route to LegacyAssessment
      return null;
    }
    
    let physicalSymptoms = [];
    let emotionalSymptoms = [];
    let recommendations = [];
    
    try {
      // Parse JSON stored arrays if they exist
      if (record.physical_symptoms) {
        physicalSymptoms = JSON.parse(record.physical_symptoms);
      }
    } catch (error) {
      console.error(`Failed to parse physical_symptoms for record ${record.id}:`, error);
    }
    
    try {
      if (record.emotional_symptoms) {
        emotionalSymptoms = JSON.parse(record.emotional_symptoms);
      }
    } catch (error) {
      console.error(`Failed to parse emotional_symptoms for record ${record.id}:`, error);
    }
    
    try {
      if (record.recommendations) {
        recommendations = JSON.parse(record.recommendations);
      }
    } catch (error) {
      console.error(`Failed to parse recommendations for record ${record.id}:`, error);
    }
    
    // Return flattened format with all fields in snake_case
    return {
      id: record.id,
      user_id: record.user_id,
      created_at: record.created_at,
      updated_at: record.updated_at,
      age: record.age,
      pattern: record.pattern,
      cycle_length: record.cycle_length,
      period_duration: record.period_duration,
      flow_heaviness: record.flow_heaviness,
      pain_level: record.pain_level,
      physical_symptoms: physicalSymptoms,
      emotional_symptoms: emotionalSymptoms,
      recommendations: recommendations
    };
  }
}

export default FlattenedAssessment; 