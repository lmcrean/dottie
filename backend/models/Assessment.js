import { v4 as uuidv4 } from 'uuid';
import db from '../db/index.js';
import DbService from '../services/dbService.js';


// In-memory store for tests
const testAssessments = {};

// Check if we're in test mode
const isTestMode = process.env.NODE_ENV === 'test' || process.env.TEST_MODE === 'true';

class Assessment {
  /**
   * Find an assessment by ID
   * @param {string} id - Assessment ID
   * @returns {Promise<Object|null>} Assessment object or null if not found
   */
  static async findById(id) {
    try {
      if (isTestMode && testAssessments[id]) {
        return testAssessments[id];
      }
      
      // Get the assessment from database
      const assessment = await DbService.findById('assessments', id);
      
      if (!assessment) return null;
      
      // Transform to API format before returning
      return this._transformDbRecordToApiResponse(assessment);
    } catch (error) {
      console.error('Error finding assessment by ID:', error);
      throw error;
    }
  }


  /**
   * Create a new assessment
   * @param {Object} assessmentData - Assessment data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Created assessment object
   */
  static async create(assessmentData, userId) {
    try {
      const id = uuidv4();
      const now = new Date();

      if (isTestMode) {
        const assessment = {
          id,
          userId,
          assessmentData,
          createdAt: now,
          updatedAt: now
        };
        testAssessments[id] = assessment;
        return assessment;
      }

      // Support both old nested and new flattened format
      let payload;
      
      // If assessment_data is present in the payload, use old format
      if (assessmentData.assessment_data) {
        payload = {
          id,
          user_id: userId,
          assessment_data: JSON.stringify(assessmentData.assessment_data),
          created_at: now,
          updated_at: now
        };
      } else {
        // Use new flattened format
        const {
          age, pattern, cycleLength, periodDuration, flowHeaviness, painLevel, symptoms, recommendations
        } = assessmentData;
        
        payload = {
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
      }

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
   * List all assessments for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Array of assessment objects
   */
  static async listByUser(userId) {
    try {
      // Use in-memory store for tests
      if (isTestMode) {
        return Object.values(testAssessments)
          .filter(assessment => assessment.userId === userId);
      }
      
      // Get all assessments for user
      const assessments = await DbService.findBy('assessments', 'user_id', userId);
      
      // Transform each record to API format
      return assessments.map(assessment => this._transformDbRecordToApiResponse(assessment));
    } catch (error) {
      console.error('Error listing assessments by user:', error);
      throw error;
    }
  }

  /**
   * Update an assessment
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

        testAssessments[id] = {
          ...testAssessments[id],
          assessmentData,
          updatedAt: now
        };

        return testAssessments[id];
      }
      
      // Support both old nested and new flattened format
      let updates;
      
      // If assessment_data is present in the payload, use old format
      if (assessmentData.assessment_data) {
        updates = {
          assessment_data: JSON.stringify(assessmentData.assessment_data),
          updated_at: now
        };
      } else {
        // Use new flattened format
        const {
          age, pattern, cycleLength, periodDuration, flowHeaviness, painLevel, symptoms, recommendations
        } = assessmentData;
        
        updates = {
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
      }
      
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
   * Delete an assessment
   * @param {string} id - Assessment ID
   * @returns {Promise<boolean>} True if successful
   */
  static async delete(id) {
    try {
      // Use in-memory store for tests
      if (isTestMode) {
        if (!testAssessments[id]) {
          throw new Error(`Assessment with ID ${id} not found`);
        }

        delete testAssessments[id];
        return true;
      }
      
      return await DbService.delete('assessments', id);
    } catch (error) {
      console.error('Error deleting assessment:', error);
      throw error;
    }
  }

  /**
 * Validate if user is the owner of assessment
 * @param {string} assessmentId - Assessment ID
 * @param {string} userId - User ID
 * @returns {Promise<boolean>} True if user is owner, false otherwise
 */
static async validateOwnership(assessmentId, userId) {
  try {
    // Test mode check
    if (isTestMode && testAssessments[assessmentId]) {
      return testAssessments[assessmentId].userId === userId;
    }
    
    // Database check using DbService
    const assessment = await DbService.findBy('assessments', 'id', assessmentId);
    
    // If assessment exists, check if user is the owner
    if (assessment && assessment.length > 0) {
      return assessment[0].user_id === userId;
    }
    
    return false;
  } catch (error) {
    console.error('Error validating ownership:', error);
    throw error;
  }
}

/**
 * Transform database record to API response format
 * Handles both nested and flattened formats
 * @param {Object} record - Database record
 * @returns {Object} API response object
 * @private
 */
static _transformDbRecordToApiResponse(record) {
  if (!record) return null;
  
  // Check if we're using the legacy nested format
  if (record.assessment_data) {
    let assessmentData;
    
    try {
      // Parse JSON if stored as string
      assessmentData = typeof record.assessment_data === 'string'
        ? JSON.parse(record.assessment_data)
        : record.assessment_data;
    } catch (error) {
      console.error(`Failed to parse assessment_data for record ${record.id}:`, error);
      assessmentData = {};
    }
    
    return {
      id: record.id,
      userId: record.user_id,
      assessmentData,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    };
  }
  
  // Handle new flattened format
  let physicalSymptoms = [];
  let emotionalSymptoms = [];
  let recommendations = [];
  
  try {
    // Parse JSON stored arrays if they exist
    if (record.physical_symptoms) {
      try {
        physicalSymptoms = JSON.parse(record.physical_symptoms);
      } catch (error) {
        console.error(`Failed to parse physical_symptoms for record ${record.id}:`, error);
      }
    }
  } catch (error) {
    console.error(`Failed to process physical_symptoms for record ${record.id}:`, error);
  }
  
  try {
    if (record.emotional_symptoms) {
      try {
        emotionalSymptoms = JSON.parse(record.emotional_symptoms);
      } catch (error) {
        console.error(`Failed to parse emotional_symptoms for record ${record.id}:`, error);
      }
    }
  } catch (error) {
    console.error(`Failed to process emotional_symptoms for record ${record.id}:`, error);
  }
  
  try {
    if (record.recommendations) {
      try {
        recommendations = JSON.parse(record.recommendations);
      } catch (error) {
        console.error(`Failed to parse recommendations for record ${record.id}:`, error);
      }
    }
  } catch (error) {
    console.error(`Failed to process recommendations for record ${record.id}:`, error);
  }
  
  // Construct nested assessment data from flattened fields
  const assessmentData = {
    age: record.age,
    pattern: record.pattern,
    cycleLength: record.cycle_length,
    periodDuration: record.period_duration,
    flowHeaviness: record.flow_heaviness,
    painLevel: record.pain_level,
    symptoms: {
      physical: physicalSymptoms,
      emotional: emotionalSymptoms
    },
    recommendations
  };
  
  return {
    id: record.id,
    userId: record.user_id,
    assessmentData,
    createdAt: record.created_at,
    updatedAt: record.updated_at
  };
}

}

export default Assessment; 