import express from "express";
import { authenticateToken } from '../middleware/index.ts';
import { listAssessments } from './controller.ts';

const router = express.Router();

/**
 * Get list of all assessments for the authenticated user
 * GET /api/assessment/list
 */
router.get("/list", authenticateToken, listAssessments);

export default router; 
