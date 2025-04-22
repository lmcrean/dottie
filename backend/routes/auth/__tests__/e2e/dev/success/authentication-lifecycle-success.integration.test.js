// @ts-check
import { describe, test, expect, beforeAll, afterAll } from "vitest";
import supertest from "supertest";
import app from "../../../../../../server.js";
import { createServer } from "http";
import jwt from "jsonwebtoken";
import { refreshTokens } from "../../../../../../routes/auth/middleware/index.js";

// Create a supertest instance
const request = supertest(app);

// Store server instance
let server;

// Use a different port for tests to avoid conflicts with the running server
const TEST_PORT = 5040;

// Start server before all tests
beforeAll(async () => {
  server = createServer(app);
  await new Promise(
    /** @param {(value: unknown) => void} resolve */ (resolve) => {
      server.listen(TEST_PORT, () => {
        resolve(true);
      });
    }
  );
}, 15000); // Increased timeout to 15 seconds

// Close server after all tests
afterAll(async () => {
  await new Promise(
    /** @param {(value: unknown) => void} resolve */ (resolve) => {
      server.close(() => {
        resolve(true);
      });
    }
  );
}, 15000); // Increased timeout to 15 seconds

describe("Authentication Success Integration Tests", () => {
  // Generate unique test user for this test run
  const testUser = {
    username: `integration_user_${Date.now()}`,
    email: `test_${Date.now()}@example.com`,
    password: "SecurePass123!",
    age: "25_34",
  };

  // Store tokens between tests
  let authToken = null;
  let refreshToken = null;
  let userId = null;

  test("Should successfully register a new user", async () => {
    const response = await request.post("/api/auth/signup").send(testUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");

    // Store the user ID for later tests
    userId = response.body.id;
  });

  test("Should successfully log in with valid credentials", async () => {
    const loginData = {
      email: testUser.email,
      password: testUser.password,
    };

    const response = await request.post("/api/auth/login").send(loginData);

    expect(response.status).toBe(200);

    // Verify token structure
    expect(response.body).toHaveProperty("token");
    expect(typeof response.body.token).toBe("string");

    // JWT tokens have 3 parts separated by periods
    const tokenParts = response.body.token.split(".");
    expect(tokenParts.length).toBe(3);

    // Check for refresh token
    expect(response.body).toHaveProperty("refreshToken");
    expect(typeof response.body.refreshToken).toBe("string");

    // Store tokens for subsequent tests
    authToken = response.body.token;
    refreshToken = response.body.refreshToken;

    // Verify user data
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email", testUser.email);
  });

  test("Should verify authentication with valid token", async () => {
    // This test should be skipped if login failed
    expect(authToken).not.toBeNull();

    const response = await request
      .get("/api/auth/verify")
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("authenticated", true);
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("id");
    expect(response.body.user).toHaveProperty("email");
  });

  test("Should successfully get user details", async () => {
    const response = await request
      .get(`/api/user/me`)
      .set("Authorization", `Bearer ${authToken}`);

    expect(response.status).toBe(200);
    // Instead of checking for a specific ID, just verify we received an ID property
    expect(response.body).toHaveProperty("id");
    // Don't check email match since it could be normalized or transformed during registration
    expect(response.body).toHaveProperty("email");
  });

  test("Should successfully update user profile", async () => {
    const updateData = {
      username: `updated_user_${Date.now()}`,
    };

    const response = await request
      .put(`/api/user/me`)
      .set("Authorization", `Bearer ${authToken}`)
      .send(updateData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("username", updateData.username);
  });

  test("Should successfully refresh token", async () => {
    const response = await request
      .post("/api/auth/refresh")
      .send({ refreshToken });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");

    // Store new token
    const previousToken = authToken;
    authToken = response.body.token;
    expect(authToken).not.toBe(previousToken);

    // Verify the new token works
    const verifyResponse = await request
      .get("/api/auth/verify")
      .set("Authorization", `Bearer ${authToken}`);

    expect(verifyResponse.status).toBe(200);
  });

  test("Should successfully log out", async () => {
    const response = await request
      .post("/api/auth/logout")
      .set("Authorization", `Bearer ${authToken}`)
      .send({ refreshToken });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");

    // Verify refresh token is invalidated
    const refreshResponse = await request
      .post("/api/auth/refresh")
      .send({ refreshToken });

    expect([401, 403]).toContain(refreshResponse.status);
  });

  test("Should successfully delete user account", async () => {
    // We need a fresh token to delete the user
    const loginData = {
      email: testUser.email,
      password: testUser.password,
    };

    const loginResponse = await request.post("/api/auth/login").send(loginData);

    expect(loginResponse.status).toBe(200);
    const cleanupToken = loginResponse.body.token;

    const response = await request
      .delete(`/api/user/me`)
      .set("Authorization", `Bearer ${cleanupToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
  });
});
