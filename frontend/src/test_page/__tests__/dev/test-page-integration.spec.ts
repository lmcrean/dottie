import { test, expect, Page } from '@playwright/test';

/**
 * Frontend Test Page Integration E2E Test
 * 
 * Tests the frontend test page by clicking through all endpoint categories:
 * 1. Setup Endpoints (health check, database status)
 * 2. Authentication (register, login)
 * 3. Assessment Endpoints (create, list, get, delete)
 * 4. User Endpoints (get info, update profile)
 * 5. Chat Endpoints (send message, get history, delete)
 * 
 * Similar to the backend integration test but verifies frontend UI interaction.
 */

// Shared test state to maintain data between steps
const testState = {
  username: `testuser_${Date.now()}`,
  email: `test_${Date.now()}@example.com`,
  password: 'Test1234!',
  userId: null,
  assessmentIds: [] as string[],
  conversationId: null,
};

// Helper function to click on an endpoint button in a specific category
async function clickEndpoint(page: Page, category: string, endpoint: string) {
  // Find the category heading and scroll to it
  const heading = page.getByRole('heading', { name: category, exact: true });
  await heading.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500); // Small wait for animations
  
  // Find the endpoint button within that category section
  const section = page.locator('section', { 
    has: heading
  });
  
  // Click the endpoint button
  await section.getByText(endpoint, { exact: true }).click();
  
  // Wait for response to appear
  await page.waitForSelector('.api-response', { timeout: 10000 });
}

// Helper to fill form data for endpoints that need it
async function fillRequestData(page: Page, data: Record<string, any>) {
  // Fill the request body JSON input
  await page.locator('.json-input').fill(JSON.stringify(data, null, 2));
  await page.getByRole('button', { name: 'Send Request' }).click();
  
  // Wait for response after submitting
  await page.waitForSelector('.api-response', { timeout: 10000 });
}

// Helper to get API response data from UI
async function getResponseData(page: Page) {
  const responseText = await page.locator('.api-response pre').textContent();
  try {
    return responseText ? JSON.parse(responseText) : null;
  } catch (error) {
    console.error('Failed to parse response:', responseText);
    return null;
  }
}

// Configure tests to run in sequence
test.describe.configure({ mode: 'serial' });

