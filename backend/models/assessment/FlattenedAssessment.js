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

      // Extract data for flattened format
      const {
        age, pattern, cycle_length, period_duration, flow_heaviness, pain_level, 
        physical_symptoms, emotional_symptoms, other_symptoms, recommendations
      } = assessmentData;
      
      // Ensure user_id is set
      // const dataToSave = { ...assessmentData, user_id: userId }; // This line was part of a previous attempt, let's use direct variables

      // Log physical_symptoms before stringify


      // Handle symptoms arrays: store as JSON strings
      const physicalSymptomsString = JSON.stringify(physical_symptoms || []);
      const emotionalSymptomsString = JSON.stringify(emotional_symptoms || []);

      // Handle other_symptoms: wrap string in an array and store as JSON string, or store null
      const otherSymptomsString = other_symptoms && typeof other_symptoms === 'string' && other_symptoms.trim() !== '' ? JSON.stringify([other_symptoms.trim()]) : null;

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
        other_symptoms: otherSymptomsString,
        
        // Array fields as JSON strings
        physical_symptoms: physicalSymptomsString,
        emotional_symptoms: emotionalSymptomsString,
        recommendations: recommendations ? JSON.stringify(recommendations) : null
      };

      // Insert into database
      const inserted = await DbService.create('assessments', payload);
      
      // Transform to API format before returning
      const result = this._transformDbRecordToApiResponse(inserted);
      
      // Remove updated_at field if it exists
      if (result.updated_at) {
        delete result.updated_at;
      }
      if (result.updatedAt) {
        delete result.updatedAt;
      }
      
      return result;
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
      
      // Extract data for flattened format
      const {
        age, pattern, cycle_length, period_duration, flow_heaviness, pain_level, 
        physical_symptoms, emotional_symptoms, other_symptoms, recommendations
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
        other_symptoms,
        
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
    let other_symptoms_array = []; // Initialize as empty array
    
    try {
      // Parse JSON stored arrays if they exist
      if (record.physical_symptoms) {
        // Handle case when physical_symptoms is already an array (from test environment)
        if (Array.isArray(record.physical_symptoms)) {
          physical_symptoms = record.physical_symptoms;

        } else {
          physical_symptoms = JSON.parse(record.physical_symptoms);

          // Log physical_symptoms after parse

        }
      }
    } catch (error) {
      console.error(`Failed to parse physical_symptoms for assessment ${record.id}:`, error);
      console.error(`Raw value was: ${record.physical_symptoms}`);
      physical_symptoms = [];
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
      console.error(`Failed to parse emotional_symptoms for assessment ${record.id}:`, error);
      console.error(`Raw value was: ${record.emotional_symptoms}`);
      emotional_symptoms = [];
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
      console.error(`Failed to parse recommendations for assessment ${record.id}:`, error);
      console.error(`Raw value was: ${record.recommendations}`);
      recommendations = [];
    }
    
    // Ensure physical_symptoms and emotional_symptoms are arrays
    if (!Array.isArray(physical_symptoms)) {
      console.warn(`physical_symptoms is not an array after parsing for assessment ${record.id}, setting to empty array`);
      physical_symptoms = [];
    }
    
    if (!Array.isArray(emotional_symptoms)) {
      console.warn(`emotional_symptoms is not an array after parsing for assessment ${record.id}, setting to empty array`);
      emotional_symptoms = [];
    }
    
    // Handle other_symptoms: expect it to be a JSON string array or a plain string
    if (record.other_symptoms) {
      try {
        // Attempt to parse as JSON array first
        const parsed_other = JSON.parse(record.other_symptoms);
        if (Array.isArray(parsed_other)) {
          other_symptoms_array = parsed_other.filter(s => typeof s === 'string'); // Ensure all elements are strings

        } else if (typeof parsed_other === 'string' && parsed_other.trim() !== '') {
          // If parsing resulted in a single string (should not happen with current create logic but good for safety)
          other_symptoms_array = [parsed_other.trim()];

        }
      } catch (e) {
        // If JSON.parse fails, assume it's a plain string
        if (typeof record.other_symptoms === 'string' && record.other_symptoms.trim() !== '') {
          other_symptoms_array = [record.other_symptoms.trim()];

        } else {

        }
      }
    } else {

    }
    
    // Return flattened format with all fields in snake_case
    const result = {
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
      other_symptoms: other_symptoms_array, // Use the processed array
      recommendations
    };
    
    // Remove updated_at field if it exists
    if (record.updated_at) {
      delete result.updated_at;
    }
    
    return result;
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

  static async findById(id) {
    try {
      if (isTestMode && testAssessments[id]) {

        return testAssessments[id];
      }
      

      // Get the assessment from database
      const assessment = await DbService.findById('assessments', id);
      
      if (!assessment) {

        return null;
      }
      
      // Check if this class can handle this format
      if (!this._canProcessRecord(assessment)) {

        return null;
      }
      
      // Transform to API format before returning
      const transformedAssessment = this._transformDbRecordToApiResponse(assessment);
      
      return transformedAssessment;
    } catch (error) {
      console.error(`Error finding assessment by ID ${id}:`, error);
      throw error;
    }
  }
}

export default FlattenedAssessment; 