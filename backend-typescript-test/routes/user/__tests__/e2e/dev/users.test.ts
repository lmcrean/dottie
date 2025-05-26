// @ts-check
import { describe, it, expect, beforeAll, afterAll } from "vitest";
import supertest from "supertest";
import db from "../../../../../db/index.js";
import app from "../../../../../server.js";
import { createServer } from "http";

// Test data
let server;
let request;
const TEST_PORT = 5002;

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
}, 30000); // Increase timeout

// Cleanup after all tests
afterAll(async () => {
  if (server) {
    await new Promise((resolve) => {
      server.close(() => {
        resolve(true);
      });
    });
  }
}, 30000); // Increase timeout

describe("API Health Check (E2E)", () => {
  // Test the API health endpoint
  it("should confirm API is operational", async () => {
    const response = await request.get("/api/health");

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("status", "ok");
    expect(response.body).toHaveProperty("environment");
  });

  // Test that authentication is required
  it("should require authentication for user endpoints", async () => {
    const response = await request.get("/api/user");

    expect(response.status).toBe(401);
  });
});
