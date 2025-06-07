import { Page, expect } from '@playwright/test';
import path from 'path';
import { SCREENSHOT_DIR, debugPage } from '../../utils/test-utils';

/**
 * Checks the results page of the assessment
 * @param page Playwright page object
 * @returns Promise resolving when the check is complete
 */
export const checkResultsPage = async (page: Page): Promise<void> => {
  // Now on results page

  // Take screenshot
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `07-results.png`),
    fullPage: true
  });

  // Debug the page structure
  await debugPage(page);

  // Check for key elements on the results page

  try {
    // Verify title
    const title = await page
      .locator('h1')
      .filter({ hasText: /Assessment Results/ })
      .first();
    await expect(title).toBeVisible();

    // Check for determined pattern section
    const patternSection = await page
      .locator('div')
      .filter({ hasText: /Your Menstrual Pattern/ })
      .first();
    await expect(patternSection).toBeVisible();

    // Check for results table
    const resultsTable = await page.locator('table').first();
    await expect(resultsTable).toBeVisible();

    // Check for chat button
    const chatButton = await page.getByRole('button', { name: /chat with dottie/i });
    await expect(chatButton).toBeVisible();
  } catch (error) {
    console.error('Error checking results page:', error);
    throw error;
  }
};
