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
let accessTokens = {};
const TEST_PORT = 5104;

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

    // Create test users
    const timestamp = Date.now();

    // User 1 for deletion by self
    const deleteUser = {
      id: `delete-user-${timestamp}`,
      username: `deleteuser_${timestamp}`,
      email: `delete_${timestamp}@example.com`,
      password_hash: "test-hash-1",
      age: "18_24",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // User 2 - For testing access control
    const targetUser = {
      id: `target-user-${timestamp}`,
      username: `targetuser_${timestamp}`,
      email: `target_${timestamp}@example.com`,
      password_hash: "test-hash-2",
      age: "25_34",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert test users
    await db("users").insert(deleteUser);
    await db("users").insert(targetUser);

    // Store test users for cleanup
    testUsers.push(deleteUser, targetUser);

    // Create JWT tokens for authentication
    const secret = process.env.JWT_SECRET || "dev-jwt-secret";

    // Token for the first user
    accessTokens.user1 = jwt.sign(
      { userId: deleteUser.id, email: deleteUser.email },
      secret,
      { expiresIn: "1h" }
    );

    // Token for the second user
    accessTokens.user2 = jwt.sign(
      { userId: targetUser.id, email: targetUser.email },
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
    // Delete any remaining test users
    if (testUsers.length > 0) {
      for (const user of testUsers) {
        try {
          await db("users").where("id", user.id).delete();
        } catch (err) {
          // User might have been deleted by the test
        }
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

describe("Delete User API - Success Cases", () => {
  it("should successfully delete own user account", async () => {
    // Skip if users array is empty
    if (testUsers.length === 0) {
      return;
    }

    const deleteUser = testUsers.find((user) =>
      user.id.startsWith("delete-user-")
    );
    if (!deleteUser) {
      return;
    }

    // First check if the user exists
    const userBeforeDelete = await db("users")
      .where("id", deleteUser.id)
      .first();
    expect(userBeforeDelete).not.toBeUndefined();

    // Delete the user
    const response = await request
      .delete(`/api/user/me`)
      .set("Authorization", `Bearer ${accessTokens.user1}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("message");
    expect(response.body.message).toContain("deleted");

    // Verify the user is actually deleted from the database
    const userAfterDelete = await db("users")
      .where("id", deleteUser.id)
      .first();
    expect(userAfterDelete).toBeUndefined();

    // Remove this user from the array so we don't try to delete it again in cleanup
    testUsers = testUsers.filter((user) => user.id !== deleteUser.id);
  });

  it("should prevent accessing /me with invalid tokens (access control)", async () => {
    // Skip if users array is empty
    if (testUsers.length === 0) {
      return;
    }

    const targetUser = testUsers.find((user) =>
      user.id.startsWith("target-user-")
    );
    if (!targetUser) {
      return;
    }

    // Create an invalid token
    const invalidToken = "invalid-token-12345";

    // Try to access /me with invalid token
    const response = await request
      .get(`/api/user/me`)
      .set("Authorization", `Bearer ${invalidToken}`);

    // The API should reject invalid tokens with 401 Unauthorized
    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");
  });

  it("should require authentication to delete user", async () => {
    // Create a new test user just for this test
    const timestamp = Date.now();
    const testUser = {
      id: `auth-test-user-${timestamp}`,
      username: `authtest_${timestamp}`,
      email: `authtest_${timestamp}@example.com`,
      password_hash: "test-hash-3",
      age: "35_44",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert the test user
    await db("users").insert(testUser);
    testUsers.push(testUser);

    // Try to delete without authorization
    const response = await request.delete(`/api/user/me`);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty("error");

    // Verify the user still exists in the database
    const userAfterAttempt = await db("users").where("id", testUser.id).first();
    expect(userAfterAttempt).not.toBeUndefined();
  });
});
