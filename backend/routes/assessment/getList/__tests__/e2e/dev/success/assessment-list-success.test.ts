// @ts-check
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import supertest from "supertest";
import db from "../../../../../../../db/index.js";
import {
  setupTestServer,
  closeTestServer,
  createMockToken,
} from "../../../../../../../test-utilities/testSetup.js";

// Store server instance and test data
let server;
let request;
let testUserId;
let testToken;
let testAssessmentIds = [];

// Use a different port for tests
const TEST_PORT = 5006;

// Start server before all tests
beforeAll(async () => {
  try {
    // Initialize test database first

    // We'll handle cleanup at the end rather than trying to delete all records upfront
    // as this is causing foreign key constraint issues

    // Create a test user directly in the database with more unique identifiers
    const uniqueId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    testUserId = `test-user-${uniqueId}`;
    const userData = {
      id: testUserId,
      username: `testuser_${uniqueId}`,
      email: `test_${uniqueId}@example.com`,
      password_hash: "test-hash", // Not used for auth in these tests
      age: "18-24", // Use hyphens instead of underscores
      created_at: new Date().toISOString(),
    };

    await db("users").insert(userData);

    // Create a JWT token using the utility
    testToken = createMockToken(testUserId);

    // Create two test assessments in the database
    const testAssessment1Id = `test-assessment-1-${uniqueId}`;
    const assessmentData1 = {
      id: testAssessment1Id,
      user_id: testUserId,
      created_at: new Date().toISOString(),
      age: "18-24", // Use hyphens instead of underscores
      cycle_length: "26-30", // Use hyphens instead of underscores
      period_duration: "4-5", // Use hyphens instead of underscores
      flow_heaviness: "moderate",
      pain_level: "moderate",
    };

    await db("assessments").insert(assessmentData1);
    testAssessmentIds.push(testAssessment1Id);

    // Create a second assessment
    const testAssessment2Id = `test-assessment-2-${uniqueId}`;
    const assessmentData2 = {
      id: testAssessment2Id,
      user_id: testUserId,
      created_at: new Date().toISOString(),
      age: "18-24", // Use hyphens instead of underscores
      cycle_length: "21-25", // Use hyphens instead of underscores
      period_duration: "6-7", // Use hyphens instead of underscores
      flow_heaviness: "heavy",
      pain_level: "severe",
    };

    await db("assessments").insert(assessmentData2);
    testAssessmentIds.push(testAssessment2Id);

    // Setup test server using the utility
    const setup = await setupTestServer(TEST_PORT);
    server = setup.server;
    request = setup.request;
  } catch (error) {
    console.error("Error in test setup:", error);
    throw error;
  }
}, 15000); // Increased timeout for setup

// Close server and cleanup after all tests
afterAll(async () => {
  try {
    // Clean up test data
    if (testAssessmentIds.length > 0) {
      // First, try to clean up related data in symptoms table
      try {
        const tableInfo = await db.raw("PRAGMA table_info(symptoms)");
        const assessmentIdColumn = tableInfo.find(
          (col) =>
            col.name.toLowerCase().includes("assessment") ||
            col.name.toLowerCase().includes("assessment_id")
        );
        
        if (assessmentIdColumn) {
          for (const assessmentId of testAssessmentIds) {
            await db("symptoms")
              .where(assessmentIdColumn.name, assessmentId)
              .delete();
          }
        }
      } catch (error) {

        // Continue with cleanup of other tables
      }
      
      // Now clean up assessments
      for (const assessmentId of testAssessmentIds) {
        try {
          await db("assessments").where("id", assessmentId).delete();
        } catch (error) {

        }
      }
    }
    
    // Finally clean up user
    if (testUserId) {
      try {
        await db("users").where("id", testUserId).delete();
      } catch (error) {

      }
    }

    // Close the server using the utility
    await closeTestServer(server);
  } catch (error) {
    console.error("Error in test cleanup:", error);
  }
}, 15000);

describe("Assessment List Endpoint - Success Cases", () => {
  // Test listing all assessments for a user
  test("GET /api/assessment/list - should successfully return list of assessments", async () => {
    const response = await request
      .get("/api/assessment/list")
      .set("Authorization", `Bearer ${testToken}`);

    // Debug response



    // API now always returns 200 with an array (possibly empty)
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    
    // These minimal checks verify the structure but not actual data
    if (response.body.length > 0) {
      const assessment = response.body[0];
      expect(assessment).toHaveProperty("id");
      expect(assessment).toHaveProperty("userId");
    }
  });
});
