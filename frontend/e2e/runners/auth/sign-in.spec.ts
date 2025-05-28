import { Page } from '@playwright/test';

/**
 * Signs in a user with provided credentials
 * @param page The Playwright page object
 * @param email User's email
 * @param password User's password
 * @returns Boolean indicating if sign-in was successful
 */
export const signInUser = async (page: Page, email: string, password: string) => {
  // Navigate to login page
  await page.goto('http://localhost:3005/auth/sign-in');
  await page.waitForLoadState('networkidle');

  console.log(`Attempting to sign in with email: ${email}`);

  try {
    // Wait for form to be visible
    await page.waitForSelector('form', { timeout: 10000 });

    // Fill in login form using specific selectors
    await page.locator('input#email').fill(email);
    await page.locator('input#password').fill(password);

    // Wait a moment for form validation if any
    await page.waitForTimeout(500);

    // Take screenshot before submission for debugging
    await page.screenshot({ path: 'test_screenshots/before-signin-submit.png' });

    // Click login button - try multiple selectors
    let signInButton = page.getByRole('button', { name: /sign in/i });
    
    // If not found, try by button text
    if (await signInButton.count() === 0) {
      signInButton = page.locator('button:has-text("Sign in")');
    }
    
    // If still not found, try any submit button
    if (await signInButton.count() === 0) {
      signInButton = page.locator('button[type="submit"]');
    }

    await signInButton.waitFor({ state: 'visible', timeout: 5000 });
    await signInButton.click();

    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Additional wait to ensure redirection completes

    // Take screenshot after submission for debugging
    await page.screenshot({ path: 'test_screenshots/after-signin-submit.png' });

    // Verify we're logged in
    const currentUrl = page.url();
    console.log(`After signin, current URL: ${currentUrl}`);

    // If we're still on the login page, something went wrong
    if (currentUrl.includes('/sign-in')) {
      console.error('Failed to authenticate - still on sign-in page');

      // Check for any error messages
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

      return false;
    }

    console.log('Sign-in appears successful - redirected to:', currentUrl);
    return true;
  } catch (error) {
    console.error('Error during sign-in process:', error);
    // Take error screenshot
    await page.screenshot({ path: 'test_screenshots/signin-error.png' });
    return false;
  }
};
