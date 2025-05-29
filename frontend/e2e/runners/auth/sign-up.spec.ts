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
    console.log('Starting sign-up process...');
    
    // Wait for form to be visible
    await page.waitForSelector('form', { timeout: 10000 });
    console.log('Form found on the page');

    // Take a screenshot of the form
    await page.screenshot({ path: 'test_screenshots/signup-form.png' });

    // Log all input elements to help debug
    const inputs = await page.locator('input').all();
    console.log(`Found ${inputs.length} input elements on page`);
    
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const id = await input.getAttribute('id') || 'no-id';
      const type = await input.getAttribute('type') || 'no-type';
      const name = await input.getAttribute('name') || 'no-name';
      console.log(`Input #${i+1}: id=${id}, type=${type}, name=${name}`);
    }

    // Try to fill in registration form using multiple selector strategies
    await fillInputField(page, 'input#name, input[name="name"], input[placeholder*="name" i]', 'Test User');
    await fillInputField(page, 'input#username, input[name="username"], input[placeholder*="username" i]', username);
    await fillInputField(page, 'input#email, input[name="email"], input[type="email"], input[placeholder*="email" i]', email);
    await fillInputField(page, 'input#password, input[name="password"], input[type="password"]:nth-of-type(1), input[placeholder*="password" i]:nth-of-type(1)', password);
    await fillInputField(page, 'input#confirmPassword, input[name="confirmPassword"], input[type="password"]:nth-of-type(2), input[placeholder*="confirm" i], input[placeholder*="retype" i]', password);

    // Wait a moment for form validation
    await page.waitForTimeout(500);

    // Take screenshot before submission for debugging
    await page.screenshot({ path: 'test_screenshots/before-signup-submit.png' });

    // Find all buttons on the page
    const buttons = await page.locator('button').all();
    console.log(`Found ${buttons.length} buttons on the page`);
    
    for (let i = 0; i < buttons.length; i++) {
      const button = buttons[i];
      const text = await button.textContent();
      const type = await button.getAttribute('type') || 'no-type';
      console.log(`Button #${i+1}: text="${text?.trim()}", type=${type}`);
    }

    // Click create account button - try multiple selectors
    const buttonSelectors = [
      'button:has-text("Create account")',
      'button:has-text("Sign up")',
      'button:has-text("Register")',
      'button[type="submit"]',
      'form button'
    ];
    
    let buttonClicked = false;
    for (const selector of buttonSelectors) {
      const button = page.locator(selector);
      if (await button.count() > 0) {
        console.log(`Found button with selector: ${selector}`);
        await button.click();
        buttonClicked = true;
        break;
      }
    }
    
    if (!buttonClicked) {
      console.error('Could not find submit button with any of the expected selectors');
      // As a last resort, try to submit the form directly
      await page.evaluate(() => {
        const form = document.querySelector('form');
        if (form) form.submit();
      });
      console.log('Attempted form submission via JavaScript');
    }

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
      const errorMessages = await page.locator('[role="alert"], .text-red-500, [class*="error" i]').all();
      for (const error of errorMessages) {
        const errorText = await error.textContent();
        console.error(`Error message found: "${errorText}"`);
      }

      // Check if there are form validation errors
      const formErrors = await page.locator('input:invalid').all();
      if (formErrors.length > 0) {
        console.error(`Found ${formErrors.length} invalid form fields`);
      }
      
      // Try to extract any relevant error messages from the page
      const pageText = await page.textContent('body');
      if (pageText.includes('error') || pageText.includes('failed')) {
        console.error('Page contains error-related text. Body text excerpt:', 
          pageText.substring(0, 500) + '...');
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

/**
 * Helper function to fill an input field using multiple selectors
 */
async function fillInputField(page: Page, selectors: string, value: string) {
  const selectorList = selectors.split(',').map(s => s.trim());
  let filled = false;
  
  for (const selector of selectorList) {
    const locator = page.locator(selector);
    if (await locator.count() > 0) {
      await locator.fill(value);
      console.log(`Filled input with selector: ${selector}`);
      filled = true;
      break;
    }
  }
  
  if (!filled) {
    console.error(`Could not find input field with any of these selectors: ${selectors}`);
  }
}
