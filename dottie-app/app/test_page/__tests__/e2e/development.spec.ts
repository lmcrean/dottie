import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// Ensure the screenshot directory exists
const screenshotDir = path.join(process.cwd(), 'test_screenshots/test_page');
if (!fs.existsSync(screenshotDir)) {
  fs.mkdirSync(screenshotDir, { recursive: true });
}

test.describe('Development Environment Tests', () => {
  // Load the page only once for all tests
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Navigate to the test page and load it completely
    await page.goto('/test_page');
    await page.waitForLoadState('networkidle');
    await page.close();
    await context.close();
  });
  
  test('should display development mode in heading', async ({ page }) => {
    // Navigate to the test page
    await page.goto('/test_page');
    
    // Check that the page heading shows DEVELOPMENT
    const heading = page.locator('h1');
    await expect(heading).toContainText('DEVELOPMENT');
    
    // Take a screenshot on success
    await page.screenshot({ path: path.join(screenshotDir, 'development-heading-success.png') });
  });

  test('should verify API test button exists', async ({ page }) => {
    // Navigate to the test page
    await page.goto('/test_page');
    
    // Verify that the API test button exists
    const apiButton = page.getByRole('button', { name: 'Test API Message' });
    await expect(apiButton).toBeVisible();
    
    // Take a screenshot
    await page.screenshot({ path: path.join(screenshotDir, 'api-button-exists.png') });
  });

  test('should verify SQLite test button exists', async ({ page }) => {
    // Navigate to the test page
    await page.goto('/test_page');
    
    // Verify that the SQLite test button exists
    const dbButton = page.getByRole('button', { name: 'Test SQLite Connection' });
    await expect(dbButton).toBeVisible();
    
    // Take a screenshot
    await page.screenshot({ path: path.join(screenshotDir, 'sqlite-button-exists.png') });
  });
}); 