import { describe, it, expect, beforeAll, afterAll } from "vitest";
// Remove axios import, use setupTestClient instead
// import axios from "axios";

// Import setup utilities
import { setupTestClient, closeTestServer } from "../../../../test-utilities/setup.js";

// Import utility modules (will now use the 'request' object from setup)
import * as auth from "./runners/auth.vitest.js";
import * as assessment from "./runners/assessment.vitest.js";
import * as user from "./runners/user.vitest.js";

// Remove manual apiClient creation
// const apiClient = axios.create({ ... });

// Shared state for server, request object, and test data
const sharedTestState = {
  server: null,       // To hold the server instance
  request: null,      // To hold the supertest request object
  authToken: null,
  userId: null,
  firstAssessmentId: null,
  secondAssessmentId: null,
  testUser: null,
};

// Setup server before all tests and close after
beforeAll(async () => {
  // Setup local test client, assuming default port is 3000 or configure if needed
  // Use a different port if 3000 is already in use by your main dev server
  const setup = await setupTestClient({ port: 3001 }); // Example: use port 3001 for tests
  sharedTestState.server = setup.server;
  sharedTestState.request = setup.request; // Use the supertest agent
}, 30000); // Increase timeout for server setup

afterAll(async () => {
  if (sharedTestState.server) {
    await closeTestServer(sharedTestState.server);
  }
}, 30000); // Increase timeout for server teardown

