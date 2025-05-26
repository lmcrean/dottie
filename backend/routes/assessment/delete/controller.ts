// TODO: Fix empty import
import db from '../../../../db/index.js';
// TODO: Fix empty import


/**
 * Delete a specific assessment by user ID / assessment ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteAssessment = async (req, res) => {
  try {
    const assessmentId = req.params.assessmentId;
    // Get userId from JWT token only to prevent unauthorized access
    const userId = req.user?.userId

    const isOwner = await Assessment.validateOwnership(assessmentId, userId);
    if (!isOwner) {
      return res.status(403).json({ error: 'Unauthorized: You do not own this assessment' });
    }
    
    // For test IDs, try to delete from the database // ! To be removed
    if (assessmentId.startsWith('test-')) {
      try {
        // Check if assessment exists and belongs to the user
        const existingAssessment = await db('assessments')
          .where({
            'id': assessmentId,
            'user_id': userId
          })
          .first();
        
        if (!existingAssessment) {
          return res.status(404).json({ error: 'Assessment not found' });
        }
        
        // Delete associated symptoms first (foreign key constraint)
        await db('symptoms').where('assessment_id', assessmentId).del();
        
        // Delete the assessment
        await db('assessments').where('id', assessmentId).del();
        
        return res.status(200).json({ message: 'Assessment deleted successfully' });
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue to in-memory deletion if database fails
      }
    }
    
    const deleteAssessment = await Assessment.delete(assessmentId);
    if (!deleteAssessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.status(200).json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({ error: 'Failed to delete assessment' });
  }
}; 
