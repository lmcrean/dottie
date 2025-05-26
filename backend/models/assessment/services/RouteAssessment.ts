// TODO: Fix empty import
// TODO: Fix empty import

class RouteAssessment {
  /**
   * Find an assessment by ID, routing to appropriate handler
   * @param {string} id - Assessment ID
   * @returns {Promise<Object|null>} Assessment object or null if not found
   */
  static async findById(id) {
    try {
      // Get the raw record to determine format
      const rawRecord = await DbService.findById('assessments', id);
      
      if (!rawRecord) {
        return null;
      }
      
      // Route to appropriate transformer
      if (DetectAssessmentFormat.isLegacyFormat(rawRecord)) {
        const LegacyAssessment = (await import('../archive/LegacyAssessment.js')).default;
        return LegacyAssessment._transformDbRecordToApiResponse(rawRecord);
      } else if (DetectAssessmentFormat.isCurrentFormat(rawRecord)) {
        const TransformDbToApi = (await import('../transformers/TransformDbToApi.js')).default;
        return TransformDbToApi.transform(rawRecord);
      }
      
      return null;
    } catch (error) {
      console.error(`Error finding assessment by ID ${id}:`, error);
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
      const rawAssessments = await DbService.findBy('assessments', 'user_id', userId);
      
      // Transform each assessment based on its format
      const transformedAssessments = await Promise.all(
        rawAssessments.map(async (assessment) => {
          if (DetectAssessmentFormat.isLegacyFormat(assessment)) {
            const LegacyAssessment = (await import('../archive/LegacyAssessment.js')).default;
            return LegacyAssessment._transformDbRecordToApiResponse(assessment);
          } else if (DetectAssessmentFormat.isCurrentFormat(assessment)) {
            const TransformDbToApi = (await import('../transformers/TransformDbToApi.js')).default;
            return TransformDbToApi.transform(assessment);
          }
          return null;
        })
      );

      return transformedAssessments.filter(Boolean);
    } catch (error) {
      console.error(`Error listing assessments for userId ${userId}:`, error);
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
      return await DbService.delete('assessments', id);
    } catch (error) {
      console.error(`Error deleting assessment ${id}:`, error);
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
      const db = (await import('../../../db/index.js')).default;
      const assessment = await db('assessments')
        .where('id', assessmentId)
        .where('user_id', userId)
        .first();
      
      return !!assessment;
    } catch (error) {
      console.error('Error validating ownership:', error);
      return false;
    }
  }

  /**
   * Create assessment using appropriate format handler
   * @param {Object} assessmentData - Assessment data
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Created assessment object
   */
  static async create(assessmentData, userId) {
    const format = DetectAssessmentFormat.detectDataFormat(assessmentData);
    
    if (format === 'legacy') {
      const LegacyAssessment = (await import('../archive/LegacyAssessment.js')).default;
      return await LegacyAssessment.create(assessmentData, userId);
    } else {
      const CreateAssessment = (await import('./CreateAssessment.js')).default;
      return await CreateAssessment.execute(assessmentData, userId);
    }
  }

  /**
   * Update assessment using appropriate format handler
   * @param {string} id - Assessment ID
   * @param {Object} assessmentData - Updated assessment data
   * @returns {Promise<Object>} Updated assessment object
   */
  static async update(id, assessmentData) {
    const format = DetectAssessmentFormat.detectDataFormat(assessmentData);
    
    if (format === 'legacy') {
      const LegacyAssessment = (await import('../archive/LegacyAssessment.js')).default;
      return await LegacyAssessment.update(id, assessmentData);
    } else {
      const UpdateAssessment = (await import('./UpdateAssessment.js')).default;
      return await UpdateAssessment.execute(id, assessmentData);
    }
  }
}

export default RouteAssessment; 
