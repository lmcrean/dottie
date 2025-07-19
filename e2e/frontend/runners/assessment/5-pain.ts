import { Page } from '@playwright/test';
import path from 'path';
import { SCREENSHOT_DIR, debugPage } from '../../utils/test-utils';

/**
 * Runs the pain step of the assessment
 * @param page Playwright page object
 * @returns Promise resolving when the step is complete
 */
export const runPainStep = async (page: Page): Promise<void> => {
  // Now on pain page

  // Take screenshot
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `05-pain.png`),
    fullPage: true
  });

  // Debug the page structure
  await debugPage(page);

  // Select a pain option

  try {
    // Try to click the "Mild" option

    const mildPainButton = await page.locator('button').filter({ hasText: /Mild/ }).first();
    await mildPainButton.waitFor({ state: 'visible' });
    await mildPainButton.click();

    // Wait after selection
    await page.waitForTimeout(500);

    // Click Continue button

    const continueButton = await page.getByRole('button', { name: /continue/i });
    await continueButton.waitFor({ state: 'visible' });

    // Create a promise to wait for navigation
    const navigationPromise = page.waitForURL('**/symptoms', { timeout: 10000 });

    // Click the button
    await continueButton.click();

    // Wait for navigation to complete
    await navigationPromise;

    // Wait for the page to stabilize
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000);
  } catch (error) {
    console.error('Error on pain page:', error);
    throw error;
  }
};
