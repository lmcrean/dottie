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

  // Log the current state

  // Debug form elements (commented out to avoid unused variables)
  // const emailInputs = await page.locator('input[type="email"]').all();
  // const passwordInputs = await page.locator('input[type="password"]').all();
  // const buttons = await page.locator('button').all();

  // for (const button of buttons) {
  //   // Debug button text if needed
  // }

  // Fill in login form
  try {
    await page.getByLabel(/email/i).fill(email);

    await page.getByLabel(/password/i).fill(password);

    // Wait a moment for form validation if any
    await page.waitForTimeout(500);

    // Click login button

    const signInButton = await page.getByRole('button', { name: /sign in/i });
    await signInButton.waitFor({ state: 'visible' });
    await signInButton.click();

    // Wait for navigation to complete
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Additional wait to ensure redirection completes

    // Verify we're logged in
    const currentUrl = page.url();

    // If we're still on the login page, something went wrong
    if (currentUrl.includes('/sign-in')) {
      console.error('Failed to authenticate - still on sign-in page');

      // Check for any error messages
      const errorMessages = await page.locator('.error-message, [role="alert"]').all();
      for (const error of errorMessages) {
        console.error(`Error message found: "${await error.textContent()}"`);
      }

      // Check page content for clues (commented out to avoid unused variable)
      // const pageText = await page.evaluate(() => document.body.textContent);

      return false;
    }

    return true;
  } catch (error) {
    console.error('Error during sign-in process:', error);
    return false;
  }
};
