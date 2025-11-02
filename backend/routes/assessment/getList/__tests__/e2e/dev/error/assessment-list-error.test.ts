// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import { setupTestServer, closeTestServer } from '../../../../../../../test-utilities/testSetup.js';

// Variables to store server instance and request
let server;
let request;
const TEST_PORT = 5007;

// Setup server before tests
beforeAll(async () => {
  const setup = await setupTestServer(TEST_PORT);
  server = setup.server;
  request = supertest(setup.app);
}, 15000);

// Close server after tests
afterAll(async () => {
  await closeTestServer(server);
}, 15000);

describe("Assessment List Endpoint - Error Cases", { tags: ['assessment', 'dev'] }, () => {
  // Test getting assessments without authentication
  test("GET /api/assessment/list - should reject request without token", async () => {
    const response = await request.get("/api/assessment/list");
    expect(response.status).toBe(401);
  });

  // Test with invalid token
  test("GET /api/assessment/list - should reject request with invalid token", async () => {
    const response = await request
      .get("/api/assessment/list")
      .set("Authorization", "Bearer invalid_token");

    // API rejects invalid tokens with 401
    expect(response.status).toBe(401);
  });

  // Test with expired token
  test("GET /api/assessment/list - should reject request with expired token", async () => {
    // This is a known expired token format
    const expiredToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QtdXNlci1pZCIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjM5MDIyfQ.7fgfDJJWJLDdJ-LXi9mEI6QCqFQfJOaXUzaLhiEXYmM";
    
    const response = await request
      .get("/api/assessment/list")
      .set("Authorization", `Bearer ${expiredToken}`);

    // API rejects expired tokens with 401
    expect(response.status).toBe(401);
  });
}); 