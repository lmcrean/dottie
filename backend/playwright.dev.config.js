// @ts-check
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e/dev',
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
    baseURL: 'http://localhost:5000',
    trace: 'on-first-retry',
  },
  
  // Specific file pattern for API tests
  testMatch: '**/*.api.pw.spec.js',

  // Configure webServer to automatically start the backend server during tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5000/api/setup/health/hello',
    reuseExistingServer: !process.env.CI,
    timeout: 60000,
    // Enable stdout/stderr to capture backend console logs
    stdout: 'pipe',
    stderr: 'pipe',
  },

  // Create a project for API testing
  projects: [
    {
      name: 'api',
      use: {
        // No browser needed for API tests
      },
    }
  ],
}); 