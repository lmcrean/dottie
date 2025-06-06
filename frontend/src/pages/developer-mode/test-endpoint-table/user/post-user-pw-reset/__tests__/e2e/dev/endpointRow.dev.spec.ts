import { test, expect } from '@playwright/test';

test.describe('Password Reset Endpoint Tests', () => {
  test('should render the password reset endpoint component', async ({ page }) => {
    // Navigate to the test page
    await page.goto('/test-page');
    
    // Find the password reset endpoint button by its text content
    const endpointButton = page.getByText('POST /api/user/pw/reset');
    await expect(endpointButton).toBeVisible();
    
    // Verify the method is POST
    const methodLabel = page.getByText('POST', { exact: true }).first();
    await expect(methodLabel).toBeVisible();
    
    // Click the button to reveal the form
    await endpointButton.click();
    
    // Find the email input field
    const emailInput = page.getByPlaceholder('user@example.com');
    await expect(emailInput).toBeVisible();
    
    // Verify expected output format is shown
    const expectedOutputSection = page.getByText('We have sent a password reset link to', { exact: false });
    await expect(expectedOutputSection).toBeVisible();
  });
  
  test('should handle form submission with email', async ({ page }) => {
    // Navigate to the test page
    await page.goto('/test-page');
    
    // Find the password reset endpoint button
    const endpointButton = page.getByText('POST /api/user/pw/reset');
    await expect(endpointButton).toBeVisible();
    
    // Click the button to reveal the form
    await endpointButton.click();
    
    // Enter an email address
    const emailInput = page.getByPlaceholder('user@example.com');
    await expect(emailInput).toBeVisible();
    await emailInput.fill('test@example.com');
    
    // Mock the API response
    await page.route('/api/user/pw/reset', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'We have sent a password reset link to test@example.com'
        })
      });
    });
    
    // Click the submit button
    const submitButton = page.getByRole('button', { name: 'Submit' });
    await submitButton.click();
    
    // Wait for the response to be displayed
    const responseOutput = page.getByText('We have sent a password reset link to', { exact: false });
    await expect(responseOutput).toBeVisible();
  });
  
  test('should handle form submission without email', async ({ page }) => {
    // Navigate to the test page
    await page.goto('/test-page');
    
    // Find the password reset endpoint button
    const endpointButton = page.getByText('POST /api/user/pw/reset');
    await expect(endpointButton).toBeVisible();
    
    // Click the button to reveal the form
    await endpointButton.click();
    
    // Leave the email input empty
    
    // Mock the API response
    await page.route('/api/user/pw/reset', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          message: 'If a user with that email exists, a password reset link has been sent'
        })
      });
    });
    
    // Click the submit button
    const submitButton = page.getByRole('button', { name: 'Submit' });
    await submitButton.click();
    
    // Wait for the response to be displayed
    const responseOutput = page.getByText('If a user with that email exists', { exact: false });
    await expect(responseOutput).toBeVisible();
  });
}); 