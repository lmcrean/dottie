import { spawn } from 'child_process';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { process } from 'process';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to check if a port is already in use
function isPortInUse(port) {
  try {
    // This command will fail with non-zero exit code if port is not in use
    const command =
      process.platform === 'win32' ? `netstat -ano | findstr :${port}` : `lsof -i:${port}`;

    execSync(command, { stdio: 'ignore' });
    return true;
  } catch (e) {
    console.error(`Failed to connect to port: ${port}`, e);
    return false;
  }
}

// Define constants
const API_PORT = process.env.PORT || 5000;
// const API_URL = `http://localhost:${API_PORT}`;

if (isPortInUse(API_PORT)) {
  runTests();
} else {
  // Start the backend server
  const serverProcess = spawn('node', [path.join(__dirname, '..', 'backend', 'server.js')], {
    stdio: 'inherit',
    env: { ...process.env, PORT: API_PORT }
  });

  // Set a timeout to allow server to start
  setTimeout(() => {
    // Check if port is now in use
    if (isPortInUse(API_PORT)) {
      runTests();
    } else {
      console.error(`❌ Failed to start API server on port ${API_PORT}.`);
      process.exit(1);
    }
  }, 3000);

  // Clean up the server process when tests are done
  process.on('exit', () => {
    serverProcess.kill();
  });

  // Handle termination signals
  process.on('SIGINT', () => {
    serverProcess.kill();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    serverProcess.kill();
    process.exit(0);
  });
}

function runTests() {
  // Run the tests using vitest
  const testProcess = spawn('npm', ['test', '--', 'GetApiMessage'], {
    stdio: 'inherit',
    shell: true
  });

  testProcess.on('close', (code) => {
    process.exit(code);
  });
}
