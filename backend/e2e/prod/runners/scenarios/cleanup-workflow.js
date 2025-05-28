/**
 * Cleanup Workflow Scenario
 * 
 * Handles cleanup operations for test resources.
 */

import { deleteAndVerifyAssessment } from './assessment-workflow.js';
import * as user from '../user/index.js';

/**
 * Clean up all test resources
 * @param {Object} request - Playwright request object
 * @param {Object} expect - Playwright expect function
 * @param {string} authToken - Authentication token
 * @param {string} userId - User ID
 * @param {string} firstAssessmentId - First assessment to delete
 * @param {string} secondAssessmentId - Second assessment to delete
 */
export async function runCleanupWorkflow(request, expect, authToken, userId, firstAssessmentId, secondAssessmentId) {
  // Delete second assessment and verify
  await deleteAndVerifyAssessment(request, expect, authToken, userId, secondAssessmentId);
  
  // Verify first assessment still exists after deleting second
  await import('../assessment/index.js').then(async (assessment) => {
    const firstAssessment = await assessment.getAssessmentById(
      request,
      authToken,
      firstAssessmentId
    );
    expect(firstAssessment.id).toBe(firstAssessmentId);
  });

  // Delete first assessment and verify
  await deleteAndVerifyAssessment(request, expect, authToken, userId, firstAssessmentId);
  
  // Verify all test assessments are deleted
  await import('../assessment/index.js').then(async (assessment) => {
    const assessments = await assessment.getAssessments(request, authToken);
    const hasAnyTestAssessment = assessments.some(
      a => a.id === firstAssessmentId || a.id === secondAssessmentId
    );
    expect(hasAnyTestAssessment).toBeFalsy();
  });
}

/**
 * Test authentication error handling
 * @param {Object} request - Playwright request object
 * @param {Object} expect - Playwright expect function
 */
export async function runAuthErrorTest(request, expect) {
  // Try to access protected endpoint with invalid token
  const response = await request.get("/api/auth/users", {
    headers: {
      Authorization: "Bearer invalid-token",
    },
  });
  expect(response.status()).toBe(401);
} 