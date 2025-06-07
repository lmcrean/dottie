// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { setupTestServer, closeTestServer, createMockToken } from '../../../../../../../test-utilities/testSetup.js';

// Variables to store server instance and request
let server;
let request;
let testUserId;
let testToken;
const TEST_PORT = 5015;

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
  await closeTestServer(server);
}, 15000);

describe("Assessment Detail Error Tests", () => {
  // Test getting assessment without authentication
  test("GET /api/assessment/:id - should reject request without token", async () => {
    const nonExistentId = `non-existent-id-${Date.now()}`;
    const response = await request.get(`/api/assessment/${nonExistentId}`);
    expect(response.status).toBe(401);
  });

  // Test getting non-existent assessment with token
  test("GET /api/assessment/:id - should handle non-existent assessment", async () => {
    const nonExistentId = `non-existent-id-${Date.now()}`;
    const response = await request
      .get(`/api/assessment/${nonExistentId}`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(403); // API returns 403 Forbidden for non-existent assessment
  });

  // Test getting assessment with invalid ID format
  test("GET /api/assessment/:id - should handle invalid ID format", async () => {
    const response = await request
      .get("/api/assessment/invalid-id-format")
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(403); // API returns 403 Forbidden for invalid ID format
  });
}); 