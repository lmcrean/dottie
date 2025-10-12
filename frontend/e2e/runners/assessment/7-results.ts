import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
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
    // Verify title - should be the pattern type (Regular/Irregular Cycles)
    const title = await page
      .locator('h1')
      .filter({ hasText: /Regular Menstrual Cycles|Irregular Cycles/ })
      .first();
    await expect(title).toBeVisible({ timeout: 10000 });

    // Check for assessment details section
    const detailsSection = await page.locator('text=Assessment Details').first();
    await expect(detailsSection).toBeVisible();

    // Check for recommendations section
    const recommendationsSection = await page.locator('text=Recommendations').first();
    await expect(recommendationsSection).toBeVisible();

    // Check for chat button
    const chatButton = await page.getByRole('button', { name: /chat with dottie/i });
    await expect(chatButton).toBeVisible();

    console.log('✅ Results page verification complete');
  } catch (error) {
    console.error('Error checking results page:', error);
    throw error;
  }
};
