import { assessments } from "../store/index.js";
import db from "../../../db/index.js";
import Assessment from '../../../models/Assessment.js';


/**
 * Update a specific assessment by user ID / assessment ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateAssessment = async (req, res) => {
  try {
    const { userId, assessmentId } = req.params;
    const { assessmentData } = req.body;
    
    // Validate input
    if (!assessmentData) {
      return res.status(400).json({ error: 'Assessment data is required' });
    }
    
    // For test IDs, try to update in the database
    if (assessmentId.startsWith('test-')) {
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
        
        // Update assessment in database
        await db('assessments')
          .where('id', assessmentId)
          .update({
            age: assessmentData.age,
            cycle_length: assessmentData.cycleLength,
            period_duration: assessmentData.periodDuration,
            flow_heaviness: assessmentData.flowHeaviness,
            pain_level: assessmentData.painLevel,
            updated_at: new Date().toISOString()
          });
        
        // Handle symptoms update if provided
        if (assessmentData.symptoms) {
          // Delete existing symptoms
          await db('symptoms').where('assessment_id', assessmentId).del();
          
          const symptoms = [];
          
          // Add physical symptoms
          if (assessmentData.symptoms.physical && Array.isArray(assessmentData.symptoms.physical)) {
            for (const symptom of assessmentData.symptoms.physical) {
              symptoms.push({
                assessment_id: assessmentId,
                symptom_name: symptom,
                symptom_type: 'physical'
              });
            }
          }
          
          // Add emotional symptoms
          if (assessmentData.symptoms.emotional && Array.isArray(assessmentData.symptoms.emotional)) {
            for (const symptom of assessmentData.symptoms.emotional) {
              symptoms.push({
                assessment_id: assessmentId,
                symptom_name: symptom,
                symptom_type: 'emotional'
              });
            }
          }
          
          // Insert new symptoms if any exists
          if (symptoms.length > 0) {
            await db('symptoms').insert(symptoms);
          }
        }
        
        // Get updated assessment
        const updatedDbAssessment = await db('assessments')
          .where('id', assessmentId)
          .first();
        
        // Get symptoms for this assessment
        const symptoms = await db('symptoms').where('assessment_id', assessmentId);
        
        // Group symptoms by type
        const groupedSymptoms = {
          physical: symptoms.filter(s => s.symptom_type === 'physical').map(s => s.symptom_name),
          emotional: symptoms.filter(s => s.symptom_type === 'emotional').map(s => s.symptom_name)
        };
        
        // Return updated assessment
        return res.status(200).json({
          id: updatedDbAssessment.id,
          userId: updatedDbAssessment.user_id,
          createdAt: updatedDbAssessment.created_at,
          updatedAt: updatedDbAssessment.updated_at,
          assessmentData: {
            age: updatedDbAssessment.age,
            cycleLength: updatedDbAssessment.cycle_length,
            periodDuration: updatedDbAssessment.period_duration,
            flowHeaviness: updatedDbAssessment.flow_heaviness,
            painLevel: updatedDbAssessment.pain_level,
            symptoms: groupedSymptoms
          }
        });
      } catch (dbError) {
        console.error('Database error:', dbError);
        // Continue to in-memory update if database fails
      }
    }
    
    // // Find and update in-memory assessment
    // const assessmentIndex = assessments.findIndex(a => 
    //   a.id === assessmentId && a.userId === userId
    // );
    
    // if (assessmentIndex === -1) {
    //   return res.status(404).json({ error: 'Assessment not found' });
    // }
    
    // // Update the assessment
    // const updatedAssessment = {
    //   ...assessments[assessmentIndex],
    //   assessmentData: {
    //     ...assessments[assessmentIndex].assessmentData,
    //     ...assessmentData
    //   },
    //   updatedAt: new Date().toISOString()
    // };
    
    // // Replace the old assessment with the updated one
    // assessments[assessmentIndex] = updatedAssessment;

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