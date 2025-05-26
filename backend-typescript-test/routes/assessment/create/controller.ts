import { db } from '../../../db/index.ts';
import { v4 as uuidv4 } from "uuid";
import { assessments } from '../store/index.ts';
import { validateAssessmentData } from '../validators/index.ts';
import Assessment from '../../../models/assessment/Assessment.ts';

/**
 * Create a new assessment for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createAssessment = async (req, res) => {
  try {
    // Get userId from the authenticated user
    const userId = req.user.userId;
    const { assessmentData } = req.body;




    // Validate assessment data
    if (!assessmentData) {
      return res.status(400).json({ error: "Assessment data is required" });
    }
    
    // Legacy direct database insertion for test users
    // This will be removed once migration is complete
    if (userId.startsWith("test-") && process.env.USE_LEGACY_DB_DIRECT === 'true') {
      try {
        // Generate a new assessment ID
        const id = `test-assessment-${Date.now()}`;
        
        // Determine if we're using nested or flattened format
        const isFlattened = !assessmentData.assessment_data;
        
        if (isFlattened) {
          // Handle flattened structure
          await db("assessments").insert({
            id: id,
            user_id: userId,
            created_at: new Date().toISOString(),
            
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
          });
        } else {
          // Handle legacy nested structure
          const nestedData = assessmentData.assessment_data;
          
          await db("assessments").insert({
            id: id,
            user_id: userId,
            created_at: new Date().toISOString(),
            
            // Store legacy format as-is
            assessment_data: JSON.stringify(assessmentData.assessment_data),
            
            // Also extract and store as flattened fields for compatibility
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
          });
        }

        // Return the created assessment
        return res.status(201).json({
          id: id,
          userId: userId,
          createdAt: new Date().toISOString(),
          assessmentData: assessmentData
        });
      } catch (dbError) {
        console.error("Database error:", dbError);
        // Continue to model layer if database direct access fails
      }
    }

    // Validate assessment data using our shared validator
    const validationError = validateAssessmentData(assessmentData);
    if (!validationError.isValid) {

      return res.status(400).json({ error: validationError });
    }
    
    // Create assessment using the model layer
    // This will automatically handle both flattened and nested formats

    
    // Ensure arrays are properly initialized
    const processedData = {
      ...assessmentData,
      physical_symptoms: Array.isArray(assessmentData.physical_symptoms) 
        ? assessmentData.physical_symptoms 
        : (assessmentData.physical_symptoms ? [assessmentData.physical_symptoms] : []),
      emotional_symptoms: Array.isArray(assessmentData.emotional_symptoms) 
        ? assessmentData.emotional_symptoms 
        : (assessmentData.emotional_symptoms ? [assessmentData.emotional_symptoms] : []),
    };
    


    
    try {
      const newAssessment = await Assessment.create(processedData, userId);

      res.status(201).json(newAssessment);
    } catch (modelError) {
      console.error("Error in Assessment.create:", modelError);
      throw modelError;
    }
  } catch (error) {
    console.error("Error creating assessment:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ error: "Failed to create assessment", details: error.message });
  }
};

