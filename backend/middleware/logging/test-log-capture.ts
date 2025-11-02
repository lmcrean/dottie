/**
 * Middleware to capture console logs and expose them in API responses
 * for Playwright tests to capture.
 *
 * This should only be enabled in test environments.
 */

import { Request, Response, NextFunction } from 'express';

const testLogCaptureMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  // Skip if not in test mode
  if (process.env.NODE_ENV !== 'test') {
    return next();
  }

  // Store original console methods
  const originalConsoleLog = console.log;
  const originalConsoleInfo = console.info;
  const originalConsoleWarn = console.warn;
  const originalConsoleError = console.error;

  // Array to store captured logs
  const logs: string[] = [];

  // Helper to format log arguments
  const formatLogArgs = (args: any[]): string => {
    return args.map(arg => {
      if (arg instanceof Error) {
        return `${arg.message}\n${arg.stack || ''}`;
      }
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg);
        } catch (e) {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');
  };

  // Override console methods to capture logs
  console.log = (...args: any[]): void => {
    originalConsoleLog.apply(console, args);
    logs.push(`[LOG] ${formatLogArgs(args)}`);
  };

  console.info = (...args: any[]): void => {
    originalConsoleInfo.apply(console, args);
    logs.push(`[INFO] ${formatLogArgs(args)}`);
  };

  console.warn = (...args: any[]): void => {
    originalConsoleWarn.apply(console, args);
    logs.push(`[WARN] ${formatLogArgs(args)}`);
  };

  console.error = (...args: any[]): void => {
    originalConsoleError.apply(console, args);
    logs.push(`[ERROR] ${formatLogArgs(args)}`);
  };

  // Restore console methods when response is sent
  res.on('finish', () => {
    console.log = originalConsoleLog;
    console.info = originalConsoleInfo;
    console.warn = originalConsoleWarn;
    console.error = originalConsoleError;
  });

  // Store logs on response object for later use
  res.locals.testLogs = logs;

  // Override res.json to include logs in response
  const originalJson = res.json.bind(res);
  res.json = function(body: any): Response {
    // Add logs to response if in test mode
    if (body && typeof body === 'object') {
      body._testLogs = logs;
    }

    // Add logs to response headers (limited to avoid header size limits)
    if (logs.length > 0) {
      const logSummary = logs.slice(0, 5);
      if (logs.length > 5) {
        logSummary.push(`... and ${logs.length - 5} more logs`);
      }
      res.set('X-Server-Logs', JSON.stringify(logSummary));
    }

    return originalJson(body);
  };

  // Override res.send to include logs in response for non-JSON responses
  const originalSend = res.send.bind(res);
  res.send = function(body: any): Response {
    // Add logs to response headers (limited to avoid header size limits)
    if (logs.length > 0) {
      const logSummary = logs.slice(0, 5);
      if (logs.length > 5) {
        logSummary.push(`... and ${logs.length - 5} more logs`);
      }
      res.set('X-Server-Logs', JSON.stringify(logSummary));
    }

    return originalSend(body);
  };

  next();
};

export default testLogCaptureMiddleware;
