import { db } from "../../../db/index.js";
import { v4 as uuidv4 } from "uuid";
import { assessments } from "../store/index.js";
import { validateAssessmentData } from "../validators/index.js";
import Assessment from '../../../models/Assessment.js';

/**
 * Create a new assessment for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createAssessment = async (req, res) => {
  try {
    // Get userId from the authenticated user
    const userId = req.user.userId;
    
    console.log("Received request body:", JSON.stringify(req.body, null, 2));

    // Ensure we have some form of assessment data
    if (!req.body || (!req.body.assessmentData && !req.body.assessmentData)) {
      console.log("Request missing assessment data", req.body);
      return res.status(400).json({ error: 'Assessment data is required' });
    }

    // Prepare the data structure with consistent camelCase for validation
    const dataToValidate = {
      ...req.body,
      // We'll attach the userId from authentication 
      // (not expecting it to be in the request body)
      userId: userId
    };

    // Validate the assessment data
    const validationResult = validateAssessmentData(dataToValidate);

    if (!validationResult.isValid) {
      console.log("Validation failed:", JSON.stringify(validationResult, null, 2));
      return res.status(400).json({ error: validationResult.errors });
    }

    // Create the assessment in the database
    try {
      const newAssessment = await Assessment.create(dataToValidate, userId);
      console.log("Assessment created successfully:", newAssessment.id);
      return res.status(201).json(newAssessment);
    } catch (error) {
      console.error("Error creating assessment:", error);
      return res.status(500).json({ error: 'Failed to create assessment in database' });
    }
  } catch (error) {
    console.error('Error processing assessment request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 