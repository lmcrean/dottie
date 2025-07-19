import { defineConfig } from '@playwright/test';

/**
 * Playwright configuration for backend production deployment testing
 * Backend API: https://api-main.dottie-app.a.run.app
 */
export default defineConfig({
  testDir: './backend',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 1,
  workers: process.env.CI ? 3 : 2,
  reporter: [
    ['html'],
    ['github'],
    ['junit', { outputFile: 'test-results/backend-junit.xml' }],
    ['json', { outputFile: 'test-results/backend-results.json' }]
  ],
  
  use: {
    baseURL: 'https://api-main.dottie-app.a.run.app',
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