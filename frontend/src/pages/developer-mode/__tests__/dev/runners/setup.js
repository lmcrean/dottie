import { expect } from '@playwright/test';

/**
 * Test runner for setup endpoints
 * 
 * Handles testing setup-related endpoints:
 * - Health check
 * - Database status
 */

/**
 * Captures screenshots for the setup endpoints tests
 * @param {string} testName 
 * @returns {string} Screenshot path
 */
const getScreenshotPath = (testName) => `./test_screenshots/test_page/frontend-integration/setup/${testName}.png`;

/**
 * Helper to get API response data from UI
 * @param {Object} page Playwright page
 * @returns {Promise<object|null>} Parsed response data
 */
export async function getResponseData(page) {
  const responseText = await page.locator('.api-response pre').textContent();
  try {
    return responseText ? JSON.parse(responseText) : null;
  } catch (error) {
    console.error('Failed to parse response:', responseText);
    return null;
  }
}

/**
 * Runs all setup endpoint tests
 * @param {Object} page Playwright page
 */
export async function runSetupTests(page) {
  await testHealthEndpoint(page);
  await testDatabaseStatusEndpoint(page);
}

/**
 * Tests the health check endpoint
 * @param {Object} page Playwright page
 */
export async function testHealthEndpoint(page) {

  
  // Navigate to the test page
  await page.goto('/test-page');
  
  // Find the health check button
  const healthButton = page.getByRole('button', { name: /GET \/api\/setup\/health\/hello/i });
  
  // Ensure the button is visible
  await healthButton.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500); // Small wait for animations
  
  // Take screenshot before clicking
  await page.screenshot({ path: getScreenshotPath('health-endpoint-before-click') });
  
  // Click the button
  await healthButton.click();

  
  // Wait for any kind of response
  await page.waitForTimeout(3000); // Wait a few seconds for the API to respond
  
  // Take screenshot after waiting
  await page.screenshot({ path: getScreenshotPath('health-endpoint-after-click') });
  
  // Look for the response in different ways
  let responseText = '';
  try {
    // Try finding by class
    const responseElement = page.locator('.api-response');
    if (await responseElement.isVisible()) {
      responseText = await responseElement.textContent() || '';

    } else {
      // Try finding by other criteria - look for a pre tag in the third column
      const thirdColumn = page.locator('table tr td:nth-child(3)');
      if (await thirdColumn.isVisible()) {
        const preTag = thirdColumn.locator('pre');
        if (await preTag.isVisible()) {
          responseText = await preTag.textContent() || '';

        }
      }
      
      // Look for success indicator
      const successIndicator = page.locator('text=Success');
      if (await successIndicator.isVisible()) {

      }
    }
  } catch (error) {
    console.error('Error while looking for response:', error);
  }
  

  
  // Try to parse the response text into JSON
  let responseData = null;
  try {
    // Find the JSON in the response text (looking for {...})
    const jsonPattern = /{[\s\S]*}/;
    const match = responseText.match(jsonPattern);
    
    if (match) {
      responseData = JSON.parse(match[0]);

    } else {

    }
  } catch (error) {
    console.error('Failed to parse response JSON:', error);
  }
  
  // If we got valid data, verify it
  if (responseData) {
    expect(responseData).toHaveProperty('message', 'Hello World from Dottie API!');

  } else {

    // Take a screenshot of the entire page to analyze later
    await page.screenshot({ path: getScreenshotPath('health-endpoint-full-page'), fullPage: true });
  }
}

/**
 * Tests the database status endpoint
 * @param {Object} page Playwright page
 */
export async function testDatabaseStatusEndpoint(page) {

  
  // Find the database status button
  const dbStatusButton = page.getByRole('button', { name: /GET \/api\/setup\/database\/status/i });
  
  // Ensure the button is visible
  await dbStatusButton.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500); // Small wait for animations
  
  // Take screenshot before clicking
  await page.screenshot({ path: getScreenshotPath('database-status-before-click') });
  
  // Click the button
  await dbStatusButton.click();

  
  // Wait for any kind of response
  await page.waitForTimeout(3000); // Wait a few seconds for the API to respond
  
  // Take screenshot after waiting
  await page.screenshot({ path: getScreenshotPath('database-status-after-click') });
  
  // Look for the response in different ways
  let responseText = '';
  try {
    // Try finding by class
    const responseElement = page.locator('.api-response');
    if (await responseElement.isVisible()) {
      responseText = await responseElement.textContent() || '';

    } else {
      // Try finding by other criteria - look for a pre tag in the third column
      const thirdColumn = page.locator('table tr td:nth-child(3)');
      if (await thirdColumn.isVisible()) {
        const preTag = thirdColumn.locator('pre');
        if (await preTag.isVisible()) {
          responseText = await preTag.textContent() || '';

        }
      }
      
      // Look for success indicator
      const successIndicator = page.locator('text=Success');
      if (await successIndicator.isVisible()) {

      }
    }
  } catch (error) {
    console.error('Error while looking for response:', error);
  }
  

  
  // Try to parse the response text into JSON
  let responseData = null;
  try {
    // Find the JSON in the response text (looking for {...})
    const jsonPattern = /{[\s\S]*}/;
    const match = responseText.match(jsonPattern);
    
    if (match) {
      responseData = JSON.parse(match[0]);

    } else {

    }
  } catch (error) {
    console.error('Failed to parse response JSON:', error);
  }
  
  // If we got valid data, verify it
  if (responseData) {
    expect(responseData).toHaveProperty('status');
    expect(['connected', 'healthy']).toContain(responseData.status);

  } else {

    // Take a screenshot of the entire page to analyze later
    await page.screenshot({ path: getScreenshotPath('database-status-full-page'), fullPage: true });
  }
} 