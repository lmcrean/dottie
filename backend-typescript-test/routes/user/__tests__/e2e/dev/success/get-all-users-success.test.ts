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
let testUsers = [];
let accessToken;
const TEST_PORT = 5102;

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

    // Create a few test users
    const timestamp = Date.now();

    // User 1 - Regular user
    const user1 = {
      id: `test-user1-${timestamp}`,
      username: `testuser1_${timestamp}`,
      email: `test1_${timestamp}@example.com`,
      password_hash: "test-hash-1",
      age: "18_24",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // User 2 - Admin user
    const user2 = {
      id: `test-user2-${timestamp}`,
      username: `testuser2_${timestamp}`,
      email: `test2_${timestamp}@example.com`,
      password_hash: "test-hash-2",
      age: "25_34",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert test users
    await db("users").insert(user1);
    await db("users").insert(user2);

    // Store test users for cleanup
    testUsers.push(user1, user2);

    // Create JWT token for authentication using first user
    const secret = process.env.JWT_SECRET || "dev-jwt-secret";
    accessToken = jwt.sign({ userId: user1.id, email: user1.email }, secret, {
      expiresIn: "1h",
    });
  } catch (error) {
    console.error("Error in test setup:", error);
    throw error;
  }
}, 30000);

// Cleanup after all tests
afterAll(async () => {
  try {
    // Delete all test users
    if (testUsers.length > 0) {
      for (const user of testUsers) {
        await db("users").where("id", user.id).delete();
      }
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

describe("Get All Users API - Success Cases", () => {
  it("should return a list of users when authenticated", async () => {
    // Skip if we don't have authentication token
    if (!accessToken) {
      return;
    }

    const response = await request
      .get("/api/user")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);

    // We should have at least our test users
    expect(response.body.length).toBeGreaterThanOrEqual(testUsers.length);

    // Check that response contains our test users
    const testUserIds = testUsers.map((user) => user.id);
    const responseIds = response.body.map((user) => user.id);

    for (const id of testUserIds) {
      expect(responseIds).toContain(id);
    }

    // Verify password hashes are not returned
    for (const user of response.body) {
      expect(user).not.toHaveProperty("password_hash");
    }
  });

  it("should include common user properties in response", async () => {
    // Skip if we don't have authentication token
    if (!accessToken) {
      return;
    }

    const response = await request
      .get("/api/user")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);

    // Check that users have required properties
    for (const user of response.body) {
      expect(user).toHaveProperty("id");
      expect(user).toHaveProperty("username");
      expect(user).toHaveProperty("email");
      expect(user).toHaveProperty("age");

      // Verify data types
      expect(typeof user.id).toBe("string");
      expect(typeof user.username).toBe("string");
      expect(typeof user.email).toBe("string");
    }
  });
});
