import express from "express";
import { authenticateToken } from "../middleware/index.js";
import { getAssessmentDetail } from "./controller.js";

const router = express.Router();

/**
 * Get detailed view of a specific assessment by its ID
 * GET /api/assessment/:id
 */
router.get("/:assessmentId", authenticateToken, getAssessmentDetail);

export default router; 