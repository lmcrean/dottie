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
  timeout: 3000,
});

// Check if API is running
const isApiRunning = async () => {
  try {
    const response = await apiClient.get('/api/hello', { timeout: 1000 });
    console.log('API responded with:', response.data);
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

    // Debug info
    console.log('Current directory:', __dirname);
    console.log('Project root:', projectRoot);
    console.log('Backend directory:', backendDir);
    console.log('Server file path:', serverPath);

    // Check if paths exist
    const fs = await import('fs');
    const backendExists = fs.existsSync(backendDir);
    const serverFileExists = fs.existsSync(serverPath);

    console.log('Backend directory exists:', backendExists);
    console.log('Server file exists:', serverFileExists);

    if (!backendExists || !serverFileExists) {
      console.error('❌ Required paths not found');
      return false;
    }

    // Find the Node executable path
    const nodeExecutable = process.execPath;
    console.log('Using Node executable:', nodeExecutable);

    // Start the server
    console.log('Starting backend server...');
    const serverProcess = spawn(nodeExecutable, [serverPath], {
      cwd: backendDir,
      stdio: 'pipe',
      env: { ...process.env, PORT: '5000' }
    });

    // Log server output
    serverProcess.stdout.on('data', (data) => {
      console.log(`Backend server output: ${data.toString().trim()}`);
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`Backend server error: ${data.toString().trim()}`);
    });

    // Handle server exit
    serverProcess.on('exit', (code) => {
      console.log(`Backend server exited with code ${code}`);
    });

    // Wait and check if server is running
    let serverStarted = false;
    for (let i = 0; i < 10; i++) {
      console.log(`Waiting for server to start (attempt ${i + 1}/10)...`);
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (await isApiRunning()) {
        console.log('✅ Server is now running');
        serverStarted = true;
        break;
      }
    }

    if (!serverStarted) {
      console.error('❌ Server failed to start');
      serverProcess.kill();
      return false;
    }

    console.log('Press Ctrl+C to stop the server and exit');
    return true;
  } catch (error) {
    console.error('Error starting server:', error);
    return false;
  }
};

// Run the main test function
const runTest = async () => {
  console.log('Checking if API is already running...');
  const apiRunning = await isApiRunning();

  if (apiRunning) {
    console.log('✅ API is already running, no need to start the server');
    return;
  }

  console.log('API is not running, attempting to start the server...');
  await startBackendServer();
};

runTest().catch(error => {
  console.error('Test failed:', error);
});