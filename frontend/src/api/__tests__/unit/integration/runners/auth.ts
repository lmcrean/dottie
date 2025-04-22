/**
 * Authentication Utilities for Integration Tests
 *
 * This file contains helper functions for authentication-related operations
 * in integration tests, like user registration, login, and token management.
 */
import { api, setAuthToken } from "./apiClient";
import { AxiosError } from "axios";

interface UserData {
  username: string;
  email: string;
  password: string;
  [key: string]: any;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterResult {
  userId: string;
  userData: UserData;
  token: string | null;
}

/**
 * Register a new user
 * @param {UserData} userData - User data for registration
 * @returns {Promise<RegisterResult>} Result with user ID and token
 */
export async function registerUser(
  userData: UserData
): Promise<RegisterResult> {
  try {
    const response = await api.post("/api/auth/signup", userData);

    return {
      userId: response.data.id,
      userData: response.data,
      token: null, // We'll need to log in to get the token
    };
  } catch (error) {
    console.error(
      "Registration failed:",
      (error as AxiosError).response?.data || (error as Error).message
    );
    throw new Error(
      `Failed to register user: ${
        (error as AxiosError).response?.status || (error as Error).message
      }`
    );
  }
}

/**
 * Login with existing user credentials
 * @param {LoginCredentials} credentials - Login credentials
 * @returns {Promise<string>} Authentication token
 */
export async function loginUser(
  credentials: LoginCredentials
): Promise<string> {
  try {
    const response = await api.post("/api/auth/login", {
      email: credentials.email,
      password: credentials.password,
    });

    if (!response.data.token) {
      throw new Error("Invalid login response format: no token");
    }

    // Store the token for future requests
    setAuthToken(response.data.token);

    return response.data.token;
  } catch (error) {
    console.error(
      "Login failed:",
      (error as AxiosError).response?.data || (error as Error).message
    );
    throw new Error(
      `Failed to login: ${
        (error as AxiosError).response?.status || (error as Error).message
      }`
    );
  }
}

/**
 * Verify authentication token is valid
 * @returns {Promise<boolean>} True if token is valid
 */
export async function verifyToken(): Promise<boolean> {
  try {
    // Try to access a protected endpoint to verify the token

    const response = await api.get("/api/auth/users");
    return response.status === 200;
  } catch (error) {
    console.error(
      "Token verification error:",
      (error as AxiosError).response?.data || (error as Error).message
    );
    return false;
  }
}

/**
 * Generate unique test user data
 * @returns {UserData} User data for registration
 */
export function generateTestUser(): UserData {
  const timestamp = Date.now();
  return {
    username: `testuser-${timestamp}`,
    email: `test-${timestamp}@example.com`,
    password: "TestPassword123!",
  };
}
