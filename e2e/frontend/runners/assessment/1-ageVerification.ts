import type { Page } from '@playwright/test';
import path from 'path';
import { SCREENSHOT_DIR, debugPage } from '../../utils/test-utils';

/**
 * Runs the age verification step of the assessment
 * @param page Playwright page object
 * @returns Promise resolving when the step is complete
 */
export const runAgeVerificationStep = async (page: Page): Promise<void> => {
  // Check if we're already on the age verification page
  const currentUrl = page.url();
  console.log(`Current URL at start of age verification: ${currentUrl}`);

  // Only navigate if we're not already on the age verification page
  if (!currentUrl.includes('/assessment/age-verification')) {
    console.log('📍 Navigating to age verification page...');
    await page.goto('http://localhost:3005/assessment/age-verification');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Give the page a moment to stabilize
  } else {
    console.log('✅ Already on age verification page');
    // Just wait a moment for the page to be fully ready
    await page.waitForTimeout(500);
  }

  // Check if we're redirected to login page
  if (page.url().includes('/auth/sign-in')) {
    console.warn('Redirected to login page - authentication may be required');
    return; // Stop here as we can't proceed
  }

  // Take screenshot
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `01-age-verification.png`),
    fullPage: true
  });

  // Debug the page structure
  await debugPage(page);

  // Select "25+ years" option
  console.log('🔘 Selecting age option: 25+ years');

  try {
    // Try finding the option using data-testid
    const ageOption = page.getByTestId('option-25-plus');
    await ageOption.click();
    console.log('✅ Successfully clicked age option using data-testid');
  } catch (error) {
    console.error('Error selecting age option:', error);

    // Fallback approach if data-testid doesn't work
    try {
      const ageOptions = await page.locator('label').filter({ hasText: '25+ years' }).all();
      if (ageOptions.length > 0) {
        await ageOptions[0].click();
        console.log('✅ Successfully clicked age option using label text');
      } else {
        // Try finding all radio buttons and click the last one (25+ years)
        const radioButtons = await page.locator('input[type="radio"]').all();
        if (radioButtons.length > 0) {
          await radioButtons[radioButtons.length - 1].click();
          console.log('✅ Successfully clicked last radio button');
        }
      }
    } catch (innerError) {
      console.error('All fallback approaches failed:', innerError);
      throw error; // Throw the original error
    }
  }

  await page.waitForTimeout(500); // Short wait after selection

  // Click Continue button
  console.log('➡️ Clicking continue button...');

  try {
    // Use data-testid to find the continue button
    const continueButton = page.getByTestId('continue-button');
    await continueButton.waitFor({ state: 'visible' });

    // Create a promise to wait for navigation
    const navigationPromise = page.waitForURL('**/cycle-length', { timeout: 10000 });

    // Click the button
    await continueButton.click();
    console.log('✅ Continue button clicked');

    // Wait for navigation to complete
    await navigationPromise;
    console.log('✅ Navigation to cycle length page completed');

    // Wait for the page to stabilize
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  } catch (error) {
    console.error('Error navigating to cycle length page:', error);
    throw error;
  }
};
