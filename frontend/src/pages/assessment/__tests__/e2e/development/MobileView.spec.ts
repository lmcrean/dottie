import { test, expect } from '@playwright/test';
import path from 'path';
import { SCREENSHOT_DIR, assessmentPaths, clearSessionStorage, setupSessionStorage } from './utils/test-utils';

test.describe('Mobile View Assessment Tests', () => {
  // Setup for all tests
  test.beforeEach(async ({ page }) => {
    await clearSessionStorage(page);
  });

  test('capture screenshots for mobile view', async ({ page }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Age Verification
    await page.goto(assessmentPaths.ageVerification);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '25-mobile-age-verification.png') });
    
    // Select 18-24 years option
    await page.getByText('18-24 years').click();
    
    // Click continue
    await page.getByRole('button', { name: /continue/i }).click();
    
    // Cycle Length
    await page.waitForURL(`**${assessmentPaths.cycleLength}**`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '26-mobile-cycle-length.png') });
    
    // Period Duration (jump ahead to see more screens)
    await page.goto(assessmentPaths.periodDuration);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '27-mobile-period-duration.png') });
    
    // Flow page
    await page.goto(assessmentPaths.flow);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '28-mobile-flow.png') });
    
    // Pain page
    await page.goto(assessmentPaths.pain);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '29-mobile-pain.png') });
    
    // Symptoms page
    await page.goto(assessmentPaths.symptoms);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '30-mobile-symptoms.png') });
    
    // Results page (using session storage to simulate completion)
    const sessionData = {
      age: '18-24 years',
      cycleLength: '26-30 days',
      periodDuration: '4-5 days',
      flowLevel: 'Moderate',
      painLevel: 'Mild',
      symptoms: ['Fatigue']
    };
    
    await setupSessionStorage(page, sessionData);
    
    await page.goto(assessmentPaths.results);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '31-mobile-results.png') });
  });
}); 