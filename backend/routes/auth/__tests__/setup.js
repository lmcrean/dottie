// Test setup file for initializing database
// Set test mode before importing db
process.env.TEST_MODE = "true";

import db from "../../../db/index.js";
import {
  createTables,
  dropTables,
} from "../../../db/migrations/initialSchema.js";
import bcrypt from "bcrypt";
import { generateUser } from "../../../test-utilities/testFixtures.js";

/**
 * Initialize the test database
 * This function will create the tables if they don't exist
 */
export async function initTestDatabase() {
  try {
    // First ensure we have a clean start for test database
    // Check if tables exist and recreate them if needed
    const hasUsersTable = await db.schema.hasTable("users");

    if (!hasUsersTable) {
      await createTables(db);

      // Seed with initial test data
      await seedTestData();
    }

    // Verify tables were created successfully
    const tablesExist = await Promise.all([
      db.schema.hasTable("users"),
      db.schema.hasTable("period_logs"),
      db.schema.hasTable("symptoms"),
      db.schema.hasTable("assessments"),
    ]);

    if (!tablesExist.every((exists) => exists)) {
      console.error("Failed to create all required tables!");
      // Force recreation of all tables
      await dropTables(db);
      await createTables(db);

      // Seed with initial test data
      await seedTestData();

      // Check again
      const tablesCreated = await db.schema.hasTable("users");
      if (!tablesCreated) {
        throw new Error("Failed to create database tables after retry!");
      }
    }

    return true;
  } catch (error) {
    console.error("Error setting up test database:", error);
    return false;
  }
}

/**
 * Seed the database with initial test data
 */
async function seedTestData() {
  try {
    // Create standard test users
    const testUsers = [
      generateUser({
        id: "test-user-1",
        username: "testuser1",
        email: "test1@example.com",
        password_hash: await bcrypt.hash("Password123!", 10),
      }),
      generateUser({
        id: "test-user-2",
        username: "testuser2",
        email: "test2@example.com",
        password_hash: await bcrypt.hash("Password123!", 10),
      }),
    ];

    // Insert users
    for (const user of testUsers) {
      await db("users").insert(user);
    }

    return true;
  } catch (error) {
    console.error("Error seeding test database:", error);
    return false;
  }
}

/**
 * Clear all data from the database tables
 */
export async function clearDatabase() {
  try {
    await db("assessments").delete();
    await db("symptoms").delete();
    await db("period_logs").delete();
    await db("users").delete();

    // Reseed with initial test data
    await seedTestData();

    return true;
  } catch (error) {
    console.error("Error clearing test database:", error);
    return false;
  }
}

/**
 * Create a test user in the database
 * @param {object} userData - User data to create
 * @returns {Promise<object|null>} - Created user or null
 */
export async function createTestUser(userData) {
  try {
    await db("users").insert(userData);
    const user = await db("users").where("id", userData.id).first();
    return user;
  } catch (error) {
    console.error("Error creating test user:", error);
    return null;
  }
}
