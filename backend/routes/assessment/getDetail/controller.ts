import { Response } from 'express';
import db from "../../../db/index.js";
import Assessment from '../../../models/assessment/Assessment.js';
import { AuthenticatedRequest } from '../../types.js';

/**
 * Get detailed view of a specific assessment by its ID
 */
export const getAssessmentDetail = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const assessmentId = req.params.assessmentId;
    // Get userId from JWT token only to prevent unauthorized access
    const userId = req.user?.id;

    if (!assessmentId) {
      res.status(400).json({ error: 'Assessment ID is required' });
      return;
    }

    if (!userId) {
      res.status(400).json({ error: 'User ID is required' });
      return;
    }

    const isOwner = await Assessment.validateOwnership(assessmentId, userId);

    if (!isOwner) {
      res.status(403).json({ error: 'Unauthorized: You do not own this assessment' });
      return;
    }

    // Legacy direct database fetch for test users
    // This will be removed once migration is complete
    if (typeof assessmentId === 'string' && assessmentId.startsWith('test-') && process.env.USE_LEGACY_DB_DIRECT === 'true') {
      // Try to find the assessment in the database first
      try {
        const dbAssessment = await db('assessments')
          .where({
            'id': assessmentId,
            'user_id': userId
          })
          .first();

        if (dbAssessment) {
          // Determine format based on presence of assessment_data field
          if (dbAssessment.assessment_data) {
            // Legacy format - parse symptoms from JSON
            let symptoms: any = { physical: [], emotional: [] };
            let recommendations: string[] = [];

            // Parse physical and emotional symptoms from JSON if they exist
            try {
              if (dbAssessment.physical_symptoms) {
                symptoms.physical = JSON.parse(dbAssessment.physical_symptoms);
              }
              if (dbAssessment.emotional_symptoms) {
                symptoms.emotional = JSON.parse(dbAssessment.emotional_symptoms);
              }
              if (dbAssessment.recommendations) {
                recommendations = JSON.parse(dbAssessment.recommendations);
              }
            } catch (error) {
              console.error(`Failed to parse JSON for assessment ${dbAssessment.id}:`, error);
            }

            // Format the response in legacy nested format
            const response: any = {
              id: dbAssessment.id,
              userId: dbAssessment.user_id,
              createdAt: dbAssessment.created_at,
              updatedAt: dbAssessment.updated_at,
              assessmentData: {
                age: dbAssessment.age,
                pattern: dbAssessment.pattern,
                cycleLength: dbAssessment.cycle_length,
                periodDuration: dbAssessment.period_duration,
                flowHeaviness: dbAssessment.flow_heaviness,
                painLevel: dbAssessment.pain_level,
                symptoms: symptoms
              }
            };

            // Add recommendations if they exist
            if (recommendations.length > 0) {
              response.assessmentData.recommendations = recommendations;
            }

            res.status(200).json(response);
            return;
          } else {
            // Flattened format
            let physicalSymptoms: string[] = [];
            let emotionalSymptoms: string[] = [];
            let recommendations: string[] = [];

            // Parse JSON arrays if they exist
            try {
              if (dbAssessment.physical_symptoms) {
                physicalSymptoms = JSON.parse(dbAssessment.physical_symptoms);
              }
              if (dbAssessment.emotional_symptoms) {
                emotionalSymptoms = JSON.parse(dbAssessment.emotional_symptoms);
              }
              if (dbAssessment.recommendations) {
                recommendations = JSON.parse(dbAssessment.recommendations);
              }
            } catch (error) {
              console.error(`Failed to parse JSON for assessment ${dbAssessment.id}:`, error);
            }

            // Return in flattened format
            res.status(200).json({
              id: dbAssessment.id,
              userId: dbAssessment.user_id,
              createdAt: dbAssessment.created_at,
              updatedAt: dbAssessment.updated_at,
              age: dbAssessment.age,
              pattern: dbAssessment.pattern,
              cycle_length: dbAssessment.cycle_length,
              period_duration: dbAssessment.period_duration,
              flow_heaviness: dbAssessment.flow_heaviness,
              pain_level: dbAssessment.pain_level,
              physical_symptoms: physicalSymptoms,
              emotional_symptoms: emotionalSymptoms,
              recommendations: recommendations
            });
            return;
          }
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue to model layer if database direct access fails
      }
    }

    // Use Assessment model to find (handles both formats automatically)
    const assessment: any = await Assessment.findById(assessmentId);

    if (!assessment) {
      res.status(404).json({ error: 'Assessment not found' });
      return;
    }

    // Log physical_symptoms from Assessment.findById
    console.log('Physical symptoms type:', Array.isArray(assessment.physical_symptoms)
      ? `Array with ${assessment.physical_symptoms.length} items`
      : typeof assessment.physical_symptoms);

    console.log('Emotional symptoms type:', Array.isArray(assessment.emotional_symptoms)
      ? `Array with ${assessment.emotional_symptoms.length} items`
      : typeof assessment.emotional_symptoms);

    // Remove unnecessary update_at field if it exists
    if (assessment.updatedAt !== undefined) {
      delete assessment.updatedAt;
    }

    res.json(assessment);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({ error: 'Failed to fetch assessment' });
  }
};
