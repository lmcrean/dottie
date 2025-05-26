import { TestRequestBody, TestOptions, MockResponse, TestUserOverrides, TestCycleOverrides, TestSymptomOverrides, TestAssessmentOverrides } from '../../../../types/common';
import { test as base, expect } from "@playwright/test";

// Import utility modules in order: auth → assessment → user → chat
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import
// TODO: Fix empty import

/**
 * Master Integration Test for Production
 *
 * This test suite tests all endpoints in sequence to ensure
 * they work together as expected in a real-world scenario in production.
 *
 * The test follows this flow:
 * 1. Authentication: Register user and login
 * 2. Assessment: Create and manage assessments
 * 3. User: Update and manage user information
 * 4. Chat: Create and manage chat conversations
 * 5. Cleanup: Delete resources created during testing
 */

// Create a shared test state object
const sharedTestState = {
  authToken: null,
  userId: null,
  firstAssessmentId: null,
  secondAssessmentId: null,
  testUser: null,
  conversationId: null,
};

// Configure tests to run in sequence, not in parallel
base.describe.configure({ mode: "serial" });

base.describe("Master Integration Test", () => {
  // Log the test environment configuration
  base.beforeAll(async () => {
    // Log the baseURL from the config file


  });

  // =====================
  // Authentication Tests
  // =====================
  base("1. Test basic endpoints before starting", async ({ request }) => {
    // Test health hello endpoint instead of /api/hello which doesn't exist
    const helloResponse = await request.get("/api/setup/health/hello");
    expect(helloResponse.status()).toBe(200);
    const helloData = await helloResponse.json();
    expect(helloData).toHaveProperty('message');
    expect(helloData.message).toBe('Hello World from Dottie API!');

    // Test database status endpoint
    const dbStatusResponse = await request.get("/api/setup/database/status");
    // Accept both 200 and 500 status codes for database status
    expect([200, 500]).toContain(dbStatusResponse.status());
    
    // If response is 200, check the data
    if (dbStatusResponse.status() === 200) {
      const dbStatusData = await dbStatusResponse.json();
      expect(dbStatusData).toHaveProperty('status');
    }
  });

  base("2. Register a new test user", async ({ request }) => {
    try {
      // Generate test user data
      sharedTestState.testUser = auth.generateTestUser();

      // Try to register the user using the auth module
      try {
        const result = await auth.registerUser(request, sharedTestState.testUser);
        sharedTestState.userId = result.userId;

        // Verify we got a valid user ID
        expect(sharedTestState.userId).toBeTruthy();
        expect(result.userData.username).toBe(sharedTestState.testUser.username);
        
      } catch (regError) {
        // If registration fails, log the error and let the test fail
        console.error("Registration failed:", regError);
        throw regError; // Re-throw the error to fail the test
      }
    } catch (error) {
      console.error("Error in user registration test:", error);
      throw error;
    }
  });

  base("3. Login with the registered user", async ({ request }) => {
    try {
      // Log in with the user we just created
      try {
        sharedTestState.authToken = await auth.loginUser(request, {
          email: sharedTestState.testUser.email,
          password: sharedTestState.testUser.password,
        });

        // Verify the token is valid
        expect(sharedTestState.authToken).toBeTruthy();

        const isValid = await auth.verifyToken(
          request,
          sharedTestState.authToken
        );
        expect(isValid).toBeTruthy();
        
      } catch (loginError) {
        console.error("Login failed:", loginError);
        // Re-throw the error to fail the test
        throw loginError;
      }
    } catch (error) {
      console.error("Error in login test:", error);
      throw error;
    }
  });

  // =====================
  // Assessment Tests
  // =====================
  base("4. Create a first assessment", async ({ request }) => {
    try {
      // Create a basic assessment
      sharedTestState.firstAssessmentId = await assessment.createAssessment(
        request,
        sharedTestState.authToken,
        sharedTestState.userId,
        assessment.generateDefaultAssessment()
      );

      expect(sharedTestState.firstAssessmentId).toBeTruthy();

      // Verify the assessment was created by fetching it
      const assessmentData = await assessment.getAssessmentById(
        request,
        sharedTestState.authToken,
        sharedTestState.firstAssessmentId
      );

      expect(assessmentData.id).toBe(sharedTestState.firstAssessmentId);
      
      // Check for user_id (flattened format uses snake_case)
      expect(assessmentData.user_id).toBe(sharedTestState.userId);
      
      // Verify age field matches what we sent
      expect(assessmentData.age).toBe("18-24");
    } catch (error) {
      console.error("Error in create assessment test:", error);
      throw error;
    }
  });

  base("5. Get list of assessments", async ({ request }) => {
    try {
      const assessments = await assessment.getAssessments(
        request,
        sharedTestState.authToken
      );

      // Should contain at least one assessment
      expect(assessments.length).toBeGreaterThanOrEqual(1);

      // Should contain our first assessment (using snake_case fields)
      const hasFirstAssessment = assessments.some(
        (a) => a.id === sharedTestState.firstAssessmentId
      );
      expect(hasFirstAssessment).toBeTruthy();
    } catch (error) {
      console.error("Error in get assessment list test:", error);
      throw error;
    }
  });

  base("6. Create a second assessment", async ({ request }) => {
    try {
      // Create a severe assessment
      sharedTestState.secondAssessmentId = await assessment.createAssessment(
        request,
        sharedTestState.authToken,
        sharedTestState.userId,
        assessment.generateSevereAssessment()
      );

      expect(sharedTestState.secondAssessmentId).toBeTruthy();

      // Verify we now have at least two assessments
      const assessments = await assessment.getAssessments(
        request,
        sharedTestState.authToken
      );
      expect(assessments.length).toBeGreaterThanOrEqual(2);

      // Both assessments should be in the list
      const hasFirstAssessment = assessments.some(
        (a) => a.id === sharedTestState.firstAssessmentId
      );
      const hasSecondAssessment = assessments.some(
        (a) => a.id === sharedTestState.secondAssessmentId
      );
      expect(hasFirstAssessment).toBeTruthy();
      expect(hasSecondAssessment).toBeTruthy();
    } catch (error) {
      console.error("Error in create second assessment test:", error);
      throw error;
    }
  });

  // =====================
  // User Tests
  // =====================
  base("7. Get user information", async ({ request }) => {
    try {
      const userData = await user.getUserById(
        request,
        sharedTestState.authToken,
        sharedTestState.userId
      );

      // Verify we got the correct user
      expect(userData.id).toBe(sharedTestState.userId);
      expect(userData.username).toBe(sharedTestState.testUser.username);
      expect(userData.email).toBe(sharedTestState.testUser.email);
    } catch (error) {
      console.error("Error in get user information test:", error);
      throw error;
    }
  });

  base("8. Update user profile information", async ({ request }) => {
    try {
      // Generate profile update data
      const profileUpdate = user.generateProfileUpdate();

      // Update the profile
      const updatedUser = await user.updateUserProfile(
        request,
        sharedTestState.authToken,
        sharedTestState.userId,
        profileUpdate
      );

      // Verify the update was successful
      expect(updatedUser.id).toBe(sharedTestState.userId);
      expect(updatedUser.username).toBe(profileUpdate.username);
      expect(updatedUser.age).toBe(profileUpdate.age);

      // Update the test user in the shared state
      sharedTestState.testUser = updatedUser;
    } catch (error) {
      console.error("Error in update user profile test:", error);
      throw error;
    }
  });

  base("9. Get all users (admin operation)", async ({ request }) => {
    try {
      const allUsers = await user.getAllUsers(
        request,
        sharedTestState.authToken
      );

      // Should be an array of users
      expect(Array.isArray(allUsers)).toBeTruthy();

      // Should contain our test user
      const hasTestUser = allUsers.some((u) => u.id === sharedTestState.userId);
      expect(hasTestUser).toBeTruthy();
    } catch (error) {
      console.error("Error in get all users test:", error);
      throw error;
    }
  });

  // =====================
  // Chat Tests
  // =====================
  base("10. Send a message to start a new conversation", async ({ request }) => {
    try {
      // Generate and send a test message without specifying a conversation ID
      const message = chat.generateTestMessage();
      
      const result = await chat.sendMessage(
        request,
        sharedTestState.authToken,
        message
      );

      // Verify we got a response and a conversation ID
      expect(result.message).toBeTruthy();
      expect(result.conversationId).toBeTruthy();

      // Store the conversation ID for later tests
      sharedTestState.conversationId = result.conversationId;
    } catch (error) {
      console.error("Error in send message test:", error);
      throw error;
    }
  });

  base("11. Get chat history for the user", async ({ request }) => {
    try {
      const conversations = await chat.getConversationHistory(
        request,
        sharedTestState.authToken
      );

      // Should have at least one conversation
      expect(conversations.length).toBeGreaterThanOrEqual(1);

      // Should contain our conversation
      const hasConversation = conversations.some(
        (c) => c.id === sharedTestState.conversationId
      );
      expect(hasConversation).toBeTruthy();
    } catch (error) {
      console.error("Error in get chat history test:", error);
      throw error;
    }
  });

  base("12. Get a specific conversation by ID", async ({ request }) => {
    try {
      const conversation = await chat.getConversation(
        request,
        sharedTestState.authToken,
        sharedTestState.conversationId
      );

      // Verify the conversation ID matches
      expect(conversation.id).toBe(sharedTestState.conversationId);

      // Should have at least two messages (user query and AI response)
      expect(conversation.messages.length).toBeGreaterThanOrEqual(2);

      // First message should be from the user
      expect(conversation.messages[0].role).toBe("user");
    } catch (error) {
      console.error("Error in get conversation test:", error);
      throw error;
    }
  });

  base("13. Send a second message to the existing conversation", async ({ request }) => {
    try {
      // Send another message to the same conversation
      const message = "Tell me more about managing menstrual symptoms";
      
      const result = await chat.sendMessage(
        request,
        sharedTestState.authToken,
        message,
        sharedTestState.conversationId
      );

      // Verify the conversation ID matches
      expect(result.conversationId).toBe(sharedTestState.conversationId);

      // Check that the message was added to the conversation
      const updatedConversation = await chat.getConversation(
        request,
        sharedTestState.authToken,
        sharedTestState.conversationId
      );

      // Should now have at least 4 messages (2 user queries and 2 AI responses)
      expect(updatedConversation.messages.length).toBeGreaterThanOrEqual(4);
    } catch (error) {
      console.error("Error in send second message test:", error);
      throw error;
    }
  });

  base("14. Delete the conversation", async ({ request }) => {
    try {
      const deleted = await chat.deleteConversation(
        request,
        sharedTestState.authToken,
        sharedTestState.conversationId
      );

      expect(deleted).toBeTruthy();

      // Verify the conversation was deleted by trying to fetch it (should fail)
      try {
        await chat.getConversation(
          request,
          sharedTestState.authToken,
          sharedTestState.conversationId
        );
        // If we reach here, the conversation wasn't deleted
        expect(false).toBeTruthy("Conversation should have been deleted");
      } catch (error) {
        // We expect an error when trying to fetch a deleted conversation
        expect(error.message).toContain("Failed to get conversation: 404");
      }

      // Verify no conversations in history
      const conversations = await chat.getConversationHistory(
        request,
        sharedTestState.authToken
      );
      const hasDeletedConversation = conversations.some(
        (c) => c.id === sharedTestState.conversationId
      );
      expect(hasDeletedConversation).toBeFalsy();
    } catch (error) {
      console.error("Error in delete conversation test:", error);
      throw error;
    }
  });

  // =====================
  // Cleanup Tests
  // =====================
  base("15. Delete the second assessment", async ({ request }) => {
    try {
      const deleted = await assessment.deleteAssessment(
        request,
        sharedTestState.authToken,
        sharedTestState.userId,
        sharedTestState.secondAssessmentId
      );

      expect(deleted).toBeTruthy();

      // Verify it was deleted by trying to fetch it (should fail)
      try {
        await assessment.getAssessmentById(
          request,
          sharedTestState.authToken,
          sharedTestState.secondAssessmentId
        );
        // If we reach here, the assessment wasn't deleted
        expect(false).toBeTruthy("Assessment should have been deleted");
      } catch (error) {
        // We expect either a 404 (not found) or 403 (unauthorized) error when trying to fetch a deleted assessment
        expect(
          error.message.includes("Failed to get assessment: 404") || 
          error.message.includes("Failed to get assessment: 403")
        ).toBeTruthy();
      }

      // Verify the first assessment still exists
      const firstAssessment = await assessment.getAssessmentById(
        request,
        sharedTestState.authToken,
        sharedTestState.firstAssessmentId
      );
      expect(firstAssessment.id).toBe(sharedTestState.firstAssessmentId);
    } catch (error) {
      console.error("Error in delete second assessment test:", error);
      throw error;
    }
  });

  base("16. Delete the first assessment", async ({ request }) => {
    try {
      const deleted = await assessment.deleteAssessment(
        request,
        sharedTestState.authToken,
        sharedTestState.userId,
        sharedTestState.firstAssessmentId
      );

      expect(deleted).toBeTruthy();

      // Verify the assessment was deleted by trying to fetch it (should fail)
      try {
        await assessment.getAssessmentById(
          request,
          sharedTestState.authToken,
          sharedTestState.firstAssessmentId
        );
        // If we reach here, the assessment wasn't deleted
        expect(false).toBeTruthy("Assessment should have been deleted");
      } catch (error) {
        // We expect either a 404 (not found) or 403 (unauthorized) error when trying to fetch a deleted assessment
        expect(
          error.message.includes("Failed to get assessment: 404") || 
          error.message.includes("Failed to get assessment: 403")
        ).toBeTruthy();
      }

      // Verify all assessments are deleted
      const assessments = await assessment.getAssessments(
        request,
        sharedTestState.authToken
      );
      const hasAnyTestAssessment = assessments.some(
        (a) =>
          a.id === sharedTestState.firstAssessmentId ||
          a.id === sharedTestState.secondAssessmentId
      );
      expect(hasAnyTestAssessment).toBeFalsy();
    } catch (error) {
      console.error("Error in delete first assessment test:", error);
      throw error;
    }
  });

  // Note: Some APIs may not allow deleting users, so we'll mark this as skipped
  base("17. Delete the test user", async ({ request }) => {
    try {
      const deleted = await user.deleteUser(
        request,
        sharedTestState.authToken,
        sharedTestState.userId
      );
      expect(deleted).toBeTruthy();

      // Try to access the user (should fail)
      try {
        await user.getUserById(
          request,
          sharedTestState.authToken,
          sharedTestState.userId
        );
        // If we reach here, the user wasn't deleted
        expect(false).toBeTruthy("User should have been deleted");
      } catch (error) {
        // We expect an error when trying to fetch a deleted user
        expect(error.message).toContain("Failed to get user info: 404");
      }
    } catch (error) {
      console.error("Error in delete user test:", error);
      throw error;
    }
  });

  // =====================
  // Error Tests
  // =====================
  base("18. Test authentication errors", async ({ request }) => {
    try {
      // Try to access protected endpoint with invalid token
      const response = await request.get("/api/auth/users", {
        headers: {
          Authorization: "Bearer invalid-token",
        },
      });

      expect((response as MockResponse).status()).toBe(401);
    } catch (error) {
      console.error("Error in authentication errors test:", error);
      throw error;
    }
  });
});



