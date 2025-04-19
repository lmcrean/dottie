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

// Use a different port for tests
const TEST_PORT = 5017;

// Start server before all tests
beforeAll(async () => {
  server = createServer(app);
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Refresh token error test server started on port ${TEST_PORT}`);
      resolve(true);
    });
  });
}, 15000);

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Refresh token error test server closed');
      resolve(true);
    });
  });
}, 15000);

describe("Token Refresh - Error Scenarios", { tags: ['authentication', 'dev', 'error'] }, () => {
  test("Should reject request with missing refresh token", async () => {
    const response = await request
      .post("/api/auth/refresh")
      .send({}); // No refresh token

    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("error");
  });

  test("Should reject request with invalid refresh token", async () => {
    const response = await request
      .post("/api/auth/refresh")
      .send({ refreshToken: "invalid-token-format" });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  test("Should reject request with expired refresh token", async () => {
    // Create an expired token
    const expiredRefreshToken = jwt.sign(
      { id: 'test-refresh-expired', email: 'refresh-expired@example.com', type: 'refresh' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '0s' } // Expires immediately
    );

    // Wait a moment to ensure expiration
    await new Promise(resolve => setTimeout(resolve, 1000));

    const response = await request
      .post("/api/auth/refresh")
      .send({ refreshToken: expiredRefreshToken });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  test("Should reject request with revoked refresh token", async () => {
    // Create a test user to generate a token
    const testUser = {
      username: `refreshrevoketest_${Date.now()}`,
      email: `refreshrevoketest_${Date.now()}@example.com`,
      password: "Password123!",
      age: "18_24"
    };

    // Register the user
    await request
      .post("/api/auth/signup")
      .send(testUser);
    
    // Login to get refresh token
    const loginResponse = await request
      .post("/api/auth/login")
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    const refreshToken = loginResponse.body.refreshToken;
    const token = loginResponse.body.token;
    
    // Logout to revoke the refresh token
    await request
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${token}`)
      .send({ refreshToken });
    
    // Try to use the revoked refresh token
    const response = await request
      .post("/api/auth/refresh")
      .send({ refreshToken });
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });
}); 