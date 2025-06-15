import { test, expect } from '@playwright/test';

test.describe('Root Page Rendering', () => {
  test('should load root page and render basic elements', async ({ page }) => {
    // Navigate to the root page
    await page.goto('/');

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Verify the page title
    await expect(page).toHaveTitle(/Dottie App/);

    // Verify the root div exists
    const rootDiv = page.locator('#root');
    await expect(rootDiv).toBeVisible();

    // Verify main element exists (target the specific one from App.tsx structure)
    const mainElement = page.locator('main.flex.min-h-screen.flex-col');
    await expect(mainElement).toBeVisible();

    // Verify the page has loaded content (should not be empty)
    const bodyContent = await page.textContent('body');
    expect(bodyContent?.trim().length).toBeGreaterThan(0);

    // Take a screenshot for validation
    await page.screenshot({ path: 'test_screenshots/root-page-render.png' });

    // Verify page responds to interactions (basic click test)
    await page.mouse.move(100, 100);
    
    // Check that the page is responsive - no JavaScript errors
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    // Wait a moment to catch any delayed errors
    await page.waitForTimeout(1000);

    // Expect no JavaScript errors
    expect(errors).toHaveLength(0);
  });

  test('should have proper viewport and styling', async ({ page }) => {
    // Navigate to root page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Check that the main container has the expected background styling (target specific main)
    const mainElement = page.locator('main.flex.min-h-screen.flex-col');
    await expect(mainElement).toHaveClass(/min-h-screen/);
    await expect(mainElement).toHaveClass(/flex/);

    // Verify the overall app container has proper styling
    const appContainer = page.locator('div.min-h-screen.bg-gradient-to-b').first();
    await expect(appContainer).toHaveClass(/min-h-screen/);
    await expect(appContainer).toHaveClass(/bg-gradient-to-b/);

    // Check basic responsive behavior
    await page.setViewportSize({ width: 375, height: 667 }); // Mobile
    await expect(mainElement).toBeVisible();

    await page.setViewportSize({ width: 1024, height: 768 }); // Desktop
    await expect(mainElement).toBeVisible();
  });
});
