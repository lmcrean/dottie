import { AssessmentBase } from '../assessment-base/AssessmentBase.ts';
import { v4 as uuidv4 } from 'uuid';
import DbService from '../../../services/dbService.ts';

class LegacyAssessment extends AssessmentBase {
  /**
   * Create a new assessment with nested format
   * @param {Object} assessmentData - Assessment data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Created assessment object
   */
  static async create(assessmentData, userId) {
    try {
      const id = uuidv4();
      const now = new Date();

      // Use legacy nested format
      const payload = {
        id,
        user_id: userId,
        assessment_data: JSON.stringify(assessmentData.assessment_data || assessmentData),
        created_at: now,
        updated_at: now
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
   * Update an assessment using nested format
   * @param {string} id - Assessment ID
   * @param {Object} assessmentData - Updated assessment data
   * @returns {Promise<Object>} Updated assessment object
   */
  static async update(id, assessmentData) {
    try {
      const now = new Date();
      
      // Use legacy nested format
      const updates = {
        assessment_data: JSON.stringify(assessmentData.assessment_data || assessmentData),
        updated_at: now
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
   * Transform database record to API response format for nested schema
   * @param {Object} record - Database record
   * @returns {Object} API response object
   */
  static _transformDbRecordToApiResponse(record) {
    if (!record) return null;
    
    let assessmentData = {};
    
    try {
      // Parse JSON if stored as string
      if (record.assessment_data) {
        assessmentData = typeof record.assessment_data === 'string'
          ? JSON.parse(record.assessment_data)
          : record.assessment_data;
      }
    } catch (error) {
      assessmentData = {};
    }
    
    // Convert to flattened format with snake_case
    return {
      id: record.id,
      user_id: record.user_id,
      created_at: record.created_at,
      updated_at: record.updated_at,
      age: assessmentData.age || record.age,
      pattern: assessmentData.pattern || record.pattern,
      cycle_length: assessmentData.cycleLength || record.cycle_length,
      period_duration: assessmentData.periodDuration || record.period_duration,
      flow_heaviness: assessmentData.flowHeaviness || record.flow_heaviness,
      pain_level: assessmentData.painLevel || record.pain_level,
      physical_symptoms: (assessmentData.symptoms?.physical || []),
      emotional_symptoms: (assessmentData.symptoms?.emotional || []),
      recommendations: (assessmentData.recommendations || [])
    };
  }

  /**
   * Check if this class can process the given record format
   * @param {Object} record - Database record
   * @returns {boolean} True if this class can process the record
   */
  static _canProcessRecord(record) {
    // Legacy format must have assessment_data field
    const isLegacy = !!record.assessment_data;
    
    return isLegacy;
  }
}

export default LegacyAssessment; 
