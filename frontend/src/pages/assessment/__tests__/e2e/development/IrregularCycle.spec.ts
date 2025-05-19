import { test, expect } from '@playwright/test';
import path from 'path';
import { SCREENSHOT_DIR, assessmentPaths, clearSessionStorage, setupSessionStorage } from './utils/test-utils';

test.describe('Irregular Cycle Assessment Path', () => {
  // Setup for all tests
  test.beforeEach(async ({ page }) => {
    await clearSessionStorage(page);
  });

  test('capture screenshots for Irregular Cycle path', async ({ page }) => {
    // Age Verification
    await page.goto(assessmentPaths.ageVerification);
    await page.waitForLoadState('networkidle');
    
    // Take screenshots of each page for visual reference
    
    // Cycle Length - direct navigation
    await page.goto(assessmentPaths.cycleLength);
    await page.waitForLoadState('networkidle');
    
    // Select Variable/Irregular and take screenshot
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '18-irregular-cycle-selected.png') });
    
    // Period Duration - direct navigation
    await page.goto(assessmentPaths.periodDuration);
    await page.waitForLoadState('networkidle');
    
    // Flow page - direct navigation
    await page.goto(assessmentPaths.flow);
    await page.waitForLoadState('networkidle');
    
    // Pain page - direct navigation
    await page.goto(assessmentPaths.pain);
    await page.waitForLoadState('networkidle');
    
    // Symptoms page - direct navigation
    await page.goto(assessmentPaths.symptoms);
    await page.waitForLoadState('networkidle');
    
    // Results page - using session storage to simulate completion
    const sessionData = {
      age: '25-34 years',
      cycleLength: 'Variable',
      periodDuration: '3-4 days',
      flowLevel: 'Light',
      painLevel: 'None',
      symptoms: ['Headaches']
    };
    
    await setupSessionStorage(page, sessionData);
    
    await page.goto(assessmentPaths.results);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '19-results-irregular-cycle.png') });
  });
}); 