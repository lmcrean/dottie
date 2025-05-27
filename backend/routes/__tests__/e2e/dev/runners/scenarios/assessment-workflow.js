/**
 * Assessment Workflow Scenarios for Development Testing
 * 
 * Tests assessment flows using granular utility functions for sqlite localhost
 */

import { generateDefaultAssessment } from '../assessment/generateDefaultAssessment.js';
import { createAssessment } from '../assessment/createAssessment.js';
import { getAssessments } from '../assessment/getAssessments.js';
import { getAssessmentById } from '../assessment/getAssessmentById.js';
import { deleteAssessment } from '../assessment/deleteAssessment.js';

/**
 * Complete assessment creation workflow test
 * Tests assessment creation, retrieval, and deletion
 */
export async function runAssessmentCreationWorkflow(request, expect, authToken, userId) {
  console.log('📋 Starting Assessment Creation Workflow...');
  
  try {
    // Step 1: Generate default assessment data
    const assessmentData = generateDefaultAssessment();
    console.log('✅ Generated assessment data');
    
    // Step 2: Create the assessment (request, token, userId, assessmentData)
    const createdAssessmentId = await createAssessment(request, authToken, userId, assessmentData);
    console.log('✅ Assessment created successfully');
    
    // Step 3: Get all assessments (request, token)
    const allAssessments = await getAssessments(request, authToken);
    console.log('✅ Retrieved all assessments');
    
    // Step 4: Get specific assessment by ID (request, token, assessmentId)
    const retrievedAssessment = await getAssessmentById(request, authToken, createdAssessmentId);
    console.log('✅ Retrieved assessment by ID');
    
    console.log('🎉 Assessment Creation Workflow completed successfully!');
    return {
      firstAssessmentId: createdAssessmentId,
      secondAssessmentId: createdAssessmentId // For now using same ID, test can create multiple if needed
    };
    
  } catch (error) {
    console.error('❌ Assessment Creation Workflow failed:', error.message);
    throw error;
  }
}

/**
 * Assessment cleanup workflow
 * Deletes test assessments for cleanup
 */
export async function runCleanupWorkflow(request, expect, authToken, userId, firstAssessmentId, secondAssessmentId) {
  console.log('🧹 Starting Cleanup Workflow...');
  
  try {
    // Delete the first assessment (request, token, userId, assessmentId)
    if (firstAssessmentId) {
      const deletionResult1 = await deleteAssessment(request, authToken, userId, firstAssessmentId);
      console.log('✅ First assessment deleted successfully');
    }
    
    // Delete the second assessment (if different)
    if (secondAssessmentId && secondAssessmentId !== firstAssessmentId) {
      const deletionResult2 = await deleteAssessment(request, authToken, userId, secondAssessmentId);
      console.log('✅ Second assessment deleted successfully');
    }
    
    console.log('🎉 Cleanup Workflow completed successfully!');
    return { success: true };
    
  } catch (error) {
    console.error('❌ Cleanup Workflow failed:', error.message);
    throw error;
  }
} 