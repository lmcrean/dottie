import express from "express";
import { authenticateToken } from '';
import { getAssessmentDetail } from '';

const router = express.Router();

/**
 * Get detailed view of a specific assessment by its ID
 * GET /api/assessment/:id
 */
router.get("/:assessmentId", authenticateToken, getAssessmentDetail);

export default router; 
