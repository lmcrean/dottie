/**
 * Assessment Management Workflow Scenario
 * 
 * Handles complete assessment lifecycle operations.
 */

import * as assessment from '../assessment/index.js';

/**
 * Create and verify an assessment
 * @param {Object} request - Playwright request object
 * @param {Object} expect - Playwright expect function
 * @param {string} authToken - Authentication token
 * @param {string} userId - User ID
 * @param {Object} assessmentData - Assessment data to create
 * @returns {Promise<string>} Assessment ID
 */
export async function createAndVerifyAssessment(request, expect, authToken, userId, assessmentData) {
  // Create the assessment
  const assessmentId = await assessment.createAssessment(
    request,
    authToken,
    userId,
    assessmentData
  );
  expect(assessmentId).toBeTruthy();

  // Verify the assessment was created by fetching it
  const createdAssessment = await assessment.getAssessmentById(
    request,
    authToken,
    assessmentId
  );
  expect(createdAssessment.id).toBe(assessmentId);
  expect(createdAssessment.user_id).toBe(userId);
  expect(createdAssessment.age).toBe(assessmentData.age);

  return assessmentId;
}

/**
 * Create two assessments and verify list contains both
 * @param {Object} request - Playwright request object
 * @param {Object} expect - Playwright expect function
 * @param {string} authToken - Authentication token
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Both assessment IDs
 */
export async function runAssessmentCreationWorkflow(request, expect, authToken, userId) {
  // Create first assessment (default)
  const firstAssessmentId = await createAndVerifyAssessment(
    request,
    expect,
    authToken,
    userId,
    assessment.generateDefaultAssessment()
  );

  // Verify it appears in the list
  let assessments = await assessment.getAssessments(request, authToken);
  expect(assessments.length).toBeGreaterThanOrEqual(1);
  expect(assessments.some(a => a.id === firstAssessmentId)).toBeTruthy();

  // Create second assessment (severe)
  const secondAssessmentId = await createAndVerifyAssessment(
    request,
    expect,
    authToken,
    userId,
    assessment.generateSevereAssessment()
  );

  // Verify both assessments are in the list
  assessments = await assessment.getAssessments(request, authToken);
  expect(assessments.length).toBeGreaterThanOrEqual(2);
  expect(assessments.some(a => a.id === firstAssessmentId)).toBeTruthy();
  expect(assessments.some(a => a.id === secondAssessmentId)).toBeTruthy();

  return { firstAssessmentId, secondAssessmentId };
}

/**
 * Delete assessment and verify deletion
 * @param {Object} request - Playwright request object
 * @param {Object} expect - Playwright expect function
 * @param {string} authToken - Authentication token
 * @param {string} userId - User ID
 * @param {string} assessmentId - Assessment ID to delete
 */
export async function deleteAndVerifyAssessment(request, expect, authToken, userId, assessmentId) {
  // Delete the assessment
  const deleted = await assessment.deleteAssessment(
    request,
    authToken,
    userId,
    assessmentId
  );
  expect(deleted).toBeTruthy();

  // Verify it was deleted by trying to fetch it (should fail)
  try {
    await assessment.getAssessmentById(request, authToken, assessmentId);
    expect(false).toBeTruthy("Assessment should have been deleted");
  } catch (error) {
    expect(
      error.message.includes("Failed to get assessment: 404") || 
      error.message.includes("Failed to get assessment: 403")
    ).toBeTruthy();
  }
} 