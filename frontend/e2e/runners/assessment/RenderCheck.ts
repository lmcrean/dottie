import { Page } from '@playwright/test';

/**
 * Navigates to the assessment page and verifies it renders correctly
 * @param page Playwright Page object
 * @returns boolean indicating whether the page rendered successfully
 */
export async function checkAssessmentPageRender(page: Page): Promise<boolean> {
  try {
    console.log('Navigating to assessment page...');
    
    // First take a screenshot of current page before navigation
    await page.screenshot({ path: 'test_screenshots/assessment/before-navigation.png' });
    console.log(`Current URL before navigation: ${page.url()}`);
    
    // Try to navigate to the assessment page
    await page.goto('http://localhost:3005/assessment');
    await page.screenshot({ path: 'test_screenshots/assessment/after-navigation-attempt.png' });
    
    // Log the current URL
    let currentUrl = page.url();
    console.log(`Current URL after navigation: ${currentUrl}`);
    
    // Check if we're on the assessment page
    if (!currentUrl.includes('/assessment')) {
      console.log('Not on assessment page, checking if we need to handle redirection');
      
      // If we're still on sign-in page after successful login, we may need to manually navigate
      if (currentUrl.includes('/auth/sign-in')) {
        console.log('Still on sign-in page, checking authentication status');
        
        // Check if we're actually authenticated
        const authToken = await page.evaluate(() => localStorage.getItem('authToken'));
        
        if (authToken) {
          console.log('User is authenticated, trying manual navigation');
          
          // Take screenshot showing we're still on sign-in page despite being authenticated
          await page.screenshot({ path: 'test_screenshots/assessment/authenticated-but-still-on-signin.png' });
          
          // Try clicking the navbar link if it exists
          const navLinks = await page.locator('nav a, a[href*="assessment"], button:has-text("Assessment")').all();
          console.log(`Found ${navLinks.length} potential navigation links`);
          
          if (navLinks.length > 0) {
            // Try each link that might lead to assessment
            for (const link of navLinks) {
              const text = await link.textContent();
              const href = await link.getAttribute('href');
              console.log(`Link text: "${text}", href: ${href}`);
              
              if (text?.includes('Assessment') || href?.includes('assessment')) {
                console.log(`Clicking navigation link: ${text || href}`);
                await link.click();
                await page.waitForTimeout(2000);
                await page.screenshot({ path: 'test_screenshots/assessment/after-link-click.png' });
                break;
              }
            }
          } else {
            // If no links found, try direct navigation again
            console.log('No navigation links found, attempting direct navigation again');
            await page.goto('http://localhost:3005/assessment', { timeout: 10000 });
            await page.screenshot({ path: 'test_screenshots/assessment/after-second-navigation-attempt.png' });
          }
          
          // Check URL after attempted navigation
          currentUrl = page.url();
          console.log(`URL after navigation attempt: ${currentUrl}`);
        } else {
          console.log('User is not authenticated, navigation to assessment may not be possible');
          await page.screenshot({ path: 'test_screenshots/assessment/not-authenticated.png' });
        }
      }
    }
    
    // Final check - are we on the assessment page?
    if (!currentUrl.includes('/assessment')) {
      console.log('Navigation failed - not on assessment page');
      await page.screenshot({ path: 'test_screenshots/assessment/navigation-failed.png' });
      
      // Check if we're still on the sign-in page
      if (currentUrl.includes('/auth/sign-in')) {
        console.log('ERROR: Still on sign-in page after navigation attempts');
        return false;
      }
      
      return false;
    }

    // Take a screenshot for debugging
    await page.screenshot({ path: 'test_screenshots/assessment/assessment-page-loaded.png' });
    
    // Page title for debugging
    console.log(`Page title: ${await page.title()}`);
    
    // Check for any content that confirms we're on the assessment page
    // Try multiple selectors since we don't know the exact structure
    try {
      const selectors = [
        'h1', // Any h1 element
        '[data-testid="assessment-page"]', // If there's a test ID
        '.assessment-container', // Common class name for containers
        'button:has-text("Start Assessment")', // Common button text
        'div:has-text("Assessment")', // Any div containing the word Assessment
      ];
      
      for (const selector of selectors) {
        const isVisible = await page.isVisible(selector, { timeout: 3000 }).catch(() => false);
        if (isVisible) {
          console.log(`Found assessment page element with selector: ${selector}`);
          const element = await page.locator(selector).first();
          const text = await element.textContent();
          console.log(`Element text: ${text}`);
          
          // Take a screenshot highlighting the element
          await element.screenshot({ path: 'test_screenshots/assessment/element-found.png' });
          return true;
        }
      }
      
      // If we got to the assessment URL but couldn't find expected elements,
      // check if we can still see sign-in form elements
      const signInElements = await page.locator('form input[type="password"], form button:has-text("Sign in")').count();
      if (signInElements > 0) {
        console.log('ERROR: On assessment URL but still seeing sign-in form elements');
        await page.screenshot({ path: 'test_screenshots/assessment/wrong-content.png' });
        return false;
      }
      
      // If we're on the assessment URL but couldn't find specific expected elements,
      // let's be more strict and return false
      console.log('On assessment page URL but could not find expected elements');
      return false;
      
    } catch (error) {
      console.error('Error checking page elements:', error);
      return false;
    }
  } catch (error) {
    console.error('Error checking assessment page render:', error);
    await page.screenshot({ path: 'test_screenshots/assessment/assessment-page-error.png' });
    return false;
  }
}
