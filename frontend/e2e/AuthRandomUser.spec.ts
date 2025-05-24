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
      console.log(`[REQUEST] ${request.method()} ${request.url()}`);
      if (request.postData()) {
        console.log(`[REQUEST BODY] ${request.postData()}`);
      }
    });

    page.on('response', (response) => {
      responses.push({
        url: response.url(),
        status: response.status(),
        statusText: response.statusText()
      });
      console.log(`[RESPONSE] ${response.status()} ${response.url()}`);
    });

    // Step 2: Sign up a new random user
    console.log('=== Starting Sign Up Process ===');
    const userCredentials = await signUpTestUser(page);

    // Log signup related requests/responses
    console.log('=== Network Activity During Signup ===');
    const signupRequests = requests.filter((req) => req.url.includes('/api/auth/signup'));
    const signupResponses = responses.filter((res) => res.url.includes('/api/auth/signup'));

    console.log('Signup requests:', JSON.stringify(signupRequests, null, 2));
    console.log('Signup responses:', JSON.stringify(signupResponses, null, 2));

    // Verify that sign-up returned valid credentials
    expect(userCredentials).toBeDefined();
    expect(userCredentials.email).toBeTruthy();
    expect(userCredentials.password).toBeTruthy();
    expect(userCredentials.username).toBeTruthy();

    console.log('Sign-up completed, user credentials obtained');

    // Clear network logs for sign-in
    requests.length = 0;
    responses.length = 0;

    // Step 3: Sign in with the newly created user
    console.log('=== Starting Sign In Process ===');
    const signInSuccess = await signInUser(page, userCredentials.email, userCredentials.password);

    // Log signin related requests/responses
    console.log('=== Network Activity During Signin ===');
    const signinRequests = requests.filter(
      (req) => req.url.includes('/api/auth/login') || req.url.includes('/api/auth/signin')
    );
    const signinResponses = responses.filter(
      (res) => res.url.includes('/api/auth/login') || res.url.includes('/api/auth/signin')
    );

    console.log('Signin requests:', JSON.stringify(signinRequests, null, 2));
    console.log('Signin responses:', JSON.stringify(signinResponses, null, 2));

    // Verify that sign-in was successful
    expect(signInSuccess).toBe(true);

    // Additional verification: ensure we're not on auth pages
    const currentUrl = page.url();
    expect(currentUrl).not.toContain('/sign-up');
    expect(currentUrl).not.toContain('/sign-in');

    console.log('=== Authentication Flow Test Completed Successfully ===');
    console.log(`User ${userCredentials.email} was able to sign up and sign in successfully`);
  });

  test('should handle sign-up and immediate re-authentication', async ({ page }) => {
    // Test the complete flow including potential automatic login after sign-up
    console.log('=== Testing Sign Up with Immediate Re-authentication ===');

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
      console.log('User appears to be automatically logged in after sign-up');

      // Verify we can access protected content or user-specific pages
      // This assumes there's some indication of being logged in
      const bodyText = await page.textContent('body');
      expect(bodyText).toBeTruthy();
    } else {
      console.log('User needs to manually sign in after sign-up');

      // Perform manual sign-in
      const signInSuccess = await signInUser(page, userCredentials.email, userCredentials.password);
      expect(signInSuccess).toBe(true);
    }

    // Final verification that authentication worked
    const finalUrl = page.url();
    expect(finalUrl).not.toContain('/sign-up');
    expect(finalUrl).not.toContain('/sign-in');

    console.log('=== Complete Authentication Flow Test Completed ===');
  });
});
