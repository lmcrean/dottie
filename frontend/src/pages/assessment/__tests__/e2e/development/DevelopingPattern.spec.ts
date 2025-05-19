import { test, expect } from '@playwright/test';
import path from 'path';
import { SCREENSHOT_DIR, assessmentPaths, clearSessionStorage, setupSessionStorage } from './utils/test-utils';

test.describe('Developing Pattern Assessment Path', () => {
  // Setup for all tests
  test.beforeEach(async ({ page }) => {
    await clearSessionStorage(page);
  });

  test('capture screenshots for Developing Pattern path', async ({ page }) => {
    // Age Verification
    await page.goto(assessmentPaths.ageVerification);
    await page.waitForLoadState('networkidle');
    
    // Simply take screenshots of the pages
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '23-teenage-age-selected.png') });
    
    // Cycle Length - direct navigation
    await page.goto(assessmentPaths.cycleLength);
    await page.waitForLoadState('networkidle');
    
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
      age: '13-17 years',
      cycleLength: "I'm not sure",
      periodDuration: '6-7 days',
      flowLevel: 'Heavy',
      painLevel: 'Moderate',
      symptoms: ['Mood Changes']
    };
    
    await setupSessionStorage(page, sessionData);
    
    await page.goto(assessmentPaths.results);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: path.join(SCREENSHOT_DIR, '24-results-developing-pattern.png') });
  });
}); 