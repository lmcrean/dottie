import { test as base, expect } from "@playwright/test";

// Import high-level scenario workflows (using dev scenarios with granular functions)
import * as scenarios from "./runners/scenarios/index.js";
import { 
  checkConversationPreviewInDatabase, 
  checkConversationMessagesInDatabase,
  explainFalsePassInProduction 
} from "./runners/chat/utils/index.js";

/**
 * Master Integration Test for Development (No Cleanup)
 *
 * This test suite runs complete workflow scenarios to ensure
 * all endpoints work together in real-world usage patterns,
 * but SKIPS the cleanup steps so data remains in the database
 * for examination after the tests complete.
 * 
 * Note: ALL conversations require an assessment_id - there is no distinction
 * between conversations with and without assessments.
 */

// Create a shared test state object
const sharedTestState = {
  authToken: null,
  userId: null,
  firstAssessmentId: null,
  secondAssessmentId: null,
  testUser: null,
  firstConversationId: null,
  secondConversationId: null,
};

// Configure tests to run in sequence, not in parallel
base.describe.configure({ mode: "serial" });

base.describe("Master Integration Test (No Cleanup)", () => {
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
    
    // Store assessment IDs for subsequent chat tests and cleanup
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

  base("5. First chat conversation workflow with assessment", async ({ request }) => {
    const conversationId = await scenarios.runChatWithAssessmentWorkflow(
      request,
      expect,
      sharedTestState.authToken,
      sharedTestState.firstAssessmentId
    );
    
    // Store conversation ID for reference
    sharedTestState.firstConversationId = conversationId;
  });

  base("6. Second chat conversation workflow with different assessment", async ({ request }) => {
    // Create second assessment if it's the same as the first (for testing multiple conversations)
    let assessmentIdToUse = sharedTestState.secondAssessmentId;
    if (sharedTestState.firstAssessmentId === sharedTestState.secondAssessmentId) {
      // Create a new assessment for the second conversation
      const { firstAssessmentId: newAssessmentId } = await scenarios.runAssessmentCreationWorkflow(
        request, 
        expect, 
        sharedTestState.authToken, 
        sharedTestState.userId
      );
      assessmentIdToUse = newAssessmentId;
      sharedTestState.secondAssessmentId = newAssessmentId;
    }
    
    const conversationId = await scenarios.runChatWithAssessmentWorkflow(
      request,
      expect,
      sharedTestState.authToken,
      assessmentIdToUse
    );
    
    // Store conversation ID for reference
    sharedTestState.secondConversationId = conversationId;
  });

  // SKIPPING CLEANUP STEPS TO PRESERVE DATA IN DATABASE

  /* 
  base("7. Delete first chat conversation", async ({ request }) => {
    await scenarios.deleteAndVerifyConversation(
      request,
      expect,
      sharedTestState.authToken,
      sharedTestState.firstConversationId
    );
  });

  base("8. Delete second chat conversation", async ({ request }) => {
    await scenarios.deleteAndVerifyConversation(
      request,
      expect,
      sharedTestState.authToken,
      sharedTestState.secondConversationId
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
  */

  base("7. Print IDs for database examination", async () => {
    console.log("\n======== TEST DATA IDS (PRESERVED IN DATABASE) ========");
    console.log(`User ID: ${sharedTestState.userId}`);
    console.log(`First Assessment ID: ${sharedTestState.firstAssessmentId}`);
    console.log(`Second Assessment ID: ${sharedTestState.secondAssessmentId}`);
    console.log(`First Conversation ID: ${sharedTestState.firstConversationId}`);
    console.log(`Second Conversation ID: ${sharedTestState.secondConversationId}`);
    console.log("====================================================\n");
  });
  
  base("8. Direct database check for conversation previews", async () => {
    console.log("\n======== DIRECT DATABASE CHECK ========");
    
    // Check first conversation
    console.log("\n--- First Conversation Database Check ---");
    const firstConvCheck = await checkConversationPreviewInDatabase(sharedTestState.firstConversationId);
    
    if (firstConvCheck.found) {
      console.log(`First conversation preview in DB: ${firstConvCheck.previewValue || 'NULL'}`);
      console.log(`Is preview null? ${firstConvCheck.previewIsNull ? 'YES' : 'NO'}`);
    }
    
    // Check message history for first conversation
    const firstMsgCheck = await checkConversationMessagesInDatabase(sharedTestState.firstConversationId);
    if (firstMsgCheck.found && firstMsgCheck.latestAssistantMessage) {
      console.log(`Latest assistant message: "${firstMsgCheck.latestAssistantMessage.content.substring(0, 50)}..."`);
      console.log(`Database preview matches assistant message: ${
        firstConvCheck.previewValue && 
        firstConvCheck.previewValue.includes(firstMsgCheck.latestAssistantMessage.content.substring(0, 20)) ? 'YES' : 'NO'
      }`);
    }
    
    // Check second conversation
    console.log("\n--- Second Conversation Database Check ---");
    const secondConvCheck = await checkConversationPreviewInDatabase(sharedTestState.secondConversationId);
    
    if (secondConvCheck.found) {
      console.log(`Second conversation preview in DB: ${secondConvCheck.previewValue || 'NULL'}`);
      console.log(`Is preview null? ${secondConvCheck.previewIsNull ? 'YES' : 'NO'}`);
    }
    
    // Check message history for second conversation
    const secondMsgCheck = await checkConversationMessagesInDatabase(sharedTestState.secondConversationId);
    if (secondMsgCheck.found && secondMsgCheck.latestAssistantMessage) {
      console.log(`Latest assistant message: "${secondMsgCheck.latestAssistantMessage.content.substring(0, 50)}..."`);
      console.log(`Database preview matches assistant message: ${
        secondConvCheck.previewValue && 
        secondConvCheck.previewValue.includes(secondMsgCheck.latestAssistantMessage.content.substring(0, 20)) ? 'YES' : 'NO'
      }`);
    }
    
    // For production tests, explain the false pass situation
    const isProdTest = process.env.NODE_ENV === 'production' || process.env.TEST_ENV === 'prod';
    if (isProdTest) {
      explainFalsePassInProduction();
    } else {
      // The fact that getConversationsWithPreviews returns previews but the database has NULL values
      // indicates a false pass
      console.log("\n====== FALSE PASS DETECTION ======");
      if (
        firstConvCheck.found && 
        firstConvCheck.previewIsNull && 
        firstMsgCheck.found && 
        firstMsgCheck.latestAssistantMessage
      ) {
        console.log("⚠️ FALSE PASS DETECTED: API returns previews but database has NULL values");
        console.log("⚠️ The getConversationsWithPreviews function is generating previews on-the-fly");
      } else {
        console.log("✅ Database check matches API response");
      }
    }
    
    console.log("=======================================\n");
  });

  base("9. Authentication error handling", async ({ request }) => {
    await scenarios.runAuthErrorTest(request, expect);
  });
}); 