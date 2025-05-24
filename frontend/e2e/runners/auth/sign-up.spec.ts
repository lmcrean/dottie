import { Page } from '@playwright/test';

/**
 * Creates a new test user account
 * @param page The Playwright page object
 * @returns Object containing the created user's credentials
 */
export const signUpTestUser = async (page: Page) => {
  console.log('Starting user registration process...');

  const email = `test_${Date.now()}@example.com`;
  const password = 'TestPassword123!';
  const username = `testuser_${Date.now()}`;

  console.log(`Creating user with email: ${email} and username: ${username}`);

  // Navigate to sign-up page
  await page.goto('http://localhost:3005/auth/sign-up');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000); // Give the page time to fully load

  // Debug form elements
  console.log('Analyzing sign-up form elements...');
  const nameInput = await page.locator('input[name="name"]').count();
  const usernameInput = await page.locator('input[name="username"]').count();
  const emailInput = await page.locator('input[type="email"]').count();
  const passwordInputs = await page.locator('input[type="password"]').count();

  console.log(
    `Found form fields - Name: ${nameInput}, Username: ${usernameInput}, Email: ${emailInput}, Password fields: ${passwordInputs}`
  );

  // Fill in registration form
  console.log('Filling registration form...');
  try {
    await page.getByLabel(/full name/i).fill('Test User');
    await page.getByLabel(/username/i).fill(username);
    await page.getByLabel(/email/i).fill(email);

    // Find password fields
    const passwordFields = await page.locator('input[type="password"]').all();
    if (passwordFields.length >= 2) {
      await passwordFields[0].fill(password);
      await passwordFields[1].fill(password);
      console.log('Filled both password fields');
    } else {
      // Try with label
      await page.getByLabel(/password/i).fill(password);
      await page.getByLabel(/confirm password/i).fill(password);
      console.log('Filled password fields by label');
    }

    // Wait a moment for form validation
    await page.waitForTimeout(500);

    // Click create account button
    const createAccountButton = await page.getByRole('button', { name: /create account/i });
    console.log('Clicking create account button');
    await createAccountButton.waitFor({ state: 'visible' });
    await createAccountButton.click();

    // Wait for navigation and async operations to complete
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000); // Additional wait to ensure account creation is fully processed

    // Verify outcome - we should no longer be on the sign-up page
    const currentUrl = page.url();
    console.log('Post-registration URL:', currentUrl);

    if (currentUrl.includes('/sign-up')) {
      console.error('Registration might have failed - still on sign-up page');

      // Check for error messages
      const errorMessages = await page.locator('.error-message, [role="alert"]').all();
      for (const error of errorMessages) {
        console.error(`Error message found: "${await error.textContent()}"`);
      }
    } else {
      console.log('Registration appears successful - redirected from sign-up page');
    }

    console.log('User registration completed');

    // Return created user credentials for sign-in
    return { email, password, username };
  } catch (error) {
    console.error('Error during registration:', error);
    // Still return credentials so sign-in can be attempted
    return { email, password, username };
  }
};
