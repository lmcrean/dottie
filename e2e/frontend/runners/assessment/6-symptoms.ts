import { Page } from '@playwright/test';
import path from 'path';
import { SCREENSHOT_DIR, debugPage } from '../../utils/test-utils';

/**
 * Runs the symptoms step of the assessment
 * @param page Playwright page object
 * @returns Promise resolving when the step is complete
 */
export const runSymptomsStep = async (page: Page): Promise<void> => {
  // Now on symptoms page

  // Take screenshot
  await page.screenshot({
    path: path.join(SCREENSHOT_DIR, `06-symptoms.png`),
    fullPage: true
  });

  // Debug the page structure
  await debugPage(page);

  // Select some symptoms

  try {
    // Select a couple of physical symptoms
    const bloatingButton = await page
      .locator('div[role="button"]')
      .filter({ hasText: 'Bloating' })
      .first();
    await bloatingButton.waitFor({ state: 'visible' });
    await bloatingButton.click();

    const fatigueButton = await page
      .locator('div[role="button"]')
      .filter({ hasText: 'Fatigue' })
      .first();
    await fatigueButton.waitFor({ state: 'visible' });
    await fatigueButton.click();

    // Select an emotional symptom
    const moodSwingsButton = await page
      .locator('div[role="button"]')
      .filter({ hasText: 'Mood swings' })
      .first();
    await moodSwingsButton.waitFor({ state: 'visible' });
    await moodSwingsButton.click();

    // Wait after selections
    await page.waitForTimeout(500);

    // Click Finish Assessment button

    const finishButton = await page.getByRole('button', { name: /finish assessment/i });
    await finishButton.waitFor({ state: 'visible' });

    // Create a promise to wait for navigation
    const navigationPromise = page.waitForURL('**/calculate-pattern', { timeout: 10000 });

    // Click the button
    await finishButton.click();

    // Wait for navigation to complete
    await navigationPromise;

    // Wait for the page to stabilize and for auto-navigation to continue
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // Wait for navigation through generate-recommendations and save pages to complete
    // and finally arrive at results page
    await page.waitForURL('**/results**', { timeout: 20000 });

    // Wait for the results page to load fully
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
  } catch (error) {
    console.error('Error completing assessment:', error);
    throw error;
  }
};
