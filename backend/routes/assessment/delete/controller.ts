import { Response } from 'express';
import Assessment from '../../../models/assessment/Assessment.js';
import { AuthenticatedRequest } from '../../types.js';

/**
 * Delete a specific assessment by user ID / assessment ID
 */
export const deleteAssessment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const assessmentId = req.params.assessmentId;
    // Get userId from JWT token only to prevent unauthorized access
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized: User ID is required' });
      return;
    }

    if (!assessmentId) {
      res.status(400).json({ error: 'Assessment ID is required' });
      return;
    }

    // Validate ownership
    const isOwner = await Assessment.validateOwnership(assessmentId, userId);
    if (!isOwner) {
      res.status(403).json({ error: 'Unauthorized: You do not own this assessment' });
      return;
    }

    // Delete the assessment using the model
    const deleteResult = await Assessment.delete(assessmentId);
    if (!deleteResult) {
      res.status(404).json({ error: 'Assessment not found' });
      return;
    }

    res.status(200).json({ message: 'Assessment deleted successfully' });
  } catch (error) {
    console.error('Error deleting assessment:', error);
    res.status(500).json({ error: 'Failed to delete assessment' });
  }
};
