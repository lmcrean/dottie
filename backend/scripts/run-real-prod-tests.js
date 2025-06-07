// Script to run real production integration tests with clean data handling
import { spawn } from "child_process";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { URLS } from "../test-utilities/urls.js";

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, "..");

// Set up environment variables
const env = {
  ...process.env,
  REAL_PROD_API_URL: process.env.REAL_PROD_API_URL || URLS.PROD,
  NODE_ENV: "production",
  USE_MOCKS: "false", // Explicitly disable mocks for real production tests
};

// Determine if we're on Windows
const isWindows = process.platform === "win32";

// Run the test command using the appropriate command for the OS
const command = isWindows ? "npx.cmd" : "npx";

// Run the test command
const testProcess = spawn(
  command,
  [
    "vitest",
    "run",
    "routes/auth/__tests__/e2e/prod/success/auth-real-integration.test.js",
  ],
  {
    cwd: rootDir,
    env,
    stdio: "inherit",
    shell: isWindows, // Use shell on Windows
  }
);

testProcess.on("error", (error) => {
  console.error(`Error running tests: ${error.message}`);
  process.exit(1);
});

testProcess.on("close", (code) => {
  if (code === 0) {

  } else {
    console.error(
      `❌ Real production integration tests failed with code ${code}`
    );
  }
  process.exit(code);
});
