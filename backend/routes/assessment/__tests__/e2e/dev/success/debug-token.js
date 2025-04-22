// Debug script for token generation and validation
import { createMockToken } from "../../../../../../test-utilities/testSetup.js";
import jwt from "jsonwebtoken";

// Generate a test token
const testUserId = `test-user-${Date.now()}`;
const testToken = createMockToken(testUserId);

// Decode the token without verification
const decoded = jwt.decode(testToken);

// Verify the token
try {
  const JWT_SECRET = process.env.JWT_SECRET || "dev-jwt-secret";
  const verified = jwt.verify(testToken, JWT_SECRET);
} catch (error) {
  console.error("Token verification failed:", error.message);
}