// Use describe.sequential to ensure tests run in order
describe.sequential("Master Integration Test (Vitest with Test Server)", () => {
  // =====================
  // Initial Setup Tests
  // =====================
  // IMPORTANT: Update all tests below to use sharedTestState.request
  // and adapt to supertest response format (e.g., res.body, res.status)
  // Also update the helper functions in runners/*.js to accept 'request' instead of 'apiClient'

  it("1. Test basic endpoints before starting", async () => {
    // Test health hello endpoint using supertest
    const helloResponse = await sharedTestState.request.get("/api/setup/health/hello");
    expect(helloResponse.status).toBe(200);
    // Supertest uses res.body for JSON response
    expect(helloResponse.body).toHaveProperty('message');
    expect(helloResponse.body.message).toBe('Hello World from Dottie API!');

    // Test database status endpoint
    const dbStatusResponse = await sharedTestState.request.get("/api/setup/database/status");
    expect([200, 500]).toContain(dbStatusResponse.status);

    if (dbStatusResponse.status === 200) {
      expect(dbStatusResponse.body).toHaveProperty('status');
    }
  });

  // =====================
  // Authentication Tests
  // =====================
  it("2. Register a new test user", async () => {
    try {
      sharedTestState.testUser = auth.generateTestUser();
      // Pass the supertest request object to the adapted helper
      const result = await auth.registerUser(sharedTestState.request, sharedTestState.testUser);
      sharedTestState.userId = result.userId;

      expect(sharedTestState.userId).toBeTruthy();
      expect(result.userData.username).toBe(sharedTestState.testUser.username);
    } catch (error) {
      console.error("Error in user registration test:", error.response?.body || error.message); // Log more detail
      // Re-throw to fail the test
      throw error;
    }
  });

  it("3. Login with the registered user", async () => {
    try {
      // Pass the supertest request object
      sharedTestState.authToken = await auth.loginUser(sharedTestState.request, {
        email: sharedTestState.testUser.email,
        password: sharedTestState.testUser.password,
      });

      expect(sharedTestState.authToken).toBeTruthy();

      // Pass the supertest request object
      const isValid = await auth.verifyToken(
        sharedTestState.request,
        sharedTestState.authToken
      );
      expect(isValid).toBeTruthy();
    } catch (error) {
      console.error("Error in login test:", error.response?.body || error.message);
      throw error;
    }
  });

  // =====================
  // Assessment Tests
  // =====================
  it("4. Create a first assessment", async () => {
    try {
      const defaultAssessment = assessment.generateDefaultAssessment();
      // Pass request object and token
      sharedTestState.firstAssessmentId = await assessment.createAssessment(
        sharedTestState.request, // Use request object
        sharedTestState.authToken,
        sharedTestState.userId,
        defaultAssessment
      );

      expect(sharedTestState.firstAssessmentId).toBeTruthy();

      // Pass request object and token
      const assessmentData = await assessment.getAssessmentById(
        sharedTestState.request, // Use request object
        sharedTestState.authToken,
        sharedTestState.firstAssessmentId
      );

      expect(assessmentData.id).toBe(sharedTestState.firstAssessmentId);
      expect(assessmentData.user_id).toBe(sharedTestState.userId);
      expect(assessmentData.age).toBe(defaultAssessment.age);
    } catch (error) {
      console.error("Error in create assessment test:", error.response?.body || error.message);
       // Improved error logging for supertest/API errors
       if (error.response) {
         console.error("API Response Status:", error.response.status);
         console.error("API Response Body:", error.response.body);
       }
      throw error;
    }
  });

  it("5. Get list of assessments", async () => {
    try {
      // Pass request object and token
      const assessments = await assessment.getAssessments(
        sharedTestState.request, // Use request object
        sharedTestState.authToken
      );

      expect(assessments.length).toBeGreaterThanOrEqual(1);
      const hasFirstAssessment = assessments.some(
        (a) => a.id === sharedTestState.firstAssessmentId
      );
      expect(hasFirstAssessment).toBeTruthy();
    } catch (error) {
      console.error("Error in get assessment list test:", error.response?.body || error.message);
       if (error.response) {
         console.error("API Response Status:", error.response.status);
         console.error("API Response Body:", error.response.body);
       }
      throw error;
    }
  });

  it("6. Create a second assessment", async () => {
    try {
      const severeAssessment = assessment.generateSevereAssessment();
      // Pass request object and token
      sharedTestState.secondAssessmentId = await assessment.createAssessment(
        sharedTestState.request, // Use request object
        sharedTestState.authToken,
        sharedTestState.userId,
        severeAssessment
      );

      expect(sharedTestState.secondAssessmentId).toBeTruthy();

      // Pass request object and token
      const assessments = await assessment.getAssessments(
        sharedTestState.request, // Use request object
        sharedTestState.authToken
      );
      expect(assessments.length).toBeGreaterThanOrEqual(2);

      const hasFirstAssessment = assessments.some(
        (a) => a.id === sharedTestState.firstAssessmentId
      );
      const hasSecondAssessment = assessments.some(
        (a) => a.id === sharedTestState.secondAssessmentId
      );
      expect(hasFirstAssessment).toBeTruthy();
      expect(hasSecondAssessment).toBeTruthy();
    } catch (error) {
      console.error("Error in create second assessment test:", error.response?.body || error.message);
       if (error.response) {
         console.error("API Response Status:", error.response.status);
         console.error("API Response Body:", error.response.body);
       }
      throw error;
    }
  });

  // =====================
  // User Tests
  // =====================
  it("7. Get user information", async () => {
    try {
      // Pass request object and token
      const userData = await user.getUserById(
        sharedTestState.request, // Use request object
        sharedTestState.authToken,
        sharedTestState.userId
      );

      expect(userData.id).toBe(sharedTestState.userId);
      // Check against potentially updated username if test 8 ran before this somehow (it shouldn't with sequential)
      expect(userData.username).toBe(sharedTestState.testUser.username);
      expect(userData.email).toBe(sharedTestState.testUser.email); // Email shouldn't change in update test
    } catch (error) {
      console.error("Error in get user information test:", error.response?.body || error.message);
       if (error.response) {
         console.error("API Response Status:", error.response.status);
         console.error("API Response Body:", error.response.body);
       }
      throw error;
    }
  });

  it("8. Update user profile information", async () => {
    try {
      const profileUpdate = user.generateProfileUpdate();
      // Pass request object and token
      const updatedUser = await user.updateUserProfile(
        sharedTestState.request, // Use request object
        sharedTestState.authToken,
        sharedTestState.userId,
        profileUpdate
      );

      expect(updatedUser.id).toBe(sharedTestState.userId);
      expect(updatedUser.username).toBe(profileUpdate.username);
      expect(updatedUser.age).toBe(profileUpdate.age);

      // Update the test user in the shared state
      // Important: Use the *returned* data from the API (updatedUser)
      // Also, ensure the structure matches the original testUser structure if needed elsewhere
      sharedTestState.testUser = { ...sharedTestState.testUser, ...updatedUser };
    } catch (error) {
      console.error("Error in update user profile test:", error.response?.body || error.message);
       if (error.response) {
         console.error("API Response Status:", error.response.status);
         console.error("API Response Body:", error.response.body);
       }
      throw error;
    }
  });

  it("9. Get all users (admin operation)", async () => {
    try {
      // Pass request object and token
      const allUsers = await user.getAllUsers(
        sharedTestState.request, // Use request object
        sharedTestState.authToken
      );

      expect(Array.isArray(allUsers)).toBeTruthy();
      // Use the updated username from shared state if test 8 ran
      const hasTestUser = allUsers.some((u) => u.id === sharedTestState.userId);
      expect(hasTestUser).toBeTruthy();
    } catch (error) {
      console.error("Error in get all users test:", error.response?.body || error.message);
       if (error.response) {
         console.error("API Response Status:", error.response.status);
         console.error("API Response Body:", error.response.body);
       }
      throw error;
    }
  });

  // =====================
  // Cleanup Tests
  // =====================
  it("10. Delete the second assessment", async () => {
    try {
      // Pass request object and token
      const deleteResponse = await assessment.deleteAssessment(
        sharedTestState.request, // Use request object
        sharedTestState.authToken,
        sharedTestState.userId,
        sharedTestState.secondAssessmentId
      );

      // Check successful deletion (assuming helper returns true/truthy on success)
      expect(deleteResponse).toBeTruthy();

      // Verify deletion attempt (should fail)
      try {
        await assessment.getAssessmentById(
          sharedTestState.request, // Use request object
          sharedTestState.authToken,
          sharedTestState.secondAssessmentId
        );
        expect.fail("Assessment should have been deleted; getAssessmentById should have thrown an error.");
      } catch (error) {
        // Expect a 404 or 403 status from supertest response
        expect(error.response).toBeDefined(); // Make sure we got a response object in the error
        expect([404, 403]).toContain(error.response?.status);
      }

      // Verify first assessment still exists
      const firstAssessment = await assessment.getAssessmentById(
        sharedTestState.request, // Use request object
        sharedTestState.authToken,
        sharedTestState.firstAssessmentId
      );
      expect(firstAssessment.id).toBe(sharedTestState.firstAssessmentId);
    } catch (error) {
      console.error("Error in delete second assessment test:", error.response?.body || error.message);
       if (error.response) {
         console.error("API Response Status:", error.response.status);
         console.error("API Response Body:", error.response.body);
       }
      throw error;
    }
  });

  it("11. Delete the first assessment", async () => {
    try {
      // Pass request object and token
      const deleteResponse = await assessment.deleteAssessment(
        sharedTestState.request, // Use request object
        sharedTestState.authToken,
        sharedTestState.userId,
        sharedTestState.firstAssessmentId
      );
      expect(deleteResponse).toBeTruthy();

      // Verify deletion attempt
      try {
        await assessment.getAssessmentById(
          sharedTestState.request, // Use request object
          sharedTestState.authToken,
          sharedTestState.firstAssessmentId
        );
        expect.fail("Assessment should have been deleted; getAssessmentById should have thrown an error.");
      } catch (error) {
        expect(error.response).toBeDefined();
        expect([404, 403]).toContain(error.response?.status);
      }

      // Verify all assessments are deleted
      const assessments = await assessment.getAssessments(
        sharedTestState.request, // Use request object
        sharedTestState.authToken
      );
      const hasAnyTestAssessment = assessments.some(
        (a) =>
          a.id === sharedTestState.firstAssessmentId ||
          a.id === sharedTestState.secondAssessmentId
      );
      expect(hasAnyTestAssessment).toBeFalsy();
    } catch (error) {
      console.error("Error in delete first assessment test:", error.response?.body || error.message);
      if (error.response) {
        console.error("API Response Status:", error.response.status);
        console.error("API Response Body:", error.response.body);
      }
      throw error;
    }
  });

  it.skip("12. Delete the test user", async () => {
    // Implementation would go here, using sharedTestState.request
  });

  // =====================
  // Error Tests
  // =====================
  it("13. Test authentication errors", async () => {
    // Use supertest to make the request with an invalid token
    const response = await sharedTestState.request.get("/api/auth/users")
      .set("Authorization", "Bearer invalid-token");

    // Expect a 401 status directly from the response
    expect(response.status).toBe(401);

    // No try/catch needed here unless the request itself could fail unexpectedly
    // Supertest doesn't throw for 4xx/5xx by default unless .expect() is used
  });
}); 