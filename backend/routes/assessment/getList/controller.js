import { assessments } from "../store/index.js";
import db from "../../../db/index.js";
import Assessment from '../../../models/Assessment.js';


/**
 * Get list of all assessments for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const listAssessments = async (req, res) => {
  console.log('listAssessments controller called');
  console.log('Request user object:', req.user);
  
  try {
    // Get userId from authenticated user    
    const userId = req.user?.userId
    console.log('Attempting to fetch assessments for userId:', userId);
    
    if (!userId) {
      console.log('No userId found in request user object');
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    // For test users, try to fetch from the database
    if (userId.startsWith('test-')) {
      console.log('Detected test user, attempting database fetch');
      try {
        // Get assessments from database
        const dbAssessments = await db('assessments').where('userId', userId);
        console.log('Database assessments found:', dbAssessments.length);
        
        if (dbAssessments && dbAssessments.length > 0) {
          // Get all symptoms for these assessments
          const assessmentIds = dbAssessments.map(a => a.id);
          const symptoms = await db('symptoms').whereIn('assessment_id', assessmentIds);
          console.log('Symptoms found for assessments:', symptoms.length);
          
          // Map database results to expected format
          const formattedAssessments = await Promise.all(dbAssessments.map(async (assessment) => {
            // Group symptoms by type for this assessment
            const assessmentSymptoms = symptoms.filter(s => s.assessment_id === assessment.id);
            const groupedSymptoms = {
              physical: assessmentSymptoms.filter(s => s.symptom_type === 'physical').map(s => s.symptom_name),
              emotional: assessmentSymptoms.filter(s => s.symptom_type === 'emotional').map(s => s.symptom_name)
            };
            
            console.log(`Formatting assessment ${assessment.id}:`, {
              hasAssessmentData: !!assessment.assessmentData,
              assessmentDataType: typeof assessment.assessmentData
            });
            
            return {
              id: assessment.id,
              userId: assessment.userId,
              createdAt: assessment.createdAt,
              assessmentData: {
                age: assessment.age,
                cycleLength: assessment.cycle_length,
                periodDuration: assessment.period_duration,
                flowHeaviness: assessment.flow_heaviness,
                painLevel: assessment.pain_level,
                symptoms: groupedSymptoms
              }
            };
          }));
          
          console.log('Sending formatted DB assessments:', formattedAssessments.length);
          return res.status(200).json(formattedAssessments);
        }
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue to in-memory check if database fails
      }
    }
    // Filter assessments by user ID from in-memory store
    // const userAssessments = assessments.filter(a => a.userId === userId);
    // res.json(userAssessments);


    const userAssessments = await Assessment.listByUser(userId)
    console.log('Assessment model returned assessments:', userAssessments?.length || 0);
    
    if (userAssessments && userAssessments.length > 0) {
      // Debug the structure of the first assessment
      console.log('First assessment structure:', {
        keys: Object.keys(userAssessments[0]),
        id: userAssessments[0].id,
        userId: userAssessments[0].userId,
        hasAssessmentData: !!userAssessments[0].assessmentData,
        assessmentDataType: typeof userAssessments[0].assessmentData,
        assessmentDataKeys: userAssessments[0].assessmentData ? Object.keys(userAssessments[0].assessmentData) : 'none'
      });
      
      // Add a mapping step to ensure correct format before sending
      const formattedAssessments = userAssessments.map(assessment => ({
        id: assessment.id,
        userId: assessment.userId,
        createdAt: assessment.createdAt,
        updatedAt: assessment.updatedAt,
        assessmentData: assessment.assessmentData
      }));
      
      console.log('Sending formatted assessments, count:', formattedAssessments.length);
      return res.status(200).json(formattedAssessments);
    } else {
      // Return 200 OK with an empty array if no assessments found
      console.log('No assessments found, returning empty array');
      return res.status(200).json([]);
    }
  } catch (error) {
    console.error('Error fetching assessments:', error);
    res.status(500).json({ error: 'Failed to fetch assessments' });
  }
}; 