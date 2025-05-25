import { Page } from '@playwright/test';
import path from 'path';
import { SCREENSHOT_DIR, debugPage } from '../../utils/test-utils';

/**
 * Runs the period duration step of the assessment
 * @param page Playwright page object
 * @returns Promise resolving when the step is complete
 */
export const runPeriodDurationStep = async (page: Page): Promise<void> => {
  // Now on period duration page

  // Take screenshot
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `03-period-duration.png`),
    fullPage: true
  });

  // Debug the page structure
  await debugPage(page);

  // Select a period duration option

  try {
    // Try to click the "4-5 days" option (Average duration)

    const averageDurationButton = await page
      .locator('button')
      .filter({ hasText: /4-5 days/i })
      .first();
    await averageDurationButton.waitFor({ state: 'visible' });
    await averageDurationButton.click();

    // Wait after selection
    await page.waitForTimeout(500);

    // Click Continue button

    const continueButton = await page.getByRole('button', { name: /continue/i });
    await continueButton.waitFor({ state: 'visible' });

    // Create a promise to wait for navigation
    const navigationPromise = page.waitForURL('**/flow', { timeout: 10000 });

    // Click the button
    await continueButton.click();

    // Wait for navigation to complete
    await navigationPromise;

    // Wait for the page to stabilize
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  } catch (error) {
    console.error('Error on period duration page:', error);
    throw error;
  }
};
