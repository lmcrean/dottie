import { assessments } from "../store/index.js";
import db from "../../../db/index.js";
import Assessment from '../../../models/Assessment.js';


/**
 * Get detailed view of a specific assessment by its ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getAssessmentDetail = async (req, res) => {
  try {
    const assessmentId = req.params.id;
    // Get userId from JWT token or from URL params
    const userId = req.user?.userId || req.params.userId;
    
    if (!assessmentId) {
      return res.status(400).json({ error: 'Assessment ID is required' });
    }
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // For test IDs, try to fetch from the database
    if (assessmentId.startsWith('test-')) {
      // Try to find the assessment in the database first
      try {
        const dbAssessment = await db('assessments')
          .where({
            'id': assessmentId,
            'user_id': userId
          })
          .first();
        
        if (dbAssessment) {
          // Get symptoms for this assessment
          const symptoms = await db('symptoms').where('assessment_id', assessmentId);
          
          // Group symptoms by type
          const groupedSymptoms = {
            physical: symptoms.filter(s => s.symptom_type === 'physical').map(s => s.symptom_name),
            emotional: symptoms.filter(s => s.symptom_type === 'emotional').map(s => s.symptom_name)
          };
          
          // Format the response to match expected format
          return res.status(200).json({
            id: dbAssessment.id,
            userId: dbAssessment.user_id,
            createdAt: dbAssessment.created_at,
            assessmentData: {
              age: dbAssessment.age,
              cycleLength: dbAssessment.cycle_length,
              periodDuration: dbAssessment.period_duration,
              flowHeaviness: dbAssessment.flow_heaviness,
              painLevel: dbAssessment.pain_level,
              symptoms: groupedSymptoms
            }
          });
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue to in-memory check if database fails
      }
    }
    
    // Find the assessment by ID and userId in memory
    // const assessment = assessments.find(a => a.id === assessmentId && a.userId === userId);

    
    const assessment = await Assessment.findById(assessmentId);
    if (!assessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (error) {
    console.error('Error fetching assessment:', error);
    res.status(500).json({ error: 'Failed to fetch assessment' });
  }
}; 