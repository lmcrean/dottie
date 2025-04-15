import { assessments } from "../store/index.js";
import db from "../../../db/index.js";
import Assessment from '../../../models/Assessment.js';


/**
 * Delete a specific assessment by user ID / assessment ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteAssessment = async (req, res) => {
  try {
    const { userId, assessmentId } = req.params;
    
    // For test IDs, try to delete from the database
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
    
  
    // Delete associated symptoms from in-memory store
    // Find and delete from in-memory store
    // const assessmentIndex = assessments.findIndex(a => 
    //   a.id === assessmentId && a.userId === userId
    // );
    // if (assessmentIndex === -1) {
    //   return res.status(404).json({ error: 'Assessment not found' });
    // }
    // // Remove the assessment
    // assessments.splice(assessmentIndex, 1);



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