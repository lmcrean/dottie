import express from "express";
import { authenticateToken } from '../auth/middleware/index.js';
// TODO: Fix empty import

const router = express.Router();

/**
 * Get list of all assessments for the authenticated user
 * GET /api/assessment/list
 */
router.get("/list", authenticateToken, listAssessments);

export default router; 
