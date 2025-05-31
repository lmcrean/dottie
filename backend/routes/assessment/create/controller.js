import { validateAssessmentData } from "../validators/index.js";
import Assessment from "../../../models/assessment/Assessment.js";

/**
 * Create a new assessment for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createAssessment = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { assessmentData } = req.body;

    if (!assessmentData) {
      return res.status(400).json({ error: "Assessment data is required" });
    }

    console.log(`[WebServer] Assessment received with pattern: ${assessmentData.pattern}`);

    const validationError = validateAssessmentData(assessmentData);
    if (!validationError.isValid) {
      return res.status(400).json({ error: validationError });
    }
    
    const processedData = {
      ...assessmentData,
      physical_symptoms: Array.isArray(assessmentData.physical_symptoms) 
        ? assessmentData.physical_symptoms 
        : (assessmentData.physical_symptoms ? [assessmentData.physical_symptoms] : []),
      emotional_symptoms: Array.isArray(assessmentData.emotional_symptoms) 
        ? assessmentData.emotional_symptoms 
        : (assessmentData.emotional_symptoms ? [assessmentData.emotional_symptoms] : []),
    };
    
    const newAssessment = await Assessment.create(processedData, userId);
    res.status(201).json(newAssessment);
  } catch (error) {
    console.error("Error creating assessment:", error.message);
    res.status(500).json({ error: "Failed to create assessment", details: error.message });
  }
};
