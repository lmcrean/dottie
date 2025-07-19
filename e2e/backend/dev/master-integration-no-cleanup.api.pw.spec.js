import { test as base, expect } from "@playwright/test";

// Import high-level scenario workflows (using dev scenarios with granular functions)
import * as scenarios from "./runners/scenarios/index.js";
import { 
  checkConversationPreviewInDatabase, 
  checkConversationMessagesInDatabase,
  explainFalsePassInProduction 
} from "./runners/chat/utils/index.js";
import { getConversation } from "./runners/chat/10-getConversation.js";
import { getConversationHistory } from "./runners/chat/12-getConversationHistory.js";

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
  
  base("8. Direct database check for conversation previews", async ({ request }) => {
    console.log("\n======== API CONVERSATION CHECKS ========");
    
    // Get conversation history first to check previews
    const conversationList = await getConversationHistory(request, sharedTestState.authToken);
    
    // Find the two conversations we created
    const firstConvFromHistory = conversationList.find(c => c.id === sharedTestState.firstConversationId);
    const secondConvFromHistory = conversationList.find(c => c.id === sharedTestState.secondConversationId);
    
    console.log("\n--- First Conversation API Check ---");
    if (firstConvFromHistory) {
      console.log(`First conversation preview from API: "${firstConvFromHistory.preview || 'NULL'}"`);
      console.log(`Assessment ID linked: ${firstConvFromHistory.assessment_id}`);
      console.log(`Last updated: ${firstConvFromHistory.last_message_date}`);
      console.log(`Message count: ${firstConvFromHistory.message_count}`);
    } else {
      console.log(`❌ First conversation not found in history: ${sharedTestState.firstConversationId}`);
    }
    
    // Get detailed conversation data with messages
    console.log("\n--- First Conversation Details ---");
    const firstConvDetails = await getConversation(request, sharedTestState.authToken, sharedTestState.firstConversationId);
    
    if (firstConvDetails.success) {
      // Find the latest assistant message
      const messages = firstConvDetails.conversation.messages || [];
      const assistantMessages = messages.filter(msg => msg.role === 'assistant')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      if (assistantMessages.length > 0) {
        const latestMessage = assistantMessages[0];
        console.log(`Latest assistant message: "${latestMessage.content.substring(0, 50)}..."`);
        
        // Check if preview contains the start of the latest message
        if (firstConvFromHistory?.preview) {
          const previewMatchesMessage = latestMessage.content.startsWith(
            firstConvFromHistory.preview.replace('...', '')
          );
          console.log(`Preview matches latest message: ${previewMatchesMessage ? 'YES' : 'NO'}`);
        }
      }
    } else {
      console.log(`❌ Failed to get first conversation details: ${firstConvDetails.error}`);
    }
    
    console.log("\n--- Second Conversation API Check ---");
    if (secondConvFromHistory) {
      console.log(`Second conversation preview from API: "${secondConvFromHistory.preview || 'NULL'}"`);
      console.log(`Assessment ID linked: ${secondConvFromHistory.assessment_id}`);
      console.log(`Last updated: ${secondConvFromHistory.last_message_date}`);
      console.log(`Message count: ${secondConvFromHistory.message_count}`);
    } else {
      console.log(`❌ Second conversation not found in history: ${sharedTestState.secondConversationId}`);
    }
    
    // Get detailed conversation data with messages
    console.log("\n--- Second Conversation Details ---");
    const secondConvDetails = await getConversation(request, sharedTestState.authToken, sharedTestState.secondConversationId);
    
    if (secondConvDetails.success) {
      // Find the latest assistant message
      const messages = secondConvDetails.conversation.messages || [];
      const assistantMessages = messages.filter(msg => msg.role === 'assistant')
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      
      if (assistantMessages.length > 0) {
        const latestMessage = assistantMessages[0];
        console.log(`Latest assistant message: "${latestMessage.content.substring(0, 50)}..."`);
        
        // Check if preview contains the start of the latest message
        if (secondConvFromHistory?.preview) {
          const previewMatchesMessage = latestMessage.content.startsWith(
            secondConvFromHistory.preview.replace('...', '')
          );
          console.log(`Preview matches latest message: ${previewMatchesMessage ? 'YES' : 'NO'}`);
        }
      }
    } else {
      console.log(`❌ Failed to get second conversation details: ${secondConvDetails.error}`);
    }
    
    // Run these checks only for completeness and comparison
    console.log("\n--- For comparison: Direct DB checks (may fail in prod) ---");
    // Check first conversation in DB
    const firstConvCheck = await checkConversationPreviewInDatabase(sharedTestState.firstConversationId);
    const firstMsgCheck = await checkConversationMessagesInDatabase(sharedTestState.firstConversationId);
    
    // Check second conversation in DB
    const secondConvCheck = await checkConversationPreviewInDatabase(sharedTestState.secondConversationId);
    const secondMsgCheck = await checkConversationMessagesInDatabase(sharedTestState.secondConversationId);
    
    // Validate results
    console.log("\n====== VALIDATION SUMMARY ======");
    const apiPreviewsExist = !!(firstConvFromHistory?.preview && secondConvFromHistory?.preview);
    console.log(`API previews exist: ${apiPreviewsExist ? 'YES' : 'NO'}`);
    
    const dbPreviewsExist = !!(firstConvCheck.found && firstConvCheck.previewValue && 
                              secondConvCheck.found && secondConvCheck.previewValue);
    
    console.log(`Database previews exist: ${dbPreviewsExist ? 'YES' : 'NO'}`);
    
    if (apiPreviewsExist) {
      console.log(`✅ Test PASSED: Conversation previews are available via API`);
    } else {
      console.log(`❌ Test FAILED: Conversation previews are missing in API responses`);
    }
    
    console.log("=======================================");
  });

  base("9. Authentication error handling", async ({ request }) => {
    await scenarios.runAuthErrorTest(request, expect);
  });
}); 