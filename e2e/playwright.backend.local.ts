import { defineConfig } from '@playwright/test';

/**
 * Playwright configuration for backend local development testing
 * Backend API: http://localhost:5000 (Windows/Linux) or http://localhost:5001 (macOS)
 */
export default defineConfig({
  testDir: './backend',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : 1,
  reporter: [
    ['html'],
    ['junit', { outputFile: 'test-results/backend-junit.xml' }]
  ],
  
  use: {
    baseURL: 'http://localhost:5000',
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

  webServer: {
    command: 'cd backend && npm run dev',
    port: 5000,
    reuseExistingServer: !process.env.CI,
    env: {
      NODE_ENV: 'test',
      PORT: '5000'
    }
  },

  // API-specific timeouts
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
});