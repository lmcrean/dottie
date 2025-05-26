import express from "express";
import { authenticateToken } from '../auth/middleware/index.js';
// TODO: Fix empty import

const router = express.Router();

/**
 * Delete a specific assessment by user ID / assessment ID
 * DELETE /api/assessment/:userId/:assessmentId
 */
router.delete("/:userId/:assessmentId", authenticateToken, deleteAssessment);

export default router; 
