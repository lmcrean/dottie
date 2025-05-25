import { Page } from '@playwright/test';
import path from 'path';
import { SCREENSHOT_DIR, debugPage } from '../../utils/test-utils';

/**
 * Runs the cycle length step of the assessment
 * @param page Playwright page object
 * @returns Promise resolving when the step is complete
 */
export const runCycleLengthStep = async (page: Page): Promise<void> => {
  // Now on cycle length page

  // Take screenshot
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `02-cycle-length.png`),
    fullPage: true
  });

  // Debug the page structure
  await debugPage(page);

  // Select a cycle length option

  try {
    // Try to click the "Average length" option (26-30 days)

    const averageLengthButton = await page
      .locator('button')
      .filter({ hasText: /26-30 days/i })
      .first();
    await averageLengthButton.waitFor({ state: 'visible' });
    await averageLengthButton.click();

    // Wait after selection
    await page.waitForTimeout(500);

    // Click Continue button

    const continueButton = await page.getByRole('button', { name: /continue/i });
    await continueButton.waitFor({ state: 'visible' });

    // Create a promise to wait for navigation
    const navigationPromise = page.waitForURL('**/period-duration', { timeout: 10000 });

    // Click the button
    await continueButton.click();

    // Wait for navigation to complete
    await navigationPromise;

    // Wait for the page to stabilize
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  } catch (error) {
    console.error('Error on cycle length page:', error);
    throw error;
  }
};
