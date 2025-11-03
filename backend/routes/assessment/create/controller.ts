import { Response } from 'express';
import { validateAssessmentData } from "../validators/index.js";
import Assessment from "../../../models/assessment/Assessment.js";
import { AuthenticatedRequest } from '../../types.js';

interface CreateAssessmentBody {
  assessmentData: {
    pattern?: string;
    physical_symptoms?: string[] | string;
    emotional_symptoms?: string[] | string;
    [key: string]: any;
  };
}

/**
 * Create a new assessment for a user
 */
export const createAssessment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { assessmentData } = req.body as CreateAssessmentBody;

    if (!assessmentData) {
      res.status(400).json({ error: "Assessment data is required" });
      return;
    }

    console.log(`[WebServer] Assessment received with pattern: ${assessmentData.pattern}`);

    const validationError = validateAssessmentData(assessmentData);
    if (!validationError.isValid) {
      res.status(400).json({ error: validationError });
      return;
    }

    const processedData = {
      ...assessmentData,
      physical_symptoms: Array.isArray(assessmentData.physical_symptoms)
        ? assessmentData.physical_symptoms
        : (assessmentData.physical_symptoms ? [assessmentData.physical_symptoms] : []),
      emotional_symptoms: Array.isArray(assessmentData.emotional_symptoms)
        ? assessmentData.emotional_symptoms
        : (assessmentData.emotional_symptoms ? [assessmentData.emotional_symptoms] : []),
    } as any; // Type assertion to bypass strict type checking since we validate at runtime

    const newAssessment = await Assessment.create(processedData, userId);
    res.status(201).json(newAssessment);
  } catch (error: any) {
    console.error("Error creating assessment:", error.message);
    res.status(500).json({ error: "Failed to create assessment", details: error.message });
  }
};
