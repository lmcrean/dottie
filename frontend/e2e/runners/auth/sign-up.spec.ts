import { Page } from '@playwright/test';

/**
 * Creates a new test user account
 * @param page The Playwright page object
 * @returns Object containing the created user's credentials
 */
export const signUpTestUser = async (page: Page) => {
  const email = `test_${Date.now()}@example.com`;
  const password = 'TestPassword123!';
  const username = `testuser_${Date.now()}`;

  // Navigate to sign-up page
  await page.goto('http://localhost:3005/auth/sign-up');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Give the page time to fully load

  try {
    // Wait for form to be visible
    await page.waitForSelector('form', { timeout: 10000 });

    // Fill in registration form using more specific selectors
    await page.locator('input#name').fill('Test User');
    await page.locator('input#username').fill(username);
    await page.locator('input#email').fill(email);
    await page.locator('input#password').fill(password);
    await page.locator('input#confirmPassword').fill(password);

    // Wait a moment for form validation
    await page.waitForTimeout(500);

    // Take screenshot before submission for debugging
    await page.screenshot({ path: 'test_screenshots/before-signup-submit.png' });

    // Click create account button - try multiple selectors
    let createAccountButton = page.getByRole('button', { name: /create account/i });
    
    // If not found, try by button text
    if (await createAccountButton.count() === 0) {
      createAccountButton = page.locator('button:has-text("Create account")');
    }
    
    // If still not found, try any submit button
    if (await createAccountButton.count() === 0) {
      createAccountButton = page.locator('button[type="submit"]');
    }

    await createAccountButton.waitFor({ state: 'visible', timeout: 5000 });
    await createAccountButton.click();

    // Wait for navigation and async operations to complete
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000); // Additional wait to ensure account creation is fully processed

    // Take screenshot after submission for debugging
    await page.screenshot({ path: 'test_screenshots/after-signup-submit.png' });

    // Verify outcome - we should no longer be on the sign-up page
    const currentUrl = page.url();
    console.log(`After signup, current URL: ${currentUrl}`);

    if (currentUrl.includes('/sign-up')) {
      console.error('Registration might have failed - still on sign-up page');

      // Check for error messages
      const errorMessages = await page.locator('[role="alert"], .text-red-500').all();
      for (const error of errorMessages) {
        const errorText = await error.textContent();
        console.error(`Error message found: "${errorText}"`);
      }

      // Check if there are form validation errors
      const formErrors = await page.locator('input:invalid').all();
      if (formErrors.length > 0) {
        console.error(`Found ${formErrors.length} invalid form fields`);
      }
    } else {
      console.log('Registration appears successful - redirected to:', currentUrl);
    }

    // Return created user credentials for sign-in
    return { email, password, username };
  } catch (error) {
    console.error('Error during registration:', error);
    // Take error screenshot
    await page.screenshot({ path: 'test_screenshots/signup-error.png' });
    // Still return credentials so sign-in can be attempted
    return { email, password, username };
  }
};
