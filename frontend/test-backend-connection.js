import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import axios from 'axios';

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// API configuration
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5000';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 3000
});

// Check if API is running
const isApiRunning = async () => {
  try {
    const response = await apiClient.get('/api/hello', { timeout: 1000 });

    return true;
  } catch (error) {
    console.error('API check failed:', error.message);
    return false;
  }
};

// Try to start the backend server
const startBackendServer = async () => {
  try {
    // Calculate paths
    const projectRoot = path.resolve(__dirname, '..');
    const backendDir = path.join(projectRoot, 'backend');
    const serverPath = path.join(backendDir, 'server.js');

    // Check if paths exist
    const fs = await import('fs');
    const backendExists = fs.existsSync(backendDir);
    const serverFileExists = fs.existsSync(serverPath);

    if (!backendExists || !serverFileExists) {
      console.error('❌ Required paths not found');
      return false;
    }

    // Find the Node executable path
    const nodeExecutable = process.execPath;

    const serverProcess = spawn(nodeExecutable, [serverPath], {
      cwd: backendDir,
      stdio: 'pipe',
      env: { ...process.env, PORT: '5000' }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`Backend server error: ${data.toString().trim()}`);
    });

    // Handle server exit
    serverProcess.on('exit', (code) => {});

    // Wait and check if server is running
    let serverStarted = false;
    for (let i = 0; i < 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (await isApiRunning()) {
        serverStarted = true;
        break;
      }
    }

    if (!serverStarted) {
      serverProcess.kill();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error starting server:', error);
    return false;
  }
};

// Run the main test function
const runTest = async () => {
  const apiRunning = await isApiRunning();

  if (apiRunning) {
    return;
  }

  await startBackendServer();
};

runTest().catch((error) => {
  console.error('Test failed:', error);
});
