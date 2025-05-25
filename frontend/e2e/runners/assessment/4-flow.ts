import { Page } from '@playwright/test';
import path from 'path';
import { SCREENSHOT_DIR, debugPage } from '../../utils/test-utils';

/**
 * Runs the flow step of the assessment
 * @param page Playwright page object
 * @returns Promise resolving when the step is complete
 */
export const runFlowStep = async (page: Page): Promise<void> => {
  // Now on flow page

  // Take screenshot
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `04-flow.png`),
    fullPage: true
  });

  // Debug the page structure
  await debugPage(page);

  // Select a flow option

  try {
    // Try to click the "Moderate" option (Average flow)

    const moderateFlowButton = await page
      .locator('button')
      .filter({ hasText: /Moderate/ })
      .first();
    await moderateFlowButton.waitFor({ state: 'visible' });
    await moderateFlowButton.click();

    // Wait after selection
    await page.waitForTimeout(500);

    // Click Continue button

    const continueButton = await page.getByRole('button', { name: /continue/i });
    await continueButton.waitFor({ state: 'visible' });

    // Create a promise to wait for navigation
    const navigationPromise = page.waitForURL('**/pain', { timeout: 10000 });

    // Click the button
    await continueButton.click();

    // Wait for navigation to complete
    await navigationPromise;

    // Wait for the page to stabilize
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  } catch (error) {
    console.error('Error on flow page:', error);
    throw error;
  }
};
