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
        // Fix for test mode: correctly handle nested assessment_data structure
        let formattedData = assessmentData.assessment_data;
      
        // If assessment_data is not an object with nested assessment_data structure, create it
        if (!formattedData || typeof formattedData !== 'object' || !formattedData.assessment_data) {
          formattedData = {
            createdAt: now.toISOString(),
            assessment_data: assessmentData.assessment_data || assessmentData
          };
        }
        
        const assessment = {
          id,
          userId,
          assessmentData: formattedData,
          createdAt: now,
          updatedAt: now
        };
        testAssessments[id] = assessment;
        return assessment;
      }

      // Prepare the assessment data for storage
      // Ensure we have the right structure for the new JSON format
      let formattedData = assessmentData.assessment_data;
      
      // If assessment_data is not an object with nested assessment_data structure, create it
      if (!formattedData || typeof formattedData !== 'object' || !formattedData.assessment_data) {
        formattedData = {
          createdAt: now.toISOString(),
          assessment_data: assessmentData.assessment_data || assessmentData
        };
      }

      const payload = {
        id,
        user_id: userId,
        assessment_data: formattedData,
        created_at: now,
        updated_at: now
      };
      
      const inserted = await DbService.createWithJson(
        'assessments',
        payload,
        ['assessment_data']
      );
      
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
    console.log('Assessment.listByUser called for userId:', userId);
    try {
      // Use in-memory store for tests
      if (isTestMode) {
        console.log('Using in-memory test assessments store');
        return Object.values(testAssessments)
          .filter(assessment => assessment.userId === userId);
      }
      
      console.log('Fetching assessments from database for userId:', userId);
      const assessments = await DbService.findByFieldWithJson(
        'assessments',
        'user_id',
        userId,
        ['assessment_data'],
        'created_at'
      );
      
      console.log('Raw DB assessments count:', assessments.length);
      if (assessments.length > 0) {
        console.log('First assessment raw structure:', {
          keys: Object.keys(assessments[0]),
          hasAssessmentData: !!assessments[0].assessment_data,
          assessmentDataType: typeof assessments[0].assessment_data
        });
      }
      
      // Format the response to ensure consistent structure
      const formattedAssessments = assessments.map(assessment => {
        console.log(`Formatting assessment ${assessment.id}:`, {
          hasAssessmentData: !!assessment.assessment_data
        });
        
        return {
          id: assessment.id,
          userId: assessment.user_id,
          assessmentData: assessment.assessment_data,
          createdAt: assessment.created_at,
          updatedAt: assessment.updated_at
        };
      });
      
      console.log('Formatted assessments count:', formattedAssessments.length);
      if (formattedAssessments.length > 0) {
        console.log('First formatted assessment structure:', {
          keys: Object.keys(formattedAssessments[0]),
          hasAssessmentData: !!formattedAssessments[0].assessmentData,
          assessmentDataType: typeof formattedAssessments[0].assessmentData,
          assessmentDataKeys: formattedAssessments[0].assessmentData ? Object.keys(formattedAssessments[0].assessmentData) : 'none'
        });
      }
      
      return formattedAssessments;
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

        const existingAssessment = testAssessments[id];
        let updatedData = existingAssessment.assessmentData;
        
        // Handle nested structure in test mode
        if (updatedData && updatedData.assessment_data) {
          // Update the inner assessment_data
          updatedData.assessment_data = {
            ...updatedData.assessment_data,
            ...(assessmentData.assessment_data || assessmentData)
          };
        } else {
          // Legacy format or simple structure, just update directly
          updatedData = assessmentData;
        }

        testAssessments[id] = {
          ...existingAssessment,
          assessmentData: updatedData,
          updatedAt: now
        };

        // Return in the same format as the DB response would be
        return {
          id,
          assessment_data: updatedData
        };
      }
      
      // Get the existing assessment to preserve structure
      const existingAssessment = await this.findById(id);
      if (!existingAssessment) {
        throw new Error(`Assessment with ID ${id} not found`);
      }
      
      // Prepare updated data maintaining the structure
      let updatedData = existingAssessment.assessmentData;
      
      // If we have the nested structure
      if (updatedData && updatedData.assessment_data) {
        // Update the inner assessment_data
        updatedData.assessment_data = {
          ...updatedData.assessment_data,
          ...(assessmentData.assessment_data || assessmentData)
        };
      } else {
        // Legacy format or simple structure, just update directly
        updatedData = assessmentData;
      }
      
      return await DbService.updateWithJson(
        'assessments',
        id,
        { 
          assessment_data: updatedData, 
          updated_at: now 
        },
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
   * @returns {Promise<boolean>} Success indicator
   */
  static async delete(id) {
    try {
      if (isTestMode) {
        if (testAssessments[id]) {
          delete testAssessments[id];
          return true;
        }
        return false;
      }

      await db('assessments')
        .where('id', id)
        .delete();

      return true;
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

}

export default Assessment; 