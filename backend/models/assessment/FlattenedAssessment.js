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
          age, pattern, cycle_length, period_duration, flow_heaviness, pain_level, 
          physical_symptoms, emotional_symptoms, recommendations
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
          recommendations: recommendations || []
        };
        
        testAssessments[id] = assessment;
        return assessment;
      }

      // Extract data for flattened format
      const {
        age, pattern, cycle_length, period_duration, flow_heaviness, pain_level, 
        physical_symptoms, emotional_symptoms, recommendations
      } = assessmentData;
      
      // Use new flattened format
      const payload = {
        id,
        user_id: userId,
        created_at: now,
        
        // Flattened fields
        age,
        pattern,
        cycle_length,
        period_duration,
        flow_heaviness,
        pain_level,
        
        // Array fields as JSON strings
        physical_symptoms: physical_symptoms ? JSON.stringify(physical_symptoms) : null,
        emotional_symptoms: emotional_symptoms ? JSON.stringify(emotional_symptoms) : null,
        recommendations: recommendations ? JSON.stringify(recommendations) : null
      };

      // Insert into database
      const inserted = await DbService.create('assessments', payload);
      
      // Transform to API format before returning
      return this._transformDbRecordToApiResponse(inserted);
    } catch (error) {
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
      // Use in-memory store for tests
      if (isTestMode) {
        if (!testAssessments[id]) {
          throw new Error(`Assessment with ID ${id} not found`);
        }

        // Extract data for flattened format
        const {
          age, pattern, cycle_length, period_duration, flow_heaviness, pain_level, 
          physical_symptoms, emotional_symptoms, recommendations
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
          recommendations: recommendations || []
        };

        return testAssessments[id];
      }
      
      // Extract data for flattened format
      const {
        age, pattern, cycle_length, period_duration, flow_heaviness, pain_level, 
        physical_symptoms, emotional_symptoms, recommendations
      } = assessmentData;
      
      // Use flattened format
      const updates = {
        // Flattened fields
        age,
        pattern,
        cycle_length,
        period_duration,
        flow_heaviness,
        pain_level,
        
        // Array fields as JSON strings
        physical_symptoms: physical_symptoms ? JSON.stringify(physical_symptoms) : null,
        emotional_symptoms: emotional_symptoms ? JSON.stringify(emotional_symptoms) : null,
        recommendations: recommendations ? JSON.stringify(recommendations) : null
      };
      
      // Update database
      const updated = await DbService.update('assessments', id, updates);
      
      // Transform to API format before returning
      return this._transformDbRecordToApiResponse(updated);
    } catch (error) {
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
    
    let physical_symptoms = [];
    let emotional_symptoms = [];
    let recommendations = [];
    
    try {
      // Parse JSON stored arrays if they exist
      if (record.physical_symptoms) {
        // Handle case when physical_symptoms is already an array (from test environment)
        if (Array.isArray(record.physical_symptoms)) {
          physical_symptoms = record.physical_symptoms;
        } else {
          physical_symptoms = JSON.parse(record.physical_symptoms);
        }
      }
    } catch (error) {
    }
    
    try {
      if (record.emotional_symptoms) {
        // Handle case when emotional_symptoms is already an array (from test environment)
        if (Array.isArray(record.emotional_symptoms)) {
          emotional_symptoms = record.emotional_symptoms;
        } else {
          emotional_symptoms = JSON.parse(record.emotional_symptoms);
        }
      }
    } catch (error) {
    }
    
    try {
      if (record.recommendations) {
        // Handle case when recommendations is already an array (from test environment)
        if (Array.isArray(record.recommendations)) {
          recommendations = record.recommendations;
        } else {
          recommendations = JSON.parse(record.recommendations);
        }
        
        // Ensure recommendations have title and description
        if (Array.isArray(recommendations) && recommendations.length > 0) {
          // If recommendations are strings, convert to objects with title and description
          if (typeof recommendations[0] === 'string') {
            recommendations = recommendations.map(rec => ({
              title: rec,
              description: ''
            }));
          }
        }
      }
    } catch (error) {
    }
    
    // Ensure physical_symptoms and emotional_symptoms are arrays
    if (!Array.isArray(physical_symptoms)) {
      physical_symptoms = [];
    }
    
    if (!Array.isArray(emotional_symptoms)) {
      emotional_symptoms = [];
    }
    
    // Return flattened format with all fields in snake_case
    return {
      id: record.id,
      user_id: record.user_id,
      created_at: record.created_at,
      age: record.age,
      pattern: record.pattern,
      cycle_length: record.cycle_length,
      period_duration: record.period_duration,
      flow_heaviness: record.flow_heaviness,
      pain_level: record.pain_level,
      physical_symptoms,
      emotional_symptoms,
      recommendations
    };
  }

  /**
   * Check if this class can process the given record format
   * @param {Object} record - Database record
   * @returns {boolean} True if this class can process the record
   */
  static _canProcessRecord(record) {
    // Flattened format has direct fields and NO assessment_data
    const hasDirectFields = record.age || record.pattern || record.cycle_length;
    const isFlattened = !record.assessment_data && hasDirectFields;
    
    return isFlattened;
  }
}

export default FlattenedAssessment; 