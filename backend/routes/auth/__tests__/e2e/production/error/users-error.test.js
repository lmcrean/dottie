// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../../../../../../server.js';
import { createServer } from 'http';
import jwt from 'jsonwebtoken';

// Create a supertest instance
const request = supertest(app);

// Store server instance
let server;
let testUserId;
let testToken;

// Use a different port for tests
const TEST_PORT = 5021;

// Create a mock token for testing
const createMockToken = (userId) => {
  return jwt.sign(
    { id: userId, email: `test_${Date.now()}@example.com` },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '1h' }
  );
};

// Start server before all tests
beforeAll(async () => {
  server = createServer(app);
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Users management error test server started on port ${TEST_PORT}`);
      resolve(true);
    });
  });
  
  // Create test user
  const userData = {
    username: `userserrortest_${Date.now()}`,
    email: `userserrortest_${Date.now()}@example.com`,
    password: "Password123!",
    age: "18_24"
  };

  const signupResponse = await request
    .post("/api/auth/signup")
    .send(userData);
  
  testUserId = signupResponse.body.id;
  
  // Create token for test user
  testToken = createMockToken(testUserId);
}, 15000);

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Users management error test server closed');
      resolve(true);
    });
  });
}, 15000);

describe("User Management - Error Scenarios", { tags: ['authentication', 'dev', 'error'] }, () => {
  test("GET /api/user/me - should reject request without valid token", async () => {
    const response = await request
      .get("/api/user/me")
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  test("PUT /api/user/me - should reject update with missing token", async () => {
    const updateData = {
      username: `updated_user_${Date.now()}`
    };

    const response = await request
      .put(`/api/user/me`)
      .send(updateData);
      // No Authorization header

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  test("DELETE /api/user/me - should reject delete with invalid token", async () => {
    const response = await request
      .delete(`/api/user/me`)
      .set("Authorization", "Bearer invalid-token");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  test("GET /api/auth/users - should reject request without token", async () => {
    const response = await request
      .get("/api/auth/users");
      // No Authorization header

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });
}); 