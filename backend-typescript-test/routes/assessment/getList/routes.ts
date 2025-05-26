import express from "express";
import { authenticateToken } from "../middleware/index.js";
import { listAssessments } from "./controller.js";

const router = express.Router();

/**
 * Get list of all assessments for the authenticated user
 * GET /api/assessment/list
 */
router.get("/list", authenticateToken, listAssessments);

export default router; 