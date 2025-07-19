import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for frontend production deployment testing
 * Frontend: https://dottie-app.web.app
 * Backend: https://api-main.dottie-app.a.run.app
 */
export default defineConfig({
  testDir: './frontend',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 1,
  workers: process.env.CI ? 3 : 2,
  reporter: [
    ['html'],
    ['github'],
    ['junit', { outputFile: 'test-results/frontend-junit.xml' }],
    ['json', { outputFile: 'test-results/frontend-results.json' }]
  ],
  
  use: {
    baseURL: 'https://dottie-app.web.app',
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
      name: 'webkit-tablet',
      use: { ...devices['iPad Pro'] },
      dependencies: ['setup'],
    },
    // Additional browsers for comprehensive testing
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] },
      dependencies: ['setup'],
    },
  ],

  // No web server needed - testing deployed applications
  
  // Global test configuration
  globalSetup: require.resolve('./global-setup.ts'),
  globalTeardown: require.resolve('./global-teardown.ts'),
  
  // Test timeouts - longer for production environment
  timeout: 60000,
  expect: {
    timeout: 10000,
  },

  // Production environment specific settings
  use: {
    ...defineConfig({}).use,
    extraHTTPHeaders: {
      'Accept': 'application/json',
    },
  },
});