# Playwright Logging Utilities

This document explains how to capture both frontend console logs and backend server logs during Playwright test runs.

## Features

These utilities provide:

1. **Browser Console Logs** - Captures all console.log, console.error, console.warn, etc.
2. **JavaScript Errors** - Captures any uncaught exceptions in the browser
3. **Network Logs** - Records all HTTP requests and responses
4. **Server Logs** - Attempts to capture backend logs via response headers and response bodies

## How to Use

### Basic Setup

In your test file, import the logging utilities and set them up in the `beforeEach` hook:

```typescript
import { test } from '@playwright/test';
import { setupAllLogging } from './utils/logging-utils';

test.describe('Your Test Suite', () => {
  // Setup logging for each test
  test.beforeEach(async ({ page }, testInfo) => {
    // Set up comprehensive logging
    await setupAllLogging(page, testInfo);
  });

  test('your test case', async ({ page }) => {
    // Your test code here
  });
});
```

### Individual Logging Components

If you only need specific types of logs, you can use individual functions:

```typescript
import { test } from '@playwright/test';
import { 
  setupConsoleLogs, 
  captureNetworkLogs,
  captureServerLogs 
} from './utils/logging-utils';

test.beforeEach(async ({ page }, testInfo) => {
  // Choose which logs to capture
  await setupConsoleLogs(page, testInfo);
  // await captureNetworkLogs(page, testInfo);
  // await captureServerLogs(page, testInfo);
});
```

## Log Files

Logs are saved to the `test-results/logs` directory with filenames based on the test name:

- `{test-name}-browser-console.log` - Browser console logs
- `{test-name}-network.log` - Network request/response logs
- `{test-name}-server.log` - Server logs (if available)

## Server-Side Logging

For optimal server log capturing, consider adding the following to your backend Express routes:

```javascript
// Example Express middleware to expose logs in response headers
app.use((req, res, next) => {
  // Store original console methods
  const originalConsoleError = console.error;
  const logs = [];
  
  // Override console.error to capture logs
  console.error = (...args) => {
    // Call original method
    originalConsoleError(...args);
    
    // Capture the log
    logs.push(['ERROR', ...args].map(arg => 
      typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
    ).join(' '));
  };
  
  // Add logs to response headers
  res.on('finish', () => {
    // Restore original methods
    console.error = originalConsoleError;
  });
  
  // Attach logs to the response object for later use
  res.locals.logs = logs;
  
  // Monkey patch res.json to include logs
  const originalJson = res.json;
  res.json = function(body) {
    // If body is already an object, add logs
    if (body && typeof body === 'object') {
      body.logs = res.locals.logs;
    }
    
    // Add logs header if there are any
    if (logs.length > 0) {
      res.set('X-Server-Logs', JSON.stringify(logs));
    }
    
    return originalJson.call(this, body);
  };
  
  next();
});
```

## Running Tests with Logging

To run tests with logging enabled:

```bash
npx playwright test
```

The logs will be available in the `test-results/logs` directory after the tests complete.

## Troubleshooting

- If logs aren't being captured, check that the test is actually completing (not hanging)
- For server logs, make sure your API responses include the `X-Server-Logs` header or a `logs` field in the JSON response
- Network logs might be large - consider filtering them if you're only interested in specific endpoints 