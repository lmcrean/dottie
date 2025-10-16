import { defineConfig, devices } from '@playwright/test';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create screenshot directories if they don't exist - with improved structure
const createDirIfNotExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

// Create base screenshot directories
const screenshotsBaseDir = path.join(__dirname, 'test_screenshots');
createDirIfNotExists(screenshotsBaseDir);

// Create environment directories
const envs = ['development', 'production'];
const testTypes = ['test_page'];
const componentTests = ['api-connection', 'database-connection', 'both-connections'];
const testModes = ['mock', 'real'];

// Create the full directory structure
envs.forEach((env) => {
  testTypes.forEach((testType) => {
    componentTests.forEach((component) => {
      testModes.forEach((mode) => {
        const dir = path.join(screenshotsBaseDir, env, testType, component, mode);
        createDirIfNotExists(dir);
      });
    });
  });
});

// For backward compatibility during transition, keep the old directories too
const testPageDir = path.join(__dirname, 'test_screenshots/test_page');
const assessmentDir = path.join(__dirname, 'test_screenshots/assessment');

createDirIfNotExists(testPageDir);
createDirIfNotExists(assessmentDir);

// Reference: https://playwright.dev/docs/test-configuration
export default defineConfig({
  // Directory where tests are located - include both paths
  testDir: './',
  testMatch: ['**/__tests__/**/*.spec.ts', 'e2e/**/*.spec.ts'],

  // Run tests in files in parallel
  fullyParallel: true,

  // Limit to a single worker for sequential test execution
  workers: 1,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // No retries at all
  retries: 0,

  // Reporter to use
  reporter: 'html',

  // Shared settings for all projects
  use: {
    // Base URL to use in all tests
    // In CI: Use deployed URL from environment variable
    // Locally: Use localhost for development
    baseURL:
      process.env.WEB_DEPLOYMENT_URL || process.env.FIREBASE_HOSTING_URL || 'http://localhost:3005',

    // Collect trace when retrying a test
    trace: 'on-first-retry',

    // Screenshot on test completion
    screenshot: 'on'
  },

  // Configure projects for different browsers - ONLY SAFARI
  projects: [
    {
      name: 'safari',
      use: { ...devices['Desktop Safari'] }
    }
  ],

  // Global teardown
  globalTeardown: './global-teardown.ts',

  // Setup and teardown for the tests
  // Only start local servers when running locally (not in CI)
  webServer: process.env.CI
    ? undefined
    : [
        {
          command: 'cd ../backend && npm run dev:e2e',
          url: 'http://localhost:5005/api/setup/health/hello',
          reuseExistingServer: true,
          stdout: 'pipe',
          stderr: 'pipe',
          timeout: 120000
        },
        {
          command: 'npm run dev:frontend:e2e',
          url: 'http://localhost:3005',
          reuseExistingServer: true,
          stdout: 'pipe',
          stderr: 'pipe',
          timeout: 60000
        }
      ]
});
