import { assessments } from "../store/index.js";
import db from "../../../db/index.js";
import Assessment from '../../../models/assessment/Assessment.js';


/**
 * Update a specific assessment by user ID / assessment ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateAssessment = async (req, res) => {
  try {
    const assessmentId = req.params.assessmentId;
    // Get userId from JWT token only to prevent unauthorized access
    const userId = req.user?.userId
    const { assessmentData } = req.body;
    
    // Validate input
    if (!assessmentData) {
      return res.status(400).json({ error: 'Assessment data is required' });
    }

    const isOwner = await Assessment.validateOwnership(assessmentId, userId);
    if (!isOwner) {
      return res.status(403).json({ error: 'Unauthorized: You do not own this assessment' });
    }
    
    // Legacy direct database update for test users
    // This will be removed once migration is complete
    if (assessmentId.startsWith('test-') && process.env.USE_LEGACY_DB_DIRECT === 'true') {
      try {
        // Check if assessment exists and belongs to user
        const existingAssessment = await db('assessments')
          .where({
            'id': assessmentId,
            'user_id': userId
          })
          .first();
        
        if (!existingAssessment) {
          return res.status(404).json({ error: 'Assessment not found' });
        }
        
        // Determine if we're using nested or flattened format
        const isFlattened = !assessmentData.assessment_data;
        
        if (isFlattened) {
          // Handle flattened structure update
          const updates = {
            updated_at: new Date().toISOString(),
            
            // Flattened fields
            age: assessmentData.age,
            pattern: assessmentData.pattern,
            cycle_length: assessmentData.cycle_length || assessmentData.cycleLength,
            period_duration: assessmentData.period_duration || assessmentData.periodDuration,
            flow_heaviness: assessmentData.flow_heaviness || assessmentData.flowHeaviness,
            pain_level: assessmentData.pain_level || assessmentData.painLevel,
            
            // Parse and store arrays as JSON
            physical_symptoms: assessmentData.physical_symptoms 
              ? JSON.stringify(assessmentData.physical_symptoms) 
              : (assessmentData.symptoms?.physical ? JSON.stringify(assessmentData.symptoms.physical) : null),
            
            emotional_symptoms: assessmentData.emotional_symptoms 
              ? JSON.stringify(assessmentData.emotional_symptoms) 
              : (assessmentData.symptoms?.emotional ? JSON.stringify(assessmentData.symptoms.emotional) : null),
            
            recommendations: assessmentData.recommendations 
              ? JSON.stringify(assessmentData.recommendations) 
              : null
          };
          
          // Update the assessment
          await db('assessments')
            .where('id', assessmentId)
            .update(updates);
        } else {
          // Handle legacy nested structure update
          const nestedData = assessmentData.assessment_data;
          
          const updates = {
            assessment_data: JSON.stringify(assessmentData.assessment_data),
            updated_at: new Date().toISOString(),
            
            // Also update flattened fields for compatibility
            age: nestedData.age,
            pattern: nestedData.pattern,
            cycle_length: nestedData.cycleLength,
            period_duration: nestedData.periodDuration,
            flow_heaviness: nestedData.flowHeaviness,
            pain_level: nestedData.painLevel,
            
            // Parse and store arrays as JSON
            physical_symptoms: nestedData.symptoms?.physical 
              ? JSON.stringify(nestedData.symptoms.physical) 
              : null,
            
            emotional_symptoms: nestedData.symptoms?.emotional 
              ? JSON.stringify(nestedData.symptoms.emotional) 
              : null,
            
            recommendations: nestedData.recommendations 
              ? JSON.stringify(nestedData.recommendations) 
              : null
          };
          
          // Update the assessment
          await db('assessments')
            .where('id', assessmentId)
            .update(updates);
        }
        
        // Get updated assessment
        const updatedDbAssessment = await db('assessments')
          .where('id', assessmentId)
          .first();
        
        // Transform to API response format
        let responseData;
        
        // Check which format to return based on what was received
        if (isFlattened) {
          // Return flattened format
          let physicalSymptoms = [];
          let emotionalSymptoms = [];
          let recommendations = [];
          
          try {
            if (updatedDbAssessment.physical_symptoms) {
              physicalSymptoms = JSON.parse(updatedDbAssessment.physical_symptoms);
            }
            if (updatedDbAssessment.emotional_symptoms) {
              emotionalSymptoms = JSON.parse(updatedDbAssessment.emotional_symptoms);
            }
            if (updatedDbAssessment.recommendations) {
              recommendations = JSON.parse(updatedDbAssessment.recommendations);
            }
          } catch (error) {
            console.error('Error parsing JSON from database:', error);
          }
          
          responseData = {
            id: updatedDbAssessment.id,
            userId: updatedDbAssessment.user_id,
            createdAt: updatedDbAssessment.created_at,
            updatedAt: updatedDbAssessment.updated_at,
            age: updatedDbAssessment.age,
            pattern: updatedDbAssessment.pattern,
            cycle_length: updatedDbAssessment.cycle_length,
            period_duration: updatedDbAssessment.period_duration,
            flow_heaviness: updatedDbAssessment.flow_heaviness,
            pain_level: updatedDbAssessment.pain_level,
            physical_symptoms: physicalSymptoms,
            emotional_symptoms: emotionalSymptoms,
            recommendations: recommendations
          };
        } else {
          // Return legacy nested format
          let physicalSymptoms = [];
          let emotionalSymptoms = [];
          
          try {
            if (updatedDbAssessment.physical_symptoms) {
              physicalSymptoms = JSON.parse(updatedDbAssessment.physical_symptoms);
            }
            if (updatedDbAssessment.emotional_symptoms) {
              emotionalSymptoms = JSON.parse(updatedDbAssessment.emotional_symptoms);
            }
          } catch (error) {
            console.error('Error parsing JSON from database:', error);
          }
          
          responseData = {
            id: updatedDbAssessment.id,
            userId: updatedDbAssessment.user_id,
            createdAt: updatedDbAssessment.created_at,
            updatedAt: updatedDbAssessment.updated_at,
            assessmentData: {
              age: updatedDbAssessment.age,
              pattern: updatedDbAssessment.pattern,
              cycleLength: updatedDbAssessment.cycle_length,
              periodDuration: updatedDbAssessment.period_duration,
              flowHeaviness: updatedDbAssessment.flow_heaviness,
              painLevel: updatedDbAssessment.pain_level,
              symptoms: {
                physical: physicalSymptoms,
                emotional: emotionalSymptoms
              }
            }
          };
          
          // Add recommendations if they exist
          try {
            if (updatedDbAssessment.recommendations) {
              responseData.assessmentData.recommendations = JSON.parse(updatedDbAssessment.recommendations);
            }
          } catch (error) {
            console.error('Error parsing recommendations JSON:', error);
          }
        }
        
        return res.status(200).json(responseData);
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue to model layer if database direct access fails
      }
    }

    // Use Assessment model to update (handles both formats automatically)
    const updatedAssessment = await Assessment.update(assessmentId, assessmentData);
    if (!updatedAssessment) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    
    // Return the updated assessment
    res.status(200).json(updatedAssessment);
  } catch (error) {
    console.error('Error updating assessment:', error);
    res.status(500).json({ error: 'Failed to update assessment' });
  }
}; 