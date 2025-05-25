/// <reference types="node" />
import { Page } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// Create screenshot directory if it doesn't exist
export const SCREENSHOT_DIR = path.join(process.cwd(), 'test_screenshots/assessment');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

/**
 * Clears the session storage for the page
 * @param page Playwright page object
 */
export const clearSessionStorage = async (page: Page): Promise<void> => {
  await page.evaluate(() => {
    window.sessionStorage.clear();
    window.localStorage.clear();
  });
};

/**
 * Logs debug information about the current page
 * @param page Playwright page object
 */
export const debugPage = async (_page: Page): Promise<void> => {
  // Log visible headings for context (commented out to avoid unused variables)
  // const headings = await page.locator('h1, h2, h3').allTextContents();
  // Log visible buttons (commented out to avoid unused variables)
  // const buttons = await page.locator('button:visible').allTextContents();
};
