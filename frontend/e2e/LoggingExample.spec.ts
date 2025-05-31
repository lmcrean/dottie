import { test, expect } from '@playwright/test';
import { setupAllLogging } from './utils/logging-utils';
import fs from 'fs';
import path from 'path';

test.describe('Logging Example Tests', () => {
  // Setup logging for each test
  test.beforeEach(async ({ page }, testInfo) => {
    // Set up comprehensive logging
    await setupAllLogging(page, testInfo);
  });
  
  // Clean up after each test to ensure log files are properly closed
  test.afterEach(async () => {
    // Give time for log files to be closed
    await new Promise(resolve => setTimeout(resolve, 500));
  });

  test('captures frontend console logs', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Execute some console logs in the browser
    await page.evaluate(() => {
      console.log('This is a log message from the browser');
      console.info('This is an info message from the browser');
      console.warn('This is a warning message from the browser');
      console.error('This is an error message from the browser');
      
      // Create a JavaScript error
      try {
        // @ts-ignore - intentional error for testing
        const obj = null;
        obj.someMethod();
      } catch (error) {
        console.error('Caught error:', error);
      }
    });
    
    // Wait a moment to ensure logs are captured
    await page.waitForTimeout(1000);
  });
  
  test('captures network requests and responses', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');
    
    // Make an API request that will generate both frontend and backend logs
    await page.evaluate(() => {
      fetch('/api/setup/health/hello')
        .then(response => response.json())
        .then(data => {
          console.log('API response:', data);
        })
        .catch(error => {
          console.error('API error:', error);
        });
    });
    
    // Wait a moment to ensure logs are captured
    await page.waitForTimeout(1000);
  });
}); 