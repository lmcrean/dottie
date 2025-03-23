import { test, expect } from '@playwright/test';
import path from 'path';

// Real test suite for the API message functionality
test.describe('Development - API Message Connection Tests (Real)', () => {
  // Configure screenshot directory
  const screenshotDir = path.join(process.cwd(), 'test_screenshots/test_page');

  // Setup: Navigate to the test page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/test');

    // Verify we're in development mode
    const heading = page.locator('h1');
    await expect(heading).toContainText('DEVELOPMENT', { timeout: 5000 });
  });

  test('should display API section with correct button state', async ({ page }) => {
    // Take a screenshot of the initial page
    await page.screenshot({ path: path.join(screenshotDir, 'real-api-initial-state.png') });
    
    // Check that the API section title is visible
    const apiTitle = page.locator('h2:has-text("API Connection Test")');
    await expect(apiTitle).toBeVisible();
    
    // Check that the test button is visible and has the correct text
    const apiButton = page.locator('[data-testid="test-api-button"]');
    await expect(apiButton).toBeVisible();
    await expect(apiButton).toHaveText('Test API Message');
    
    // Verify button has the default blue style initially
    await expect(apiButton).toHaveClass(/bg-blue-600/);
    
    // Take a screenshot of the API section
    await page.screenshot({ path: path.join(screenshotDir, 'real-api-section.png') });
  });

  test('should connect to real API and verify success', async ({ page }) => {
    // Click the API test button
    const apiButton = page.locator('[data-testid="test-api-button"]');
    await expect(apiButton).toBeVisible();
    await apiButton.click();
    
    // Wait for the response to appear
    const apiMessage = page.locator('[data-testid="api-message"]');
    await expect(apiMessage).toBeVisible({ timeout: 10000 });
    
    // Verify the message contains both the success message and the actual API message
    await expect(apiMessage).toContainText('API connection successful', { timeout: 10000 });
    await expect(apiMessage).toContainText('Server says:', { timeout: 10000 });
    await expect(apiMessage).toContainText('Hello World from Dottie API', { timeout: 10000 });
    
    // Check button color (should be green for success)
    await expect(apiButton).toHaveClass(/bg-green-600/, { timeout: 10000 });
    
    // Take a screenshot after the connection test
    await page.screenshot({ path: path.join(screenshotDir, 'real-api-connection-result.png') });
  });
}); 