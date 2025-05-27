import Assessment from '../../../models/assessment/Assessment.js';

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

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: User ID is required' });
    }

    if (!assessmentId) {
      return res.status(400).json({ error: 'Assessment ID is required' });
    }

    // Validate ownership
    const isOwner = await Assessment.validateOwnership(assessmentId, userId);
    if (!isOwner) {
      return res.status(403).json({ error: 'Unauthorized: You do not own this assessment' });
    }
    
    // Delete the assessment using the model
    const deleteResult = await Assessment.delete(assessmentId);
    if (!deleteResult) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    
    res.status(200).json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({ error: 'Failed to delete assessment' });
  }
}; 