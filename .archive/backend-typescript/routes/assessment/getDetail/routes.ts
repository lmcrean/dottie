import express from "express";
import { authenticateToken } from './controller.js';
// TODO: Fix empty import

const router = express.Router();

/**
 * Get detailed view of a specific assessment by its ID
 * GET /api/assessment/:id
 */
router.get("/:assessmentId", authenticateToken, getAssessmentDetail);

export default router; 
