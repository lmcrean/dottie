#!/usr/bin/env node

/**
 * Script to run dev tests with backend server logs visible
 * This helps debug and compare dev vs prod behavior
 */

import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

console.log('🔧 Starting Backend Server with Detailed Logging...');

// Start the backend server first
const serverProcess = spawn('npm', ['run', 'dev'], {
  cwd: rootDir,
  stdio: 'inherit',
  env: {
    ...process.env,
    NODE_ENV: 'development',
    DEBUG: '*',
  },
  shell: true
});

// Wait a bit for server to start
setTimeout(() => {
  console.log('\n🧪 Running Dev Tests...');
  
  // Run the tests
  const testProcess = spawn('npx', [
    'playwright', 'test', 
    'e2e/dev/master-integration.api.pw.spec.js',
    '-c', 'playwright.dev.config.js',
    '--reporter=list'
  ], {
    cwd: rootDir,
    stdio: 'inherit',
    env: {
      ...process.env,
      NODE_ENV: 'development',
    },
    shell: true
  });

  testProcess.on('close', (code) => {
    console.log(`\n📝 Tests completed with code: ${code}`);
    
    // Kill the server
    serverProcess.kill('SIGTERM');
    
    setTimeout(() => {
      process.exit(code);
    }, 1000);
  });

  testProcess.on('error', (error) => {
    console.error('Test error:', error);
    serverProcess.kill('SIGTERM');
    process.exit(1);
  });

}, 5000);

serverProcess.on('error', (error) => {
  console.error('Server error:', error);
  process.exit(1);
});

// Handle cleanup
process.on('SIGINT', () => {
  console.log('\n🛑 Cleaning up...');
  serverProcess.kill('SIGTERM');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Cleaning up...');
  serverProcess.kill('SIGTERM');
  process.exit(0);
}); 