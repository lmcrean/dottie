// @ts-check
import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import supertest from 'supertest';
import app from '../../../../../../server.js';
import { createServer } from 'http';
import db from '../../../../../../db/index.js';

// Create a supertest instance
const request = supertest(app);

// Store server instance
let server;

// Use a different port for tests
const TEST_PORT = 5010;

// Initialize test database
async function initializeDatabase() {
  try {
    console.log('Initializing test database...');
    // Just check if we can connect to the database
    await db.raw('SELECT 1');
    console.log('Database connection successful');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Start server before all tests
beforeAll(async () => {
  // Initialize test database first
  console.log('Initializing database for signup tests...');
  const success = await initializeDatabase();
  if (!success) {
    throw new Error('Failed to initialize test database!');
  }
  
  server = createServer(app);
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.listen(TEST_PORT, () => {
      console.log(`Signup success test server started on port ${TEST_PORT}`);
      resolve(true);
    });
  });
}, 15000);

// Close server after all tests
afterAll(async () => {
  await new Promise(/** @param {(value: unknown) => void} resolve */ (resolve) => {
    server.close(() => {
      console.log('Signup success test server closed');
      resolve(true);
    });
  });
}, 15000);

describe("User Signup - Success Scenarios", () => {
  test("Should successfully create a new user with valid data", async () => {
    const userData = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: "Password123!",
      age: "18_24"
    };

    const response = await request
      .post("/api/auth/signup")
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body).toHaveProperty("email", userData.email);
    expect(response.body).toHaveProperty("username", userData.username);
  });

  test("Should accept valid password formats", async () => {
    const userData = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: "Complex_P@ssw0rd!",
      age: "25_34"
    };

    const response = await request
      .post("/api/auth/signup")
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
  });
}); 