// @ts-check
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import supertest from "supertest";
import db from "../../../../../db/index.js";
import app from "../../../../../server.js";
import { createServer } from "http";

// Test data
let server;
let request;
const TEST_PORT = 5003;

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
  } catch (error) {
    console.error("Error in test setup:", error);
    throw error;
  }
}, 30000); // Increased timeout

// Cleanup after all tests
afterAll(async () => {
  if (server) {
    await new Promise((resolve) => {
      server.close(() => {
        resolve(true);
      });
    });
  }
}, 30000); // Increased timeout

describe("User API Error Handling (E2E)", () => {
  // Test authentication errors
  it("should require authentication for user operations", async () => {
    // Try to get all users without authentication
    const getAllResponse = await request.get("/api/user");
    expect(getAllResponse.status).toBe(401);
    expect(getAllResponse.body).toHaveProperty("error");

    // Try to get a specific user without authentication
    const getUserResponse = await request.get("/api/user/me");
    expect(getUserResponse.status).toBe(401);
    expect(getUserResponse.body).toHaveProperty("error");

    // Try to update a user without authentication
    const updateResponse = await request
      .put("/api/user/me")
      .send({ username: "newname" });
    expect(updateResponse.status).toBe(401);
    expect(updateResponse.body).toHaveProperty("error");

    // Try to delete a user without authentication
    const deleteResponse = await request.delete("/api/user/me");
    expect(deleteResponse.status).toBe(401);
    expect(deleteResponse.body).toHaveProperty("error");
  });
});
