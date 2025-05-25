import { test, expect } from '@playwright/test';
import { signUpTestUser } from './runners/auth/sign-up.spec';
import { signInUser } from './runners/auth/sign-in.spec';

interface NetworkRequest {
  url: string;
  method: string;
  postData: string | null;
  headers: Record<string, string>;
}

interface NetworkResponse {
  url: string;
  status: number;
  statusText: string;
}

test.describe('User Authentication Flow', () => {
  test('should allow user to sign up and then sign in with random user', async ({ page }) => {
    // Step 1: Set up network monitoring
    const responses: NetworkResponse[] = [];
    const requests: NetworkRequest[] = [];

    page.on('request', (request) => {
      requests.push({
        url: request.url(),
        method: request.method(),
        postData: request.postData(),
        headers: request.headers()
      });

      if (request.postData()) {
        // Log request data if needed for debugging
      }
    });

    page.on('response', (response) => {
      responses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
    });

    // Step 2: Sign up a new random user

    const userCredentials = await signUpTestUser(page);

    // Log signup related requests/responses (commented out to avoid unused variables)
    // const signupRequests = requests.filter((req) => req.url.includes('/api/auth/signup'));
    // const signupResponses = responses.filter((res) => res.url.includes('/api/auth/signup'));

    // Verify that sign-up returned valid credentials
    expect(userCredentials).toBeDefined();
    expect(userCredentials.email).toBeTruthy();
    expect(userCredentials.password).toBeTruthy();
    expect(userCredentials.username).toBeTruthy();

    // Clear network logs for sign-in
    requests.length = 0;
    responses.length = 0;

    // Step 3: Sign in with the newly created user

    const signInSuccess = await signInUser(page, userCredentials.email, userCredentials.password);

    // Log signin related requests/responses (commented out to avoid unused variables)
    // const signinRequests = requests.filter(
    //   (req) => req.url.includes('/api/auth/login') || req.url.includes('/api/auth/signin')
    // );
    // const signinResponses = responses.filter(
    //   (res) => res.url.includes('/api/auth/login') || res.url.includes('/api/auth/signin')
    // );

    // Verify that sign-in was successful
    expect(signInSuccess).toBe(true);

    // Additional verification: ensure we're not on auth pages
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/sign-up');
    expect(currentUrl).not.toContain('/sign-in');
  });

  test('should handle sign-up and immediate re-authentication', async ({ page }) => {
    // Test the complete flow including potential automatic login after sign-up

    const userCredentials = await signUpTestUser(page);

    // Verify credentials were created
    expect(userCredentials).toBeDefined();
    expect(userCredentials.email).toBeTruthy();
    expect(userCredentials.password).toBeTruthy();

    // Wait a moment to ensure any post-signup processes complete
    await page.waitForTimeout(1000);

    // Check if user is already logged in after sign-up
    const urlAfterSignUp = page.url();
    const isAlreadyLoggedIn =
      !urlAfterSignUp.includes('/sign-in') && !urlAfterSignUp.includes('/sign-up');

    if (isAlreadyLoggedIn) {
      // User is already logged in after signup

      // Verify we can access protected content or user-specific pages
      // This assumes there's some indication of being logged in
      const bodyText = await page.textContent('body');
      expect(bodyText).toBeTruthy();
    } else {
      // Need to sign in manually

      // Perform manual sign-in
      const signInSuccess = await signInUser(page, userCredentials.email, userCredentials.password);
      expect(signInSuccess).toBe(true);
    }

    // Final verification that authentication worked
    const finalUrl = page.url();
    expect(finalUrl).not.toContain('/sign-up');
    expect(finalUrl).not.toContain('/sign-in');
  });
});
