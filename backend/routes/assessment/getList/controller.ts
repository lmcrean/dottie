import { Response } from 'express';
import db from "../../../db/index.js";
import Assessment from '../../../models/assessment/Assessment.js';
import { AuthenticatedRequest } from '../../types.js';

/**
 * Get list of all assessments for the authenticated user
 */
export const listAssessments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    // Get userId from authenticated user
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    // Legacy direct database fetch for test users
    // This will be removed once migration is complete
    if (typeof userId === 'string' && userId.startsWith('test-') && process.env.USE_LEGACY_DB_DIRECT === 'true') {
      try {
        // Get assessments from database
        const dbAssessments = await db('assessments').where('user_id', userId);

        if (dbAssessments && dbAssessments.length > 0) {
          // Map database results to expected format, supporting both legacy and flattened
          const formattedAssessments = await Promise.all(dbAssessments.map(async (assessment: any) => {
            // Determine format based on presence of assessment_data field
            if (assessment.assessment_data) {
              // Legacy format - parse symptoms from separate table or JSON
              let symptoms = { physical: [], emotional: [] };

              // Parse physical and emotional symptoms from JSON if they exist
              try {
                if (assessment.physical_symptoms) {
                  symptoms.physical = JSON.parse(assessment.physical_symptoms);
                }
                if (assessment.emotional_symptoms) {
                  symptoms.emotional = JSON.parse(assessment.emotional_symptoms);
                }
              } catch (error) {
                console.error(`Failed to parse symptoms JSON for assessment ${assessment.id}:`, error);
              }

              // Return in legacy nested format
              return {
                id: assessment.id,
                userId: assessment.user_id,
                createdAt: assessment.created_at,
                updatedAt: assessment.updated_at,
                assessmentData: {
                  age: assessment.age,
                  pattern: assessment.pattern,
                  cycleLength: assessment.cycle_length,
                  periodDuration: assessment.period_duration,
                  flowHeaviness: assessment.flow_heaviness,
                  painLevel: assessment.pain_level,
                  symptoms: symptoms
                }
              };
            } else {
              // Flattened format
              let physicalSymptoms: string[] = [];
              let emotionalSymptoms: string[] = [];
              let recommendations: string[] = [];

              // Parse JSON arrays if they exist
              try {
                if (assessment.physical_symptoms) {
                  physicalSymptoms = JSON.parse(assessment.physical_symptoms);
                }
                if (assessment.emotional_symptoms) {
                  emotionalSymptoms = JSON.parse(assessment.emotional_symptoms);
                }
                if (assessment.recommendations) {
                  recommendations = JSON.parse(assessment.recommendations);
                }
              } catch (error) {
                console.error(`Failed to parse JSON for assessment ${assessment.id}:`, error);
              }

              // Return in flattened format
              return {
                id: assessment.id,
                userId: assessment.user_id,
                createdAt: assessment.created_at,
                updatedAt: assessment.updated_at,
                age: assessment.age,
                pattern: assessment.pattern,
                cycle_length: assessment.cycle_length,
                period_duration: assessment.period_duration,
                flow_heaviness: assessment.flow_heaviness,
                pain_level: assessment.pain_level,
                physical_symptoms: physicalSymptoms,
                emotional_symptoms: emotionalSymptoms,
                recommendations: recommendations
              };
            }
          }));

          res.status(200).json(formattedAssessments);
          return;
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue to model layer if database direct access fails
      }
    }

    // Use Assessment model to get list (handles both formats automatically)
    const userAssessments = await Assessment.listByUser(userId);

    const responseData = userAssessments || [];

    // Return empty array with 200 status instead of 404 when no assessments found
    res.status(200).json(responseData);
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
};
