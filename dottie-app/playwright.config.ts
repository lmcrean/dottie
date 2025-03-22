import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { spawn } from 'child_process';

// Reference: https://playwright.dev/docs/test-configuration
export default defineConfig({
  // Directory where tests are located
  testDir: path.join(__dirname, 'app/test_page/__tests__/e2e'),
  
  // Run tests in files in parallel
  fullyParallel: true,
  
  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry on CI only
  retries: process.env.CI ? 2 : 0,
  
  // Reporter to use
  reporter: 'html',
  
  // Shared settings for all projects
  use: {
    // Base URL to use in all tests
    baseURL: 'http://localhost:3000',
    
    // Collect trace when retrying a test
    trace: 'on-first-retry',
    
    // Only use Safari as specified in the requirements
    ...devices['Desktop Safari'],
  },
  
  // Configure projects for different browsers
  projects: [
    {
      name: 'safari',
      use: {
        ...devices['Desktop Safari'],
      },
    },
  ],
  
  // Setup and teardown for the tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 60000, // 60 seconds
  },
}); 