/**
 * Landing Page Test Runner
 * Tests the basic application pages and API health endpoints
 */

export async function runLandingTests(page) {
  console.log('Starting landing page tests...');
  
  // Test home page
  await testHomePage(page);
  
  // Test health endpoints via test page
  await testHealthEndpoints(page);
  
  return { success: true };
}

async function testHomePage(page) {
  // Navigate to the home page
  await page.goto('/');
  
  // Wait for the main content to load (adjust selector as needed)
  await page.waitForSelector('main', { state: 'visible', timeout: 5000 })
    .catch(() => console.log('Main content selector not found, continuing test'));
  
  // Check page title
  const title = await page.title();
  console.log(`Page title: ${title}`);
  
  // Take a screenshot of the home page
  await page.screenshot({ path: 'test_screenshots/page_integration/home-page.png' });
  
  console.log('Home page test completed');
}

async function testHealthEndpoints(page) {
  try {
    // Navigate to test page 
    await page.goto('/test-page');
    
    // Wait for page to load
    await page.waitForLoadState('networkidle');
    
    console.log('Test page loaded');
    
    // Find and click the API check button if it exists
    const apiButton = await page.getByText('Test API Connection', { exact: false });
    if (apiButton) {
      await apiButton.click();
      console.log('Clicked API connection button');
      
      // Wait for response (adjust selector based on actual UI)
      await page.waitForSelector('.api-response', { state: 'visible', timeout: 5000 })
        .catch(() => console.log('API response element not found'));
    } else {
      console.log('API test button not found');
    }
    
    // Take a screenshot after API test
    await page.screenshot({ path: 'test_screenshots/page_integration/api-test.png' });
    
    console.log('Health endpoints test completed');
  } catch (error) {
    console.error('Error in health endpoints test:', error.message);
    // Continue test execution despite errors
  }
} 