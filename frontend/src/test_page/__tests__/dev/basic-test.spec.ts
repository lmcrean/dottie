import { test, expect } from '@playwright/test';

test('basic test', async ({ page }) => {
  // Navigate to the home page
  await page.goto('/');
  
  // Wait for navigation and take a screenshot
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: './test_screenshots/basic-test.png' });
  
  // Verify some content is present
  const content = await page.content();
  expect(content.length).toBeGreaterThan(0);
  
  console.log('Basic test passed - page loaded successfully');
}); 