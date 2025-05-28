import { test as base, expect } from "@playwright/test";

// Import high-level scenario workflows (using dev scenarios with granular functions)
import * as scenarios from "./runners/scenarios/index.js";

/**
 * Master Integration Test for Development
 *
 * This test suite runs complete workflow scenarios to ensure
 * all endpoints work together in real-world usage patterns.
 */

// Create a shared test state object
const sharedTestState = {
  authToken: null,
  userId: null,
  firstAssessmentId: null,
  secondAssessmentId: null,
  testUser: null,
  conversationId: null,
  assessmentLinkedConversationId: null,
};

// Configure tests to run in sequence, not in parallel
base.describe.configure({ mode: "serial" });

base.describe("Master Integration Test", () => {
  base("1. Complete setup workflow", async ({ request }) => {
    await scenarios.runSetupWorkflow(request, expect);
  });

  base("2. Complete authentication workflow", async ({ request }) => {
    const authResult = await scenarios.runAuthWorkflow(request, expect);
    
    // Store results for subsequent tests
    sharedTestState.testUser = authResult.testUser;
    sharedTestState.userId = authResult.userId;
    sharedTestState.authToken = authResult.authToken;
  });

  base("3. Assessment creation and management workflow", async ({ request }) => {
    const { firstAssessmentId, secondAssessmentId } = await scenarios.runAssessmentCreationWorkflow(
      request, 
      expect, 
      sharedTestState.authToken, 
      sharedTestState.userId
    );
    
    // Store assessment IDs for cleanup
    sharedTestState.firstAssessmentId = firstAssessmentId;
    sharedTestState.secondAssessmentId = secondAssessmentId;
  });

  base("4. User management workflow", async ({ request }) => {
    const updatedUser = await scenarios.runUserManagementWorkflow(
      request,
      expect,
      sharedTestState.authToken,
      sharedTestState.userId,
      sharedTestState.testUser
    );
    
    // Update test user data
    sharedTestState.testUser = updatedUser;
  });

  base("5. Chat conversation workflow (without assessment)", async ({ request }) => {
    const conversationId = await scenarios.runChatWorkflow(
      request,
      expect,
      sharedTestState.authToken
    );
    
    // Store conversation ID for cleanup
    sharedTestState.conversationId = conversationId;
  });

  base("6. Chat conversation with assessment context workflow", async ({ request }) => {
    const assessmentLinkedConversationId = await scenarios.runChatWithAssessmentWorkflow(
      request,
      expect,
      sharedTestState.authToken,
      sharedTestState.firstAssessmentId
    );
    
    // Store assessment-linked conversation ID for cleanup
    sharedTestState.assessmentLinkedConversationId = assessmentLinkedConversationId;
  });

  base("7. Delete regular chat conversation", async ({ request }) => {
    await scenarios.deleteAndVerifyConversation(
      request,
      expect,
      sharedTestState.authToken,
      sharedTestState.conversationId
    );
  });

  base("8. Delete assessment-linked chat conversation", async ({ request }) => {
    await scenarios.deleteAndVerifyConversation(
      request,
      expect,
      sharedTestState.authToken,
      sharedTestState.assessmentLinkedConversationId
    );
  });

  base("9. Cleanup assessments", async ({ request }) => {
    await scenarios.runCleanupWorkflow(
      request,
      expect,
      sharedTestState.authToken,
      sharedTestState.userId,
      sharedTestState.firstAssessmentId,
      sharedTestState.secondAssessmentId
    );
  });

  base("10. Authentication error handling", async ({ request }) => {
    await scenarios.runAuthErrorTest(request, expect);
  });
});
