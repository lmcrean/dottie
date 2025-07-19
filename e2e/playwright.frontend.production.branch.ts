import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for frontend branch/PR deployment testing
 * Frontend: https://dottie-app--branch-{pr_number}-{hash}.web.app
 * Backend: https://api-{branch}.dottie-app.a.run.app
 */
export default defineConfig({
  testDir: './frontend',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 1,
  workers: process.env.CI ? 2 : 1,
  reporter: [
    ['html'],
    ['github'],
    ['junit', { outputFile: 'test-results/frontend-junit.xml' }]
  ],
  
  use: {
    baseURL: process.env.FRONTEND_URL || 'https://dottie-app--branch-main-123.web.app',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    // Safari focus as mentioned in CLAUDE.md
    {
      name: 'webkit-desktop',
      use: { ...devices['Desktop Safari'] },
      dependencies: ['setup'],
    },
    {
      name: 'webkit-mobile',
      use: { ...devices['iPhone 12'] },
      dependencies: ['setup'],
    },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
  ],

  // No web server needed - testing deployed applications
  
  // Global test configuration
  globalSetup: require.resolve('./global-setup.ts'),
  globalTeardown: require.resolve('./global-teardown.ts'),
  
  // Test timeouts - longer for deployed environments
  timeout: 60000,
  expect: {
    timeout: 10000,
  },

  // Environment specific settings
  use: {
    ...defineConfig({}).use,
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
  },
});