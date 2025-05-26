import express from "express";
import { authenticateToken } from './controller.js';
// TODO: Fix empty import

const router = express.Router();

/**
 * Send assessment results from frontend context, generates a new assessmentId
 * POST /api/assessment/send
 */
router.post("/send", authenticateToken, createAssessment);

export default router; 
