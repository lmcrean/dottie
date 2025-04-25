import { AssessmentBase, testAssessments, isTestMode } from './AssessmentBase.js';
import { v4 as uuidv4 } from 'uuid';
import DbService from '../../services/dbService.js';

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
      console.error('Error creating assessment:', error);
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
      console.error('Error updating assessment:', error);
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
}

export default LegacyAssessment; 