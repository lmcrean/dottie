import { Page, TestInfo } from '@playwright/test';
import path from 'path';
import fs from 'fs';

// Directory for storing logs
const LOGS_DIR = path.join(process.cwd(), 'test-results/logs');

// Ensure logs directory exists
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

/**
 * Sets up console log capturing for the browser
 * @param page Playwright page object
 * @param testInfo TestInfo object to identify the test
 */
export const setupConsoleLogs = async (page: Page, testInfo: TestInfo): Promise<void> => {
  // Create log file path
  const testName = testInfo.title.replace(/\s+/g, '-').toLowerCase();
  const logFilePath = path.join(LOGS_DIR, `${testName}-browser-console.log`);
  
  // Create log file stream
  const logStream = fs.createWriteStream(logFilePath, { flags: 'w' });
  
  // Write header
  logStream.write(`Browser console logs for test: ${testInfo.title}\n`);
  logStream.write(`Test started at: ${new Date().toISOString()}\n\n`);
  
  // Listen for console events
  page.on('console', (msg) => {
    const text = `[${msg.type()}] ${msg.text()}\n`;
    
    // Write to log file
    logStream.write(text);
    
    // Also output to test console for visibility during test runs
    console.log(`[Browser Console] ${text.trim()}`);
  });
  
  // Listen for page errors
  page.on('pageerror', (error) => {
    const text = `[ERROR] ${error.message}\n${error.stack || ''}\n`;
    
    // Write to log file
    logStream.write(text);
    
    // Also output to test console
    console.log(`[Browser Error] ${error.message}`);
  });
  
  // Close the stream when the test is done - use afterEach hook instead of testInfo.on
  setTimeout(() => {
    logStream.end(`\nTest completed at: ${new Date().toISOString()}\n`);
  }, 100); // Small delay to ensure all logs are captured
};

/**
 * Captures a request/response pair and logs it
 * @param page Playwright page object
 * @param testInfo TestInfo object to identify the test
 */
export const captureNetworkLogs = async (page: Page, testInfo: TestInfo): Promise<void> => {
  // Create log file path
  const testName = testInfo.title.replace(/\s+/g, '-').toLowerCase();
  const logFilePath = path.join(LOGS_DIR, `${testName}-network.log`);
  
  // Create log file stream
  const logStream = fs.createWriteStream(logFilePath, { flags: 'w' });
  
  // Write header
  logStream.write(`Network logs for test: ${testInfo.title}\n`);
  logStream.write(`Test started at: ${new Date().toISOString()}\n\n`);
  
  // Listen for request events
  page.on('request', request => {
    logStream.write(`Request: ${request.method()} ${request.url()}\n`);
    
    const headers = request.headers();
    if (Object.keys(headers).length > 0) {
      logStream.write(`Headers: ${JSON.stringify(headers, null, 2)}\n`);
    }
    
    const postData = request.postData();
    if (postData) {
      logStream.write(`Body: ${postData}\n`);
    }
    
    logStream.write('\n');
  });
  
  // Listen for response events
  page.on('response', async response => {
    logStream.write(`Response: ${response.status()} ${response.url()}\n`);
    
    const headers = response.headers();
    if (Object.keys(headers).length > 0) {
      logStream.write(`Headers: ${JSON.stringify(headers, null, 2)}\n`);
    }
    
    // Try to get response body, but handle errors gracefully
    try {
      const contentType = response.headers()['content-type'] || '';
      if (contentType.includes('application/json')) {
        const json = await response.json().catch(() => null);
        if (json) {
          logStream.write(`Body: ${JSON.stringify(json, null, 2)}\n`);
        }
      } else if (contentType.includes('text/')) {
        const text = await response.text().catch(() => null);
        if (text) {
          logStream.write(`Body: ${text}\n`);
        }
      }
    } catch (error) {
      logStream.write(`Could not capture response body: ${error}\n`);
    }
    
    logStream.write('\n');
  });
  
  // Close the stream when the test is done - use setTimeout instead of testInfo.on
  setTimeout(() => {
    logStream.end(`\nTest completed at: ${new Date().toISOString()}\n`);
  }, 100); // Small delay to ensure all logs are captured
};

/**
 * Captures server logs by intercepting fetch requests to the backend
 * and extracting log information from responses
 * @param page Playwright page object
 */
export const captureServerLogs = async (page: Page, testInfo: TestInfo): Promise<void> => {
  // Create log file path
  const testName = testInfo.title.replace(/\s+/g, '-').toLowerCase();
  const logFilePath = path.join(LOGS_DIR, `${testName}-server.log`);
  
  // Create log file stream
  const logStream = fs.createWriteStream(logFilePath, { flags: 'w' });
  
  // Write header
  logStream.write(`Server logs for test: ${testInfo.title}\n`);
  logStream.write(`Test started at: ${new Date().toISOString()}\n\n`);
  
  // Add JS to page to capture and expose console.error calls on the backend
  await page.addInitScript(() => {
    // Store original fetch
    const originalFetch = window.fetch;
    
    // Override fetch to extract server logs
    window.fetch = async (...args) => {
      const response = await originalFetch(...args);
      
      // Clone response to read body (since response can only be consumed once)
      const clonedResponse = response.clone();
      
      try {
        // Check if there are logs in headers or in the response body
        const serverLogs = response.headers.get('X-Server-Logs');
        if (serverLogs) {
          console.log(`[Server Log] ${serverLogs}`);
        }
        
        // Try to extract logs from JSON responses
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await clonedResponse.json();
          if (data && data._testLogs) {
            console.log(`[Server Log] ${JSON.stringify(data._testLogs)}`);
          }
        }
      } catch (error) {
        // Ignore errors in log extraction
      }
      
      return response;
    };
  });
  
  // Listen for console events that might contain server logs
  page.on('console', (msg) => {
    if (msg.text().includes('[Server Log]')) {
      logStream.write(`${msg.text()}\n`);
    }
  });
  
  // Close the stream when the test is done - use setTimeout instead of testInfo.on
  setTimeout(() => {
    logStream.end(`\nTest completed at: ${new Date().toISOString()}\n`);
  }, 100); // Small delay to ensure all logs are captured
};

/**
 * Comprehensive setup for logging in Playwright tests
 * @param page Playwright page object
 * @param testInfo TestInfo object to identify the test
 */
export const setupAllLogging = async (page: Page, testInfo: TestInfo): Promise<void> => {
  await setupConsoleLogs(page, testInfo);
  await captureNetworkLogs(page, testInfo);
  await captureServerLogs(page, testInfo);
}; 