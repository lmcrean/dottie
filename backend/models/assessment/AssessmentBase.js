import { v4 as uuidv4 } from 'uuid';
import db from '../../db/index.js';
import DbService from '../../services/dbService.js';

// In-memory store for tests
const testAssessments = {};

// Check if we're in test mode
const isTestMode = process.env.NODE_ENV === 'test' || process.env.TEST_MODE === 'true';

class AssessmentBase {
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
      
      // Check if this class can handle this format
      // This should be overridden by subclasses
      if (!this._canProcessRecord(assessment)) {
        return null;
      }
      
      // Transform to API format before returning
      return this._transformDbRecordToApiResponse(assessment);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if this class can process the given record format
   * Must be implemented by subclasses
   * @param {Object} record - Database record
   * @returns {boolean} True if this class can process the record
   */
  static _canProcessRecord(record) {
    // Base implementation always returns false
    // Subclasses should override with specific format checks
    return false;
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
        const testUserAssessments = Object.values(testAssessments)
          .filter(assessment => assessment.user_id === userId);

        return testUserAssessments;
      }
      
      // Get all assessments for user
      const rawAssessments = await DbService.findBy('assessments', 'user_id', userId);

      
      // Dynamically import models once
      const LegacyAssessment = (await import('./LegacyAssessment.js')).default;
      const FlattenedAssessment = (await import('./FlattenedAssessment.js')).default;

      const transformedAssessments = rawAssessments.map(assessment => {
        // We need to decide which _transformDbRecordToApiResponse to call.
        if (assessment.assessment_data) { // If legacy
          return LegacyAssessment._transformDbRecordToApiResponse(assessment);
        } else { // If flattened
          return FlattenedAssessment._transformDbRecordToApiResponse(assessment);
        }
      });

      return transformedAssessments;
    } catch (error) {
      console.error(`[AssessmentBase.listByUser] Error listing assessments for userId ${userId}:`, error);
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
        return testAssessments[assessmentId].user_id === userId;
      }
      
      // Database check using direct query for reliability
      const assessment = await db('assessments')
        .where('id', assessmentId)
        .where('user_id', userId)
        .first();
      
      // If assessment exists and user is the owner, return true
      return !!assessment;
    } catch (error) {
      console.error('Error validating ownership:', error);
      return false;
    }
  }
}

export { AssessmentBase, testAssessments, isTestMode }; 