import express from "express";
import { authenticateToken } from '../middleware/index.ts';
import { getAssessmentDetail } from './controller.ts';

const router = express.Router();

/**
 * Get detailed view of a specific assessment by its ID
 * GET /api/assessment/:id
 */
router.get("/:assessmentId", authenticateToken, getAssessmentDetail);

export default router; 
