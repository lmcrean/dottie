# Backend Logging Middleware for Playwright Tests

This middleware captures server-side logs and exposes them in API responses so they can be captured by Playwright tests.

## Features

- Captures all console logs (log, info, warn, error)
- Adds logs to API response bodies and headers
- Only active in test environments (NODE_ENV=test)
- Restores original console methods after each request

## How to Use

### 1. Register the middleware in your Express app

```javascript
// In your app.js or server.js
const express = require('express');
const { testLogCaptureMiddleware } = require('./middleware/logging');

const app = express();

// Register the middleware early (before other middleware)
if (process.env.NODE_ENV === 'test') {
  app.use(testLogCaptureMiddleware);
}

// ... rest of your Express setup
```

### 2. Set up Playwright to capture these logs

The logs will be exposed in:

1. Response headers as `X-Server-Logs`
2. Response bodies as `_testLogs` property (for JSON responses)

See the frontend Playwright logging utilities for capturing these logs during tests.

## How It Works

1. When a request comes in, the middleware overrides the console methods
2. All logs during request processing are captured
3. Before sending the response, logs are added to the response
4. After the response is sent, original console methods are restored

## Limitations

- Only captures logs that occur during the processing of an HTTP request
- Cannot capture logs that happen outside the request lifecycle
- Large logs are truncated in headers to avoid header size limits

## Example

```javascript
// Your API route
app.get('/api/users', (req, res) => {
  console.log('Fetching users'); // This will be captured
  console.error('Database error'); // This will be captured
  
  res.json({ users: [] }); 
  // Response will include:
  // { 
  //   users: [],
  //   _testLogs: ["[LOG] Fetching users", "[ERROR] Database error"]
  // }
});
``` 