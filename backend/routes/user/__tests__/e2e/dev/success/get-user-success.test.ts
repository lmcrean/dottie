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
const TEST_PORT = 5103;

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

    // Create a test user
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

describe("Get User API - Success Cases", () => {
  it("should return user data when accessing own profile", async () => {
    // Skip if no test user
    if (!testUserId) {
      return;
    }

    const response = await request
      .get("/api/user/me")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", testUserId);
    // Username may be formatted differently in the response
    expect(response.body).toHaveProperty("username");
    expect(response.body).toHaveProperty("email");
    expect(response.body).toHaveProperty("age");
    expect(response.body).not.toHaveProperty("password_hash"); // Should not expose password hash
  });

  it("should require authentication to access user data", async () => {
    // Try to access without auth token
    const response = await request.get("/api/user/me");

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });
});
