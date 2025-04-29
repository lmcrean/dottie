import { test, expect } from "@playwright/test";

/**
 * Integration test for all authentication API endpoints
 *
 * This test runs endpoints in sequence to test the complete
 * authentication flow from signup to logout.
 */

// Create unique test user for this integration test
const timestamp = Date.now();
const testUser = {
  username: `integ-user-${timestamp}`,
  email: `integ_user-${timestamp}@example.com`,
  password: "SecurePass123!",
};

// Store auth data between tests
let authToken;
let userId;
let refreshToken;

test.describe("Authentication Flow Integration", () => {
  test("1. Signup - should register a new user", async ({ request }) => {
    const response = await request.post("/api/auth/signup", {
      data: {
        username: testUser.username,
        email: testUser.email,
        password: testUser.password,
      },
    });

    expect(response.status()).toBeLessThan(300);

    const data = await response.json();

    // Handle different response formats
    if (data.id) {
      expect(data).toHaveProperty("id");
      expect(data).toHaveProperty("username", testUser.username);
      expect(data).toHaveProperty("email", testUser.email);
      userId = data.id;
    } else if (data.user && data.user.id) {
      expect(data).toHaveProperty("message");
      expect(data.user).toHaveProperty("id");
      userId = data.user.id;
    }

    expect(userId).toBeDefined();
  });

  test("2. Login - should authenticate and return token", async ({
    request,
  }) => {
    const response = await request.post("/api/auth/login", {
      data: {
        email: testUser.email,
        password: testUser.password,
      },
    });

    const status = response.status();
    const responseBody = await response.text();

    expect(status).toBe(200);

    const data = JSON.parse(responseBody);
    expect(data).toHaveProperty("token");
    authToken = data.token;

    if (data.refreshToken) {
      refreshToken = data.refreshToken;
    }

    if (data.user && data.user.id && !userId) {
      userId = data.user.id;
    }

    expect(authToken).toBeDefined();
  });

  test("3. Get Users List - should return list of users", async ({
    request,
  }) => {
    // Skip if auth token is not available
    test.skip(!authToken, "No auth token available");

    const response = await request.get("/api/auth/users", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test("4. Get User by ID - should return specific user", async ({
    request,
  }) => {
    // Skip if auth token or user ID is not available
    test.skip(!authToken || !userId, "No auth token or user ID available");

    const response = await request.get(`/api/auth/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("id", userId);
    expect(data).toHaveProperty("username", testUser.username);
    expect(data).toHaveProperty("email", testUser.email);
  });

  test("5. Logout - should invalidate token", async ({ request }) => {
    // Skip if auth token or refresh token is not available
    test.skip(
      !authToken || !refreshToken,
      "No auth token or refresh token available"
    );

    const response = await request.post("/api/auth/logout", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      data: {
        refreshToken: refreshToken,
      },
    });

    expect(response.status()).toBe(200);

    const data = await response.json();
    expect(data).toHaveProperty("message");
  });

  test("6. Verify Logout - token should be invalid", async ({ request }) => {
    // Skip if auth token was not previously set
    test.skip(!authToken, "No auth token was set to test");

    // Try to access protected route with the now-invalid token
    const response = await request.get("/api/auth/users", {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    // Expect authentication failure (401 Unauthorized)
    expect(response.status()).toBe(401);
  });
});