test.describe('Test Page Integration', () => {
  test('1. Navigate to test page', async ({ page }) => {
    // Go to test page
    await page.goto('/test-page');
    
    // Verify page loaded correctly
    await expect(page.getByRole('heading', { name: /Now testing in/ })).toBeVisible();
    
    // Screenshots for debugging/documentation
    await page.screenshot({ path: './test_screenshots/test_page/frontend-integration/01-test-page.png' });
  });
  
  // =====================
  // Setup Endpoints Tests
  // =====================
  test('2. Test health endpoint', async ({ page }) => {
    await page.goto('/test-page');
    
    // Click the health check endpoint
    await clickEndpoint(page, 'Setup Endpoints', 'Health Check');
    
    // Verify response
    const healthData = await getResponseData(page);
    expect(healthData).toHaveProperty('message', 'Hello World from Dottie API!');
    
    await page.screenshot({ path: './test_screenshots/test_page/frontend-integration/02-health-check.png' });
  });
  
  test('3. Test database status endpoint', async ({ page }) => {
    // Click the database status endpoint
    await clickEndpoint(page, 'Setup Endpoints', 'Database Status');
    
    // Verify response
    const dbData = await getResponseData(page);
    expect(dbData).toHaveProperty('status');
    expect(['connected', 'healthy']).toContain(dbData.status);
    
    await page.screenshot({ path: './test_screenshots/test_page/frontend-integration/03-db-status.png' });
  });
  
  // =====================
  // Authentication Tests
  // =====================
  test('4. Register a new test user', async ({ page }) => {
    // Click the register endpoint
    await clickEndpoint(page, 'Auth Endpoints', 'Register');
    
    // Fill registration form
    await fillRequestData(page, {
      username: testState.username,
      email: testState.email,
      password: testState.password
    });
    
    // Verify response
    const registerData = await getResponseData(page);
    expect(registerData).toHaveProperty('user');
    expect(registerData.user).toHaveProperty('id');
    
    // Save user ID for later tests
    testState.userId = registerData.user.id;
    console.log('Created test user:', testState.userId);
    
    await page.screenshot({ path: './test_screenshots/test_page/frontend-integration/04-register.png' });
  });
  
  test('5. Login with registered user', async ({ page }) => {
    // Click the login endpoint
    await clickEndpoint(page, 'Auth Endpoints', 'Login');
    
    // Fill login form
    await fillRequestData(page, {
      email: testState.email,
      password: testState.password
    });
    
    // Verify login response
    const loginData = await getResponseData(page);
    expect(loginData).toHaveProperty('token');
    
    // Verify UI shows logged in status
    await expect(page.locator('.auth-status')).toContainText('Logged in');
    
    await page.screenshot({ path: './test_screenshots/test_page/frontend-integration/05-login.png' });
  });
  
  // =====================
  // Assessment Tests
  // =====================
  test('6. Create first assessment', async ({ page }) => {
    // Click create assessment endpoint
    await clickEndpoint(page, 'Assessment Endpoints', 'Create Assessment');
    
    // Fill assessment data
    await fillRequestData(page, {
      userId: testState.userId,
      age: "18-24",
      cycleLength: 28,
      periodDuration: 5,
      flowLevel: "moderate",
      painLevel: "mild",
      symptoms: ["cramps", "headache"]
    });
    
    // Verify response
    const assessmentData = await getResponseData(page);
    expect(assessmentData).toHaveProperty('id');
    
    // Save assessment ID
    testState.assessmentIds.push(assessmentData.id);
    console.log('Created assessment:', assessmentData.id);
    
    await page.screenshot({ path: './test_screenshots/test_page/frontend-integration/06-create-assessment.png' });
  });
  
  test('7. Get list of assessments', async ({ page }) => {
    // Click get assessments endpoint
    await clickEndpoint(page, 'Assessment Endpoints', 'Get Assessments');
    
    // Verify response
    const assessmentsList = await getResponseData(page);
    expect(Array.isArray(assessmentsList)).toBeTruthy();
    expect(assessmentsList.length).toBeGreaterThanOrEqual(1);
    
    // Verify our assessment is in the list
    const hasAssessment = assessmentsList.some(a => a.id === testState.assessmentIds[0]);
    expect(hasAssessment).toBeTruthy();
    
    await page.screenshot({ path: './test_screenshots/test_page/frontend-integration/07-list-assessments.png' });
  });
  
  test('8. Create second assessment', async ({ page }) => {
    // Click create assessment endpoint
    await clickEndpoint(page, 'Assessment Endpoints', 'Create Assessment');
    
    // Fill assessment data (more severe)
    await fillRequestData(page, {
      userId: testState.userId,
      age: "25-34",
      cycleLength: 35,
      periodDuration: 7,
      flowLevel: "heavy",
      painLevel: "severe",
      symptoms: ["cramps", "nausea", "fatigue", "mood swings"]
    });
    
    // Verify response
    const assessmentData = await getResponseData(page);
    expect(assessmentData).toHaveProperty('id');
    
    // Save assessment ID
    testState.assessmentIds.push(assessmentData.id);
    console.log('Created second assessment:', assessmentData.id);
    
    await page.screenshot({ path: './test_screenshots/test_page/frontend-integration/08-create-second-assessment.png' });
  });
  
  test('9. Get assessment by ID', async ({ page }) => {
    // Click get assessment by ID endpoint
    await clickEndpoint(page, 'Assessment Endpoints', 'Get Assessment by ID');
    
    // Fill assessment ID
    await fillRequestData(page, {
      assessmentId: testState.assessmentIds[0]
    });
    
    // Verify response
    const assessment = await getResponseData(page);
    expect(assessment).toHaveProperty('id', testState.assessmentIds[0]);
    expect(assessment).toHaveProperty('user_id', testState.userId);
    
    await page.screenshot({ path: './test_screenshots/test_page/frontend-integration/09-get-assessment.png' });
  });
  
  // =====================
  // User Tests
  // =====================
  test('10. Get user information', async ({ page }) => {
    // Click get user info endpoint
    await clickEndpoint(page, 'User Endpoints', 'Get User Info');
    
    // Fill user ID
    await fillRequestData(page, {
      userId: testState.userId
    });
    
    // Verify response
    const userData = await getResponseData(page);
    expect(userData).toHaveProperty('id', testState.userId);
    expect(userData).toHaveProperty('username', testState.username);
    expect(userData).toHaveProperty('email', testState.email);
    
    await page.screenshot({ path: './test_screenshots/test_page/frontend-integration/10-get-user.png' });
  });
  
  test('11. Update user profile', async ({ page }) => {
    // Click update profile endpoint
    await clickEndpoint(page, 'User Endpoints', 'Update Profile');
    
    // Generate new profile data
    const updatedUsername = `updated_${testState.username}`;
    
    // Fill profile data
    await fillRequestData(page, {
      userId: testState.userId,
      username: updatedUsername,
      age: "25-34"
    });
    
    // Verify response
    const updatedUser = await getResponseData(page);
    expect(updatedUser).toHaveProperty('id', testState.userId);
    expect(updatedUser).toHaveProperty('username', updatedUsername);
    
    // Update testState with new username
    testState.username = updatedUsername;
    
    await page.screenshot({ path: './test_screenshots/test_page/frontend-integration/11-update-profile.png' });
  });
  
  // =====================
  // Chat Tests
  // =====================
  test('12. Send a message to start a conversation', async ({ page }) => {
    // Click send message endpoint
    await clickEndpoint(page, 'Chat Endpoints', 'Send Message');
    
    // Fill message data
    await fillRequestData(page, {
      message: "Hello, I'm having severe cramps during my period. Any advice?"
    });
    
    // Verify response
    const chatResponse = await getResponseData(page);
    expect(chatResponse).toHaveProperty('message');
    expect(chatResponse).toHaveProperty('conversationId');
    
    // Save conversation ID
    testState.conversationId = chatResponse.conversationId;
    console.log('Created conversation:', testState.conversationId);
    
    await page.screenshot({ path: './test_screenshots/test_page/frontend-integration/12-send-message.png' });
  });
  
  test('13. Get conversation history', async ({ page }) => {
    // Click get conversation history endpoint
    await clickEndpoint(page, 'Chat Endpoints', 'Get Conversation History');
    
    // Verify response
    const history = await getResponseData(page);
    expect(Array.isArray(history)).toBeTruthy();
    
    // Verify our conversation is in the list
    const hasConversation = history.some(c => c.id === testState.conversationId);
    expect(hasConversation).toBeTruthy();
    
    await page.screenshot({ path: './test_screenshots/test_page/frontend-integration/13-conversation-history.png' });
  });
  
  test('14. Get conversation by ID', async ({ page }) => {
    // Click get conversation endpoint
    await clickEndpoint(page, 'Chat Endpoints', 'Get Conversation');
    
    // Fill conversation ID
    await fillRequestData(page, {
      conversationId: testState.conversationId
    });
    
    // Verify response
    const conversation = await getResponseData(page);
    expect(conversation).toHaveProperty('id', testState.conversationId);
    expect(conversation).toHaveProperty('messages');
    expect(Array.isArray(conversation.messages)).toBeTruthy();
    expect(conversation.messages.length).toBeGreaterThanOrEqual(2); // At least user message and response
    
    await page.screenshot({ path: './test_screenshots/test_page/frontend-integration/14-get-conversation.png' });
  });
  
  test('15. Send a second message to the conversation', async ({ page }) => {
    // Click send message endpoint
    await clickEndpoint(page, 'Chat Endpoints', 'Send Message');
    
    // Fill message data with existing conversation ID
    await fillRequestData(page, {
      message: "Are there any natural remedies I can try?",
      conversationId: testState.conversationId
    });
    
    // Verify response
    const chatResponse = await getResponseData(page);
    expect(chatResponse).toHaveProperty('message');
    expect(chatResponse).toHaveProperty('conversationId', testState.conversationId);
    
    await page.screenshot({ path: './test_screenshots/test_page/frontend-integration/15-send-second-message.png' });
  });
  
  // =====================
  // Cleanup Tests
  // =====================
  test('16. Delete the conversation', async ({ page }) => {
    // Click delete conversation endpoint
    await clickEndpoint(page, 'Chat Endpoints', 'Delete Conversation');
    
    // Fill conversation ID
    await fillRequestData(page, {
      conversationId: testState.conversationId
    });
    
    // Verify success
    const deleteResponse = await getResponseData(page);
    expect(deleteResponse).toHaveProperty('success', true);
    
    await page.screenshot({ path: './test_screenshots/test_page/frontend-integration/16-delete-conversation.png' });
    
    // Verify deleted by trying to get it
    await clickEndpoint(page, 'Chat Endpoints', 'Get Conversation');
    await fillRequestData(page, {
      conversationId: testState.conversationId
    });
    
    // Should get 404 error
    const errorResponse = await page.locator('.api-response').textContent();
    expect(errorResponse).toContain('404');
  });
  
  test('17. Delete assessments', async ({ page }) => {
    // Delete each assessment
    for (const assessmentId of testState.assessmentIds) {
      // Click delete assessment endpoint
      await clickEndpoint(page, 'Assessment Endpoints', 'Delete Assessment');
      
      // Fill assessment ID
      await fillRequestData(page, {
        userId: testState.userId,
        assessmentId: assessmentId
      });
      
      // Verify success
      const deleteResponse = await getResponseData(page);
      expect(deleteResponse).toHaveProperty('success', true);
      
      await page.screenshot({ 
        path: `./test_screenshots/test_page/frontend-integration/17-delete-assessment-${assessmentId}.png` 
      });
    }
    
    // Verify all deleted by checking assessments list
    await clickEndpoint(page, 'Assessment Endpoints', 'Get Assessments');
    const remainingAssessments = await getResponseData(page);
    
    // Check no test assessments remain
    for (const assessmentId of testState.assessmentIds) {
      const stillExists = remainingAssessments.some(a => a.id === assessmentId);
      expect(stillExists).toBeFalsy();
    }
  });
}); 