import { expect } from '@playwright/test';
import { fillRequestData, getResponseData } from './auth.js';

/**
 * Test runner for assessment endpoints
 * 
 * Handles testing assessment-related endpoints:
 * - Create Assessment
 * - Get Assessments
 * - Get Assessment by ID
 * - Delete Assessment
 */

/**
 * Captures screenshots for the assessment endpoints tests
 * @param {string} testName 
 * @returns {string} Screenshot path
 */
const getScreenshotPath = (testName) => `./test_screenshots/test_page/frontend-integration/assessment/${testName}.png`;

/**
 * Runs all assessment endpoint tests
 * @param {Object} page Playwright page
 * @param {object} testState Test state with user data
 * @returns {object} Updated test state with assessment IDs
 */
export async function runAssessmentTests(page, testState) {
  if (!testState.assessmentIds) {
    testState.assessmentIds = [];
  }
  
  await testCreateAssessment(page, testState);
  await testGetAssessments(page, testState);
  await testCreateSecondAssessment(page, testState);
  await testGetAssessmentById(page, testState);
  
  return testState;
}

/**
 * Tests the create assessment endpoint for first assessment
 * @param {Object} page Playwright page
 * @param {object} testState Test state with user data
 */
export async function testCreateAssessment(page, testState) {
  console.log('Running create assessment endpoint test');
  
  // Navigate to the test page if needed
  const url = page.url();
  if (!url.includes('/test-page')) {
    await page.goto('/test-page');
  }
  
  // Find the create assessment button
  const createButton = page.getByRole('button', { name: /POST \/api\/assessments/i });
  
  // Ensure the button is visible
  await createButton.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500); // Small wait for animations
  
  // Click the button
  await createButton.click();
  console.log('Clicked create assessment button');
  
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
  
  await page.screenshot({ path: getScreenshotPath('create-assessment') });
  
  // Verify response content
  const responseData = await getResponseData(page);
  expect(responseData).toHaveProperty('id');
  
  // Save assessment ID for later tests
  testState.assessmentIds.push(responseData.id);
  console.log('Created assessment:', responseData.id);
  
  console.log('Create assessment endpoint test completed successfully');
}

/**
 * Tests the get assessments endpoint
 * @param {Object} page Playwright page
 * @param {object} testState Test state with user data
 */
export async function testGetAssessments(page, testState) {
  console.log('Running get assessments endpoint test');
  
  // Find the get assessments button
  const getButton = page.getByRole('button', { name: /GET \/api\/assessments/i });
  
  // Ensure the button is visible
  await getButton.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500); // Small wait for animations
  
  // Click the button
  await getButton.click();
  console.log('Clicked get assessments button');
  
  // Wait for response
  await page.waitForSelector('.api-response', { timeout: 15000 });
  await page.screenshot({ path: getScreenshotPath('get-assessments') });
  
  // Verify response content
  const assessmentsList = await getResponseData(page);
  expect(Array.isArray(assessmentsList)).toBeTruthy();
  expect(assessmentsList.length).toBeGreaterThanOrEqual(1);
  
  // Verify our assessment is in the list
  const hasAssessment = assessmentsList.some((a) => a.id === testState.assessmentIds[0]);
  expect(hasAssessment).toBeTruthy();
  
  console.log('Get assessments endpoint test completed successfully');
}

/**
 * Tests the create assessment endpoint for second assessment
 * @param {Object} page Playwright page
 * @param {object} testState Test state with user data
 */
export async function testCreateSecondAssessment(page, testState) {
  console.log('Running create second assessment endpoint test');
  
  // Find the create assessment button
  const createButton = page.getByRole('button', { name: /POST \/api\/assessments/i });
  
  // Ensure the button is visible
  await createButton.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500); // Small wait for animations
  
  // Click the button
  await createButton.click();
  console.log('Clicked create assessment button');
  
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
  
  await page.screenshot({ path: getScreenshotPath('create-second-assessment') });
  
  // Verify response content
  const responseData = await getResponseData(page);
  expect(responseData).toHaveProperty('id');
  
  // Save assessment ID for later tests
  testState.assessmentIds.push(responseData.id);
  console.log('Created second assessment:', responseData.id);
  
  console.log('Create second assessment endpoint test completed successfully');
}

/**
 * Tests the get assessment by ID endpoint
 * @param {Object} page Playwright page
 * @param {object} testState Test state with user data
 */
export async function testGetAssessmentById(page, testState) {
  console.log('Running get assessment by ID endpoint test');
  
  // Find the get assessment by ID button
  const getByIdButton = page.getByRole('button', { name: /GET \/api\/assessments\/\:assessmentId/i });
  
  // Ensure the button is visible
  await getByIdButton.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500); // Small wait for animations
  
  // Click the button
  await getByIdButton.click();
  console.log('Clicked get assessment by ID button');
  
  // Fill assessment ID
  await fillRequestData(page, {
    assessmentId: testState.assessmentIds[0]
  });
  
  await page.screenshot({ path: getScreenshotPath('get-assessment-by-id') });
  
  // Verify response content
  const assessment = await getResponseData(page);
  expect(assessment).toHaveProperty('id', testState.assessmentIds[0]);
  expect(assessment).toHaveProperty('user_id', testState.userId);
  
  console.log('Get assessment by ID endpoint test completed successfully');
}

/**
 * Tests the delete assessment endpoint
 * @param {Object} page Playwright page
 * @param {object} testState Test state with user data
 */
export async function testDeleteAssessments(page, testState) {
  console.log('Running delete assessments endpoint test');
  
  // Delete each assessment
  for (const assessmentId of testState.assessmentIds) {
    // Find the delete assessment button
    const deleteButton = page.getByRole('button', { name: /DELETE \/api\/assessments\/\:assessmentId/i });
    
    // Ensure the button is visible
    await deleteButton.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500); // Small wait for animations
    
    // Click the button
    await deleteButton.click();
    console.log(`Clicked delete assessment button for ID: ${assessmentId}`);
    
    // Fill assessment ID
    await fillRequestData(page, {
      userId: testState.userId,
      assessmentId: assessmentId
    });
    
    await page.screenshot({ path: getScreenshotPath(`delete-assessment-${assessmentId}`) });
    
    // Verify response content
    const deleteResponse = await getResponseData(page);
    expect(deleteResponse).toHaveProperty('success', true);
    
    console.log(`Deleted assessment: ${assessmentId}`);
  }
  
  // Verify all deleted by checking assessments list
  const getButton = page.getByRole('button', { name: /GET \/api\/assessments/i });
  await getButton.scrollIntoViewIfNeeded();
  await getButton.click();
  
  // Wait for response
  await page.waitForSelector('.api-response', { timeout: 15000 });
  
  // Get remaining assessments
  const remainingAssessments = await getResponseData(page);
  
  // Check no test assessments remain
  for (const assessmentId of testState.assessmentIds) {
    const stillExists = remainingAssessments.some((a) => a.id === assessmentId);
    expect(stillExists).toBeFalsy();
  }
  
  console.log('Delete assessments endpoint test completed successfully');
} 