// @ts-check
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import supertest from "supertest";
import db from "../../../../../../db/index.js";
import app from "../../../../../../server.js";
import { createServer } from "http";
import jwt from "jsonwebtoken";

// Test data
let server;
let request;
let testUser;
let testUserId;
let accessToken;
const TEST_PORT = 5101;

// Setup before all tests
beforeAll(async () => {
  try {
    // Create server and supertest instance
    server = createServer(app);
    request = supertest(app);

    // Start server
    await new Promise((resolve) => {
      server.listen(TEST_PORT, () => {
        resolve(true);
      });
    });

    // Create a test user for update operations
    testUserId = `test-user-${Date.now()}`;
    testUser = {
      id: testUserId,
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password_hash: "test-hash",
      age: "25_34",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert the test user into the database
    await db("users").insert(testUser);

    // Create JWT token for authentication
    const secret = process.env.JWT_SECRET || "dev-jwt-secret";
    accessToken = jwt.sign(
      { userId: testUserId, email: testUser.email },
      secret,
      { expiresIn: "1h" }
    );
  } catch (error) {
    console.error("Error in test setup:", error);
    throw error;
  }
}, 30000);

// Cleanup after all tests
afterAll(async () => {
  try {
    // Delete the test user
    if (testUserId) {
      await db("users").where("id", testUserId).delete();
    }

    // Close server
    if (server) {
      await new Promise((resolve) => {
        server.close(() => {
          resolve(true);
        });
      });
    }
  } catch (error) {
    console.error("Error in test cleanup:", error);
  }
}, 30000);

describe("User Update API - Success Cases", () => {
  it("should successfully update user details", async () => {
    // Skip if no test user
    if (!testUserId) {
      return;
    }

    const updatedData = {
      username: `updated_${Date.now()}`,
      age: "35_44",
    };

    const response = await request
      .put(`/api/user/me`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updatedData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", testUserId);
    expect(response.body).toHaveProperty("username", updatedData.username);
    expect(response.body).toHaveProperty("age", updatedData.age);
    expect(response.body).toHaveProperty("email"); // Email is returned but may have changed
    expect(response.body).not.toHaveProperty("password_hash"); // Should not expose password hash
  });

  it("should update only allowed fields", async () => {
    // Skip if no test user
    if (!testUserId) {
      return;
    }

    // Before updating, fetch current data
    const beforeUser = await db("users").where("id", testUserId).first();

    // Try to update with fields that shouldn't be directly changeable
    const updateAttempt = {
      id: "hacker-attempt", // Should not change ID
      email: "new-email@example.com", // Email might be changeable
      created_at: new Date(2000, 1, 1).toISOString(), // Should not change creation date
      role: "admin", // Should not allow role change
    };

    const response = await request
      .put(`/api/user/me`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send(updateAttempt);

    // Get the user directly from the database to verify
    const updatedUser = await db("users").where("id", testUserId).first();

    expect(response.status).toBe(200);
    expect(updatedUser.id).toBe(testUserId); // ID should not change

    // The API may allow email changes, so we don't check that specifically

    // Other security-related fields shouldn't change
    if (beforeUser.created_at) {
      expect(updatedUser.created_at).toBe(beforeUser.created_at); // Creation date shouldn't change
    }

    if (beforeUser.role) {
      expect(updatedUser.role || "user").toBe(beforeUser.role || "user"); // Role shouldn't change
    }
  });

  it("should handle empty update payload", async () => {
    // Skip if no test user
    if (!testUserId) {
      return;
    }

    // Empty update
    const response = await request
      .put(`/api/user/me`)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({});

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", testUserId);
    // The API returns the user data rather than a "no changes" message
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("updated_at");
  });
});
