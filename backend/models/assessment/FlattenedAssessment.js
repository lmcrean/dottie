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
      console.log('[FlattenedAssessment.create] physical_symptoms before stringify:', physical_symptoms);

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

      console.log(`Creating assessment with ID ${id}, physical symptoms:`, 
        payload.physical_symptoms ? JSON.stringify(payload.physical_symptoms) : 'null');
      console.log(`Creating assessment with ID ${id}, emotional symptoms:`, 
        payload.emotional_symptoms ? JSON.stringify(payload.emotional_symptoms) : 'null');

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
    
    console.log(`Transforming record to API response:`, {
      id: record.id,
      user_id: record.user_id,
      physical_symptoms_type: record.physical_symptoms ? typeof record.physical_symptoms : 'null',
      emotional_symptoms_type: record.emotional_symptoms ? typeof record.emotional_symptoms : 'null',
      other_symptoms_raw: record.other_symptoms ? record.other_symptoms : 'null' // Log raw other_symptoms
    });
    
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
          console.log(`Physical symptoms already an array with ${physical_symptoms.length} items`);
        } else {
          physical_symptoms = JSON.parse(record.physical_symptoms);
          console.log(`Successfully parsed physical_symptoms for assessment ${record.id}:`, physical_symptoms);
          // Log physical_symptoms after parse
          console.log('[FlattenedAssessment._transformDbRecordToApiResponse] physical_symptoms after parse:', physical_symptoms);
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
          console.log(`Emotional symptoms already an array with ${emotional_symptoms.length} items`);
        } else {
          emotional_symptoms = JSON.parse(record.emotional_symptoms);
          console.log(`Successfully parsed emotional_symptoms for assessment ${record.id}:`, emotional_symptoms);
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
          console.log(`Recommendations already an array with ${recommendations.length} items`);
        } else {
          recommendations = JSON.parse(record.recommendations);
          console.log(`Successfully parsed recommendations for assessment ${record.id}`);
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
          console.log(`Successfully parsed other_symptoms as array for assessment ${record.id}:`, other_symptoms_array);
        } else if (typeof parsed_other === 'string' && parsed_other.trim() !== '') {
          // If parsing resulted in a single string (should not happen with current create logic but good for safety)
          other_symptoms_array = [parsed_other.trim()];
           console.log(`Parsed other_symptoms as single string and wrapped in array for assessment ${record.id}:`, other_symptoms_array);
        }
      } catch (e) {
        // If JSON.parse fails, assume it's a plain string
        if (typeof record.other_symptoms === 'string' && record.other_symptoms.trim() !== '') {
          other_symptoms_array = [record.other_symptoms.trim()];
          console.log(`Treated other_symptoms as plain string and wrapped in array for assessment ${record.id}:`, other_symptoms_array);
        } else {
          console.log(`other_symptoms for assessment ${record.id} is not a valid JSON array or non-empty string: "${record.other_symptoms}", setting to empty array.`);
        }
      }
    } else {
      console.log(`other_symptoms is null or empty for assessment ${record.id}, setting to empty array.`);
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
    
    console.log(`Final transformed assessment:`, {
      id: result.id,
      pattern: result.pattern,
      physical_symptoms: result.physical_symptoms,
      emotional_symptoms: result.emotional_symptoms,
      other_symptoms: result.other_symptoms
    });
    
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
        console.log(`[TEST MODE] Found assessment in test store:`, id);
        return testAssessments[id];
      }
      
      console.log(`Finding assessment by ID: ${id}`);
      // Get the assessment from database
      const assessment = await DbService.findById('assessments', id);
      
      if (!assessment) {
        console.log(`Assessment not found: ${id}`);
        return null;
      }
      
      console.log(`Raw assessment data from database:`, {
        id: assessment.id,
        user_id: assessment.user_id,
        physical_symptoms: assessment.physical_symptoms ? 
          (typeof assessment.physical_symptoms === 'string' ? 'JSON string' : typeof assessment.physical_symptoms) : 'null',
        emotional_symptoms: assessment.emotional_symptoms ?
          (typeof assessment.emotional_symptoms === 'string' ? 'JSON string' : typeof assessment.emotional_symptoms) : 'null',
      });
      
      // Check if this class can handle this format
      if (!this._canProcessRecord(assessment)) {
        console.log(`Assessment format not supported by ${this.name}`);
        return null;
      }
      
      // Transform to API format before returning
      const transformedAssessment = this._transformDbRecordToApiResponse(assessment);
      console.log(`Transformed assessment data:`, {
        id: transformedAssessment.id,
        user_id: transformedAssessment.user_id,
        physical_symptoms: Array.isArray(transformedAssessment.physical_symptoms) 
          ? `Array with ${transformedAssessment.physical_symptoms.length} items` 
          : typeof transformedAssessment.physical_symptoms,
        emotional_symptoms: Array.isArray(transformedAssessment.emotional_symptoms)
          ? `Array with ${transformedAssessment.emotional_symptoms.length} items`
          : typeof transformedAssessment.emotional_symptoms,
      });
      
      return transformedAssessment;
    } catch (error) {
      console.error(`Error finding assessment by ID ${id}:`, error);
      throw error;
    }
  }
}

export default FlattenedAssessment; 