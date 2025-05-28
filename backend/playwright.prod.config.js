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
    baseURL: 'http://dottie-backend.vercel.app',
    trace: 'on-first-retry',
  },
  
  testMatch: '**/*.api.pw.spec.js',
  
  projects: [
    {
      name: 'api',
      use: {
        // No browser needed for API tests
      },
    }
  ],
}); 