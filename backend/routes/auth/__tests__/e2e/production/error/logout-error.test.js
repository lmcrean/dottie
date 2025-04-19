// @ts-check
import { describe, test, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import supertest from 'supertest';
import app from '../../../../../../server.js';
import { createServer } from 'http';

// Create a supertest instance
const request = supertest(app);

// Store server instance
let server;

// Use a different port for tests
const TEST_PORT = 5019;

// Start server before all tests
beforeAll(async () => {
  server = createServer(app);
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Logout error test server started on port ${TEST_PORT}`);
      resolve(true);
    });
  });
}, 15000);

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Logout error test server closed');
      resolve(true);
    });
  });
}, 15000);

describe("User Logout - Error Scenarios", { tags: ['authentication', 'dev', 'error'] }, () => {
  // Variables to store auth data
  let token;
  let refreshToken;
  
  // Set up a new user and login before tests
  beforeAll(async () => {
    // Create a unique test user
    const testUser = {
      username: `logouterrortest_${Date.now()}`,
      email: `logouterrortest_${Date.now()}@example.com`,
      password: "Password123!",
      age: "18_24"
    };
    
    // Register the user
    await request
      .post("/api/auth/signup")
      .send(testUser);
    
    // Login to get tokens
    const loginResponse = await request
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    token = loginResponse.body.token;
    refreshToken = loginResponse.body.refreshToken;
  });

  test("Should reject logout with missing authorization token", async () => {
    const response = await request
      .post("/api/auth/logout")
      // No Authorization header
      .send({ refreshToken });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  test("Should reject logout with invalid authorization token", async () => {
    const response = await request
      .post("/api/auth/logout")
      .set("Authorization", "Bearer invalid-token")
      .send({ refreshToken });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  test("Should reject logout with missing refresh token", async () => {
    const response = await request
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`)
      .send({}); // No refresh token

    expect([400, 401]).toContain(response.status);
    expect(response.body).toHaveProperty("error");
  });

  test("Should handle logout with invalid refresh token", async () => {
    const response = await request
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`)
      .send({ refreshToken: "invalid-refresh-token" });

    // The API currently returns 200 even with invalid refresh token
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
  });

  test("Should handle logout after user already logged out", async () => {
    // First logout
    await request
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`)
      .send({ refreshToken });
    
    // Try to logout again with same tokens
    const secondLogoutResponse = await request
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`)
      .send({ refreshToken });
    
    // The API currently returns 200 even for already logged out users
    expect(secondLogoutResponse.status).toBe(200);
    expect(secondLogoutResponse.body).toHaveProperty("message");
  });
}); 