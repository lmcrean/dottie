import express from "express";
import { authenticateToken } from '../middleware/index.ts';
import { deleteAssessment } from './controller.ts';

const router = express.Router();

/**
 * Delete a specific assessment by user ID / assessment ID
 * DELETE /api/assessment/:userId/:assessmentId
 */
router.delete("/:userId/:assessmentId", authenticateToken, deleteAssessment);

export default router; 
