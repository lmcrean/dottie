// @ts-check
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html"], ["list"]],
  use: {
    baseURL: "http://localhost:5000",
    trace: "on-first-retry",
  },

  // Create separate projects for API tests and browser tests
  projects: [
    {
      name: "api",
      use: {
        // No browser needed for API tests
      },
      testMatch: /.*api.*\.test\.js/,
    },
    {
      name: "browser",
      use: {
        browserName: "webkit",
      },
      testIgnore: /.*api.*\.test\.js/,
    },
  ],
});
