import express from "express";
import { authenticateToken } from "../middleware/index.js";
import { createAssessment } from "./controller.js";

const router = express.Router();

/**
 * Send assessment results from frontend context, generates a new assessmentId
 * POST /api/assessment/send
 */
router.post("/send", authenticateToken, createAssessment);

export default router; 