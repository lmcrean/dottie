import { test, expect } from "@playwright/test";
import { v4 as uuidv4 } from "uuid";

/**
 * Common setup and utilities for assessment API endpoint tests
 */

// Test user data with unique values to avoid conflicts
const timestamp = Date.now();
const testUser = {
  username: `assessuser-${timestamp}`,
  email: `assess-${timestamp}@example.com`,
  password: "Password123!",
};

// Sample assessment data
const assessmentData = {
  assessmentData: {
    age: "18_24",
    cycleLength: "26_30",
    periodDuration: "4_5",
    flowHeaviness: "moderate",
    painLevel: "moderate",
    symptoms: {
      physical: ["Bloating", "Headaches"],
      emotional: ["Mood swings", "Irritability"],
    },
  },
};

/**
 * Setup function to create a user and get auth token
 * This uses mock values instead of making actual API calls
 */
async function setupUser(request) {
  // Create mock values
  const userId = uuidv4();
  const authToken = `mock_token_${timestamp}`;

  return { authToken, userId };
}

export { testUser, assessmentData, setupUser };
