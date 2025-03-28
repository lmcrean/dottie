import { test, expect } from '@playwright/test';
import path from 'path';
import { setupApiForPlaywright, teardownApiForPlaywright } from '../../../e2e/development/e2e-test-setup';

// Real test suite for the API message functionality
test.describe('Development - API Message Connection Tests (Real)', () => {
  // Configure screenshot directory with new structure
  const baseScreenshotDir = path.join(process.cwd(), 'test_screenshots');
  const newScreenshotDir = path.join(baseScreenshotDir, 'development', 'test_page', 'api-connection', 'real');
  const legacyScreenshotDir = path.join(baseScreenshotDir, 'test_page');

  // Setup API server before all tests
  test.beforeAll(async () => {
    await setupApiForPlaywright();
  });

  // Cleanup after all tests
  test.afterAll(async () => {
    await teardownApiForPlaywright();
  });

  // Setup: Navigate to the test page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('/test');

    // Verify we're in development mode
    const heading = page.locator('h1');
    await expect(heading).toContainText('DEVELOPMENT', { timeout: 5000 });
  });

  test('should display API section with correct button state', async ({ page }) => {
    // Take a screenshot of the initial page using new path structure
    await page.screenshot({ 
      path: path.join(newScreenshotDir, 'initial-state.png')
    });
    
    // Maintain backward compatibility for now
    await page.screenshot({ 
      path: path.join(legacyScreenshotDir, 'real-api-initial-state.png')
    });
    
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
    await page.screenshot({ 
      path: path.join(newScreenshotDir, 'section.png')
    });
    
    // Maintain backward compatibility for now
    await page.screenshot({ 
      path: path.join(legacyScreenshotDir, 'real-api-section.png')
    });
  });

  test('should connect to real API and verify success', async ({ page }) => {
    // Enable console logging from the page to see the API response
    page.on('console', msg => console.log(`PAGE LOG: ${msg.text()}`));
    
    // Monitor network requests
    await page.route('**/api/hello', route => {
      console.log('API Request intercepted:', route.request().url());
      route.continue();
    });
    
    await page.route('**/api/hello', route => {
      route.continue();
      console.log('API Response intercepted');
    });
    
    // Click the API test button
    const apiButton = page.locator('[data-testid="test-api-button"]');
    await expect(apiButton).toBeVisible();
    await apiButton.click();
    
    // Wait for the response to appear
    const apiMessage = page.locator('[data-testid="api-message"]');
    await expect(apiMessage).toBeVisible({ timeout: 10000 });
    
    // Get the actual message text
    const messageText = await apiMessage.textContent();
    console.log('API Message:', messageText);
    
    // Verify the message contains the success message
    await expect(apiMessage).toContainText('API connection successful', { timeout: 10000 });
    
    // Verify the specific message from the API
    await expect(apiMessage).toContainText('Hello World from Dottie API!', { timeout: 10000 });
    
    // Check button color (should be green for success)
    await expect(apiButton).toHaveClass(/bg-green-600/, { timeout: 10000 });
    
    // Take a screenshot after the connection test - new path
    await page.screenshot({ 
      path: path.join(newScreenshotDir, 'connection-result.png')
    });
    
    // Maintain backward compatibility for now
    await page.screenshot({ 
      path: path.join(legacyScreenshotDir, 'real-api-connection-result.png')
    });
  });
}); 