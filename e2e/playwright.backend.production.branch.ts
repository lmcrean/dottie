import { defineConfig } from '@playwright/test';

/**
 * Playwright configuration for backend branch/PR deployment testing
 * Backend API: https://api-{branch}.dottie-app.a.run.app
 */
export default defineConfig({
  testDir: './backend',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 1,
  workers: process.env.CI ? 2 : 1,
  reporter: [
    ['html'],
    ['github'],
    ['junit', { outputFile: 'test-results/backend-junit.xml' }]
  ],
  
  use: {
    baseURL: process.env.API_DEPLOYMENT_URL || 'https://api-main.dottie-app.a.run.app',
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
  },

  // Single project for API testing - no browser needed
  projects: [
    {
      name: 'api-tests',
      testMatch: /.*\.spec\.js$/,
    },
  ],

  // No web server needed - testing deployed API
  
  // API-specific timeouts - longer for production environment
  timeout: 60000,
  expect: {
    timeout: 10000,
  },
});