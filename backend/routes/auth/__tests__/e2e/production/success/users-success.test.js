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
const TEST_PORT = 5020;

// Create a mock token for testing
const createMockToken = (userId) => {
  return jwt.sign(
    { userId: userId, email: `test_${Date.now()}@example.com` },
    process.env.JWT_SECRET || 'dev-jwt-secret',
    { expiresIn: '1h' }
  );
};

// Start server before all tests
beforeAll(async () => {
  server = createServer(app);
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Users management success test server started on port ${TEST_PORT}`);
      resolve(true);
    });
  });
  
  // Create test user
  const userData = {
    username: `usersmgmttest_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: "Password123!",
    age: "18_24"
  };

  const signupResponse = await request
    .post("/api/auth/signup")
    .send(userData);
  
  testUserId = `test-user-${Date.now()}`;
  
  // Create token for test user
  testToken = createMockToken(testUserId);
}, 15000);

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Users management success test server closed');
      resolve(true);
    });
  });
}, 15000);

describe("User Management - Success Scenarios", () => {
  test("GET /api/auth/users - should return list of users", async () => {
    const response = await request
      .get("/api/auth/users")
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("GET /api/user/me - should return current user", async () => {
    const response = await request
      .get(`/api/user/me`)
      .set("Authorization", `Bearer ${testToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", testUserId);
  });

  test("PUT /api/user/me - should update user", async () => {
    const updateData = {
      username: `updated_user_${Date.now()}`
    };

    const response = await request
      .put(`/api/user/me`)
      .set("Authorization", `Bearer ${testToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("username", updateData.username);
  });

  test("DELETE /api/user/me - should delete user", async () => {
    // Create a user to delete
    const deleteUserData = {
      username: `delete_user_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: "Password123!",
      age: "18_24"
    };

    const createResponse = await request
      .post("/api/auth/signup")
      .send(deleteUserData);
    
    const userIdToDelete = `test-user-${Date.now()}`;
    const deleteToken = createMockToken(userIdToDelete);

    // Delete the user
    const response = await request
      .delete(`/api/user/me`)
      .set("Authorization", `Bearer ${deleteToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("deleted");
  });
}); 