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
      return await DbService.findByIdWithJson('assessments', id, ['assessment_data']);
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

      const payload = {
        id,
        user_id: userId,
        assessment_data: assessmentData.assessment_data,
        created_at: now,
        updated_at: now
      };
      

      const inserted = await DbService.createWithJson(
        'assessments',
        payload,
        ['assessment_data']
      );

      // console.log('Inserted assessment:', inserted);





      return {
        id: inserted.id,
        userId: inserted.user_id,
        assessmentData: inserted.assessment_data,
        createdAt: inserted.created_at,
        updatedAt: inserted.updated_at
      };
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
      return await DbService.findByFieldWithJson(
        'assessments',
        'user_id',
        userId,
        ['assessment_data'],
        'created_at'
      );
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
      return await DbService.updateWithJson(
        'assessments',
        id,
        { assessment_data: assessmentData, updated_at: new Date() },
        ['assessment_data']
      );
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
}

export default Assessment; 