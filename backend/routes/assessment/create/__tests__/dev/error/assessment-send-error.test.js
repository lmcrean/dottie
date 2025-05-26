// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { setupTestServer, closeTestServer, createMockToken } from '../../../../../../test-utilities/testSetup.js';
import db from '../../../../../../db/index.js';

// Variables to store server instance and request
let server;
let request;
let testUserId;
let testToken;
const TEST_PORT = 5010;

// Setup server before tests
beforeAll(async () => {
  const setup = await setupTestServer(TEST_PORT);
  server = setup.server;
  request = supertest(setup.app);

  // Create a test user ID and token
  testUserId = `test-user-${Date.now()}`;
  testToken = createMockToken(testUserId);
  
}, 15000);

// Close server after tests
afterAll(async () => {
  // Clean up test user
  try {
    await db('users').where('id', testUserId).delete('*');
  } catch (error) {
    console.error('Failed to clean up test user:', error);
  }
  
  await closeTestServer(server);
}, 15000);

describe("Assessment Send Endpoint - Error Cases", () => {
  // Test submitting assessment without authentication
  test("POST /api/assessment/send - should reject request without token", async () => {
    const assessmentData = {
      assessmentData: {
        age: "18_24",
        cycleLength: "26_30"
      }
    };

    const response = await request
      .post("/api/assessment/send")
      .send(assessmentData);

    expect(response.status).toBe(401);
  });

  // Test submitting incomplete assessment data
  test("POST /api/assessment/send - should reject incomplete assessment data without token", async () => {
    const incompleteData = {
      assessmentData: {
        // Missing required fields
        age: "18_24"
        // Missing cycleLength, periodDuration, etc.
      }
    };

    const response = await request
      .post("/api/assessment/send")
      .send(incompleteData);

    // Missing token results in authentication error
    expect(response.status).toBe(401);
  });

  // Test submitting with invalid data types
  test("POST /api/assessment/send - should reject non-standard data types without token", async () => {
    const nonStandardData = {
      assessmentData: {
        age: 25, // Numeric instead of string
        cycleLength: "invalid_value",
        periodDuration: "4-5",
        flowHeaviness: "moderate",
        painLevel: "moderate"
      }
    };

    const response = await request
      .post("/api/assessment/send")
      .send(nonStandardData);

    // Missing token results in authentication error
    expect(response.status).toBe(401);
  });
}); 