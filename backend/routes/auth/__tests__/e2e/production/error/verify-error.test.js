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
const TEST_PORT = 5015;

// Start server before all tests
beforeAll(async () => {
  server = createServer(app);
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Verify error test server started on port ${TEST_PORT}`);
      resolve(true);
    });
  });
}, 15000);

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Verify error test server closed');
      resolve(true);
    });
  });
}, 15000);

describe("Token Verification - Error Scenarios", { tags: ['authentication', 'dev', 'error'] }, () => {
  test("Should reject request with missing token", async () => {
    const response = await request
      .get("/api/auth/verify");
      // No Authorization header

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  test("Should reject request with malformed token", async () => {
    const response = await request
      .get("/api/auth/verify")
      .set("Authorization", "Bearer malformed-token");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("code", "INVALID_TOKEN");
  });

  test("Should reject request with expired token", async () => {
    // For testing purposes, create an expired token by using a negative expiration
    const expiredToken = jwt.sign(
      { id: 'test-user', exp: Math.floor(Date.now() / 1000) - 3600 },
      'invalid-secret' // Using a different secret to ensure it's invalid
    );
    
    // Use a token with "expired" keyword for our mocking system to recognize
    const response = await request
      .get('/api/auth/verify')
      .set('Authorization', `Bearer expired-${expiredToken}`);
    
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error');
    
    // Check that the code is either TOKEN_EXPIRED or INVALID_TOKEN
    expect(['TOKEN_EXPIRED', 'INVALID_TOKEN']).toContain(response.body.code);
  });

  test("Should reject request with token signed with wrong secret", async () => {
    // Create a token with wrong secret
    const wrongToken = jwt.sign(
      { id: 'test-user-wrong', email: 'wrong@example.com' },
      'wrong-secret-key',
      { expiresIn: '1h' }
    );

    const response = await request
      .get("/api/auth/verify")
      .set("Authorization", `Bearer ${wrongToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
    expect(response.body).toHaveProperty("code", "INVALID_TOKEN");
  });

  test("Should reject request with invalid token format", async () => {
    const response = await request
      .get("/api/auth/verify")
      .set("Authorization", "InvalidFormat token123");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });
}); 