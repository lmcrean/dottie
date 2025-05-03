/**
 * API Integration Tests
 *
 * This test suite verifies that all API endpoints work together
 * in a complete user journey flow, focusing on authentication
 * token persistence between operations.
 */
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import { api, setAuthToken, clearAuthToken } from "./runners/apiClient";
import * as auth from "./runners/auth";
import * as user from "./runners/user";
import * as assessment from "./runners/assessment";

// Shared state between tests
interface SharedState {
  userId: string | null;
  testUser: any;
  firstAssessmentId: string | null;
  secondAssessmentId: string | null;
}

const sharedState: SharedState = {
  userId: null,
  testUser: null,
  firstAssessmentId: null,
  secondAssessmentId: null,
};

// Configure test timeout (might need to be increased for slow networks)
const TEST_TIMEOUT = 10000;

// Configure API base URL for testing
beforeAll(() => {
  // Set API base URL to the local test server
  api.defaults.baseURL = "http://localhost:3000";

  // We'll clear any auth token before starting tests
  clearAuthToken();
});

// Clean up after all tests
afterAll(() => {
  clearAuthToken();
});

describe("API Integration Test", () => {
  // =====================
  // Basic API Tests
  // =====================
  test(
    "1. Test basic endpoints before starting",
    async () => {
      // Test the hello endpoint
      const helloResponse = await api.get("/api/hello");
      expect(helloResponse.status).toBe(200);

      // Test database connection
      const dbStatusResponse = await api.get("/api/setup/database/status");
      expect(dbStatusResponse.status).toBe(200);
    },
    TEST_TIMEOUT
  );

  // =====================
  // Authentication Tests
  // =====================
  test(
    "2. Register a new test user",
    async () => {
      // Generate test user data
      sharedState.testUser = auth.generateTestUser();

      // Register the user
      const result = await auth.registerUser(sharedState.testUser);
      sharedState.userId = result.userId;

      // Verify we got a valid user ID
      expect(sharedState.userId).toBeTruthy();
      expect(result.userData.username).toBe(sharedState.testUser.username);
    },
    TEST_TIMEOUT
  );

  test(
    "3. Login with the registered user",
    async () => {
      // Log in with the user we just created
      const token = await auth.loginUser({
        email: sharedState.testUser.email,
        password: sharedState.testUser.password,
      });

      // Verify the token is valid
      expect(token).toBeTruthy();

      // Verify the token is working
      const isValid = await auth.verifyToken();
      expect(isValid).toBeTruthy();
    },
    TEST_TIMEOUT
  );

  // =====================
  // User Tests
  // =====================
  test(
    "4. Get authenticated user information (me endpoint)",
    async () => {
      // Get the current user's information using token set in previous step
      const userData = await user.getCurrentUser();

      // Verify user data
      expect(userData.id).toBe(sharedState.userId);
      expect(userData.username).toBe(sharedState.testUser.username);
      expect(userData.email).toBe(sharedState.testUser.email);
    },
    TEST_TIMEOUT
  );

  test(
    "5. Update current user profile",
    async () => {
      // Generate and apply a profile update
      const profileUpdate = user.generateProfileUpdate();

      const updatedUser = await user.updateCurrentUserProfile(profileUpdate);

      // Verify the update was applied
      expect(updatedUser.id).toBe(sharedState.userId);
      expect(updatedUser.username).toBe(profileUpdate.username);

      // Update our test user object
      sharedState.testUser = updatedUser;
    },
    TEST_TIMEOUT
  );

  // =====================
  // Assessment Tests
  // =====================
  test(
    "6. Create a first assessment",
    async () => {
      // Create a basic assessment for our user
      sharedState.firstAssessmentId = await assessment.createAssessment(
        sharedState.userId as string,
        assessment.generateDefaultAssessment()
      );

      // Verify assessment was created
      expect(sharedState.firstAssessmentId).toBeTruthy();

      // Verify assessment details
      const assessmentData = await assessment.getAssessmentById(
        sharedState.firstAssessmentId
      );
      expect(assessmentData.id).toBe(sharedState.firstAssessmentId);
      expect(assessmentData.userId).toBe(sharedState.userId);
    },
    TEST_TIMEOUT
  );

  test(
    "7. Get list of assessments",
    async () => {
      const assessments = await assessment.getAssessments();

      // Should have at least one assessment
      expect(assessments.length).toBeGreaterThanOrEqual(1);

      // Should contain our assessment
      const hasFirstAssessment = assessments.some(
        (a) => a.id === sharedState.firstAssessmentId
      );
      expect(hasFirstAssessment).toBeTruthy();
    },
    TEST_TIMEOUT
  );

  test(
    "8. Update the first assessment",
    async () => {
      // Update to more severe symptoms
      const updatedAssessment = await assessment.updateAssessment(
        sharedState.userId as string,
        sharedState.firstAssessmentId as string,
        {
          flowHeaviness: "heavy",
          painLevel: "severe",
          symptoms: {
            physical: ["Bloating", "Headaches", "Cramps"],
            emotional: ["Mood swings", "Irritability", "Anxiety"],
          },
        }
      );

      // Verify the update was applied
      expect(updatedAssessment.id).toBe(sharedState.firstAssessmentId);
      expect(updatedAssessment.assessmentData.flowHeaviness).toBe("heavy");
      expect(updatedAssessment.assessmentData.painLevel).toBe("severe");
    },
    TEST_TIMEOUT
  );

  test(
    "9. Create a second assessment",
    async () => {
      // Create a severe assessment
      sharedState.secondAssessmentId = await assessment.createAssessment(
        sharedState.userId as string,
        assessment.generateSevereAssessment()
      );

      // Verify creation
      expect(sharedState.secondAssessmentId).toBeTruthy();

      // Verify we now have at least two assessments
      const assessments = await assessment.getAssessments();
      expect(assessments.length).toBeGreaterThanOrEqual(2);

      // Both assessments should be in the list
      const hasFirstAssessment = assessments.some(
        (a) => a.id === sharedState.firstAssessmentId
      );
      const hasSecondAssessment = assessments.some(
        (a) => a.id === sharedState.secondAssessmentId
      );
      expect(hasFirstAssessment).toBeTruthy();
      expect(hasSecondAssessment).toBeTruthy();
    },
    TEST_TIMEOUT
  );

  // =====================
  // Cleanup Tests
  // =====================
  test(
    "10. Delete the second assessment",
    async () => {
      const deleted = await assessment.deleteAssessment(
        sharedState.userId as string,
        sharedState.secondAssessmentId as string
      );

      expect(deleted).toBeTruthy();

      // Verify it was deleted by trying to fetch it (should fail)
      try {
        await assessment.getAssessmentById(
          sharedState.secondAssessmentId as string
        );
        // If we reach here, the assessment wasn't deleted
        expect(false).toBeTruthy("Assessment should have been deleted");
      } catch (error: any) {
        // We expect an error when trying to fetch a deleted assessment
        expect(error.message).toContain("Failed to get assessment");
      }

      // Verify the first assessment still exists
      const firstAssessment = await assessment.getAssessmentById(
        sharedState.firstAssessmentId as string
      );
      expect(firstAssessment.id).toBe(sharedState.firstAssessmentId);
    },
    TEST_TIMEOUT
  );

  test(
    "11. Delete the first assessment",
    async () => {
      const deleted = await assessment.deleteAssessment(
        sharedState.userId as string,
        sharedState.firstAssessmentId as string
      );

      expect(deleted).toBeTruthy();

      // Verify all assessments are deleted
      const assessments = await assessment.getAssessments();
      const hasAnyTestAssessment = assessments.some(
        (a) =>
          a.id === sharedState.firstAssessmentId ||
          a.id === sharedState.secondAssessmentId
      );
      expect(hasAnyTestAssessment).toBeFalsy();
    },
    TEST_TIMEOUT
  );

  // =====================
  // Token Persistence Test
  // =====================
  test(
    "12. Verify token is still valid after all operations",
    async () => {
      // Try to access a protected endpoint using the token set during login
      const isTokenValid = await auth.verifyToken();
      expect(isTokenValid).toBeTruthy(
        "Auth token should remain valid after all operations"
      );

      // Get current user as final verification
      const userData = await user.getCurrentUser();
      expect(userData.id).toBe(sharedState.userId);
    },
    TEST_TIMEOUT
  );
});
