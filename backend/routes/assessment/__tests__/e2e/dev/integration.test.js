// @ts-check
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import supertest from "supertest";
import { db } from "../../../../../db/index.js";
import jwt from "jsonwebtoken";
import app from "../../../../../server.js";

// Store test data
let testUserId;
let testToken;
let testAssessmentId;
let request;

// Test assessment data
const testAssessmentData = {
  age: "25-plus",
  pattern: "regular",
  cycle_length: "26-30",
  period_duration: "4-5",
  flow_heaviness: "moderate",
  pain_level: "mild",
  physical_symptoms: ["Bloating", "Headaches", "Cramps"],
  emotional_symptoms: ["Mood swings", "Irritability"],
};

// Setup before tests
beforeAll(async () => {
  try {
    // Create supertest request object
    request = supertest(app);

    // Create a test user
    testUserId = `test-user-${Date.now()}`;
    const userData = {
      id: testUserId,
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password_hash: "test-hash",
      age: "25-plus",
      created_at: new Date().toISOString(),
    };

    // Insert using raw query to avoid type issues
    await db.raw(
      `INSERT INTO users (id, username, email, password_hash, age, created_at) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        userData.id,
        userData.username,
        userData.email,
        userData.password_hash,
        userData.age,
        userData.created_at
      ]
    );

    // Create a JWT token
    const secret = process.env.JWT_SECRET || "dev-jwt-secret";
    testToken = jwt.sign(
      { userId: testUserId, email: userData.email },
      secret,
      { expiresIn: "1h" }
    );
  } catch (error) {
    console.error("Error in test setup:", error);
    throw error;
  }
});

// Cleanup after tests
afterAll(async () => {
  try {
    // Clean up test data
    if (testAssessmentId) {
      try {
        // Use raw query to delete
        await db.raw("DELETE FROM assessments WHERE id = ?", [testAssessmentId]);
      } catch (error) {
        console.log(`Error deleting assessment ${testAssessmentId}:`, error);
      }
    }
    
    if (testUserId) {
      try {
        // Use raw query to delete
        await db.raw("DELETE FROM users WHERE id = ?", [testUserId]);
      } catch (error) {
        console.log(`Error deleting user ${testUserId}:`, error);
      }
    }
  } catch (error) {
    console.error("Error in test cleanup:", error);
  }
});

describe("Assessment API Integration Test", () => {
  test("Complete assessment lifecycle flow - create, get, list, delete", async () => {
    console.log("Starting assessment lifecycle test...");
    
    // Step 1: Create a new assessment
    console.log("Step 1: Creating assessment...");
    const createResponse = await request
      .post("/api/assessment/send")
      .set("Authorization", `Bearer ${testToken}`)
      .send({ assessmentData: testAssessmentData });
    
    console.log("Create response status:", createResponse.status);
    console.log("Create response body:", createResponse.body);

    // Validate assessment creation
    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty("id");
    
    // Store the assessment ID for subsequent steps
    testAssessmentId = createResponse.body.id;
    console.log(`Created assessment with ID: ${testAssessmentId}`);

    // Step 2: Get the assessment details
    console.log("Step 2: Getting assessment details...");
    const getResponse = await request
      .get(`/api/assessment/${testAssessmentId}`)
      .set("Authorization", `Bearer ${testToken}`);
    
    console.log("Get response status:", getResponse.status);
    console.log("Get response body:", getResponse.body);

    // Validate get assessment detail
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toHaveProperty("id", testAssessmentId);
    
    // Verify assessment data matches what we created
    if (getResponse.body.assessmentData) {
      // Handling nested format
      expect(getResponse.body.assessmentData.age).toBe(testAssessmentData.age);
      expect(getResponse.body.assessmentData.cycle_length || getResponse.body.assessmentData.cycleLength)
        .toBe(testAssessmentData.cycle_length);
    } else {
      // Handling flattened format
      expect(getResponse.body.age).toBe(testAssessmentData.age);
      expect(getResponse.body.cycle_length || getResponse.body.cycleLength)
        .toBe(testAssessmentData.cycle_length);
    }

    // Step 3: List all user assessments
    console.log("Step 3: Listing all user assessments...");
    const listResponse = await request
      .get("/api/assessment/list")
      .set("Authorization", `Bearer ${testToken}`);
    
    console.log("List response status:", listResponse.status);
    console.log("List response body:", listResponse.body);

    // Validate assessment list
    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body)).toBe(true);
    
    // Find our created assessment in the list
    const foundAssessment = listResponse.body.find(a => a.id === testAssessmentId);
    expect(foundAssessment).toBeTruthy();

    // Step 4: Delete the assessment
    console.log("Step 4: Deleting assessment...");
    const deleteResponse = await request
      .delete(`/api/assessment/${testUserId}/${testAssessmentId}`)
      .set("Authorization", `Bearer ${testToken}`);
    
    console.log("Delete response status:", deleteResponse.status);
    console.log("Delete response body:", deleteResponse.body);

    // Validate assessment deletion
    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toHaveProperty("message", "Assessment deleted successfully");
    
    // Verify assessment no longer exists - the API returns 403 when the assessment doesn't exist
    const verifyResponse = await request
      .get(`/api/assessment/${testAssessmentId}`)
      .set("Authorization", `Bearer ${testToken}`);
    
    expect(verifyResponse.status).toBe(403);
    
    console.log("Assessment lifecycle test completed successfully!");
  });
}); 