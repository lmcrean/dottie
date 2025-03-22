import { test, expect } from '@playwright/test';

test.describe('Development Environment Tests', () => {
  test('should display development mode in heading', async ({ page }) => {
    // Navigate to the test page
    await page.goto('/test_page');
    
    // Check that the page heading shows DEVELOPMENT
    const heading = page.locator('h1');
    await expect(heading).toContainText('DEVELOPMENT');
  });

  test('should successfully connect to API', async ({ page }) => {
    // Navigate to the test page
    await page.goto('/test_page');
    
    // Click the API test button
    const apiButton = page.getByRole('button', { name: 'Test API Message' });
    await apiButton.click();
    
    // Wait for the response to appear
    await page.waitForSelector('.mt-4 p');
    
    // Check that the response contains the expected text
    const responseText = page.locator('.mt-4 p').first();
    await expect(responseText).toContainText('API is running in DEVELOPMENT mode');
    
    // Don't check for timestamp in the response text content since it might not be visible
    // in the formatted output
  });

  test('should successfully connect to SQLite in development mode', async ({ page }) => {
    // Navigate to the test page
    await page.goto('/test_page');
    
    // Click the SQLite test button
    const dbButton = page.getByRole('button', { name: 'Test SQLite Connection' });
    await dbButton.click();
    
    // Wait for the response to appear - increased timeout
    await page.waitForSelector('.mt-4 p', { state: 'visible', timeout: 10000 });
    
    // The response might be in any of the visible paragraphs, so we'll check all of them
    const allParagraphs = page.locator('.mt-4 p');
    
    // Get the count of paragraphs
    const count = await allParagraphs.count();
    
    // Check if any paragraph contains the expected text
    let found = false;
    for (let i = 0; i < count; i++) {
      const text = await allParagraphs.nth(i).textContent();
      if (text && text.includes('SQLite connection successful in DEVELOPMENT mode')) {
        found = true;
        break;
      }
    }
    
    // Assert that we found the expected text
    expect(found).toBe(true);
  });
  
  test('API error handling works correctly', async ({ page, context }) => {
    // Navigate to the test page
    await page.goto('/test_page');
    
    // Mock a failed API response
    await context.route('/api/message', route => route.abort('failed'));
    
    // Click the API test button
    const apiButton = page.getByRole('button', { name: 'Test API Message' });
    await apiButton.click();
    
    // Wait for the error response to appear
    await page.waitForSelector('.mt-4 p');
    
    // Check that the response contains an error message
    const responseText = page.locator('.mt-4 p').first();
    await expect(responseText).toContainText('Error:');
  });
}); 