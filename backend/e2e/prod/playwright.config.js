// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './',
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html'], ['list']],
  use: {
    baseURL: 'http://dottie-backend.vercel.app',
    trace: 'on-first-retry',
  },
  
  // Specific file pattern for production tests
  testMatch: '**/*.api.pw.spec.js',

  // No webServer configuration for prod tests as we're testing the deployed instance

  // Create separate projects for API tests and browser tests
  projects: [
    {
      name: 'api',
      use: {
        // No browser needed for API tests
      },
      testMatch: '**/*.api.pw.spec.js',
    },
    {
      name: 'browser',
      use: {
        // Using only Safari as per instructions
        browserName: 'webkit',
      },
      testMatch: '**/*.ui.pw.spec.js',
    },
  ],
}); 