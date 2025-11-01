/**
 * Simple logger service
 */

/**
 * Logger interface for application-wide logging
 */
interface Logger {
  info(...args: any[]): void;
  error(...args: any[]): void;
  warn(...args: any[]): void;
  debug(...args: any[]): void;
}

const logger: Logger = {
  info: (...args: any[]): void => {
    // Info logging is disabled by default
  },
  error: (...args: any[]): void => {
    console.error(new Date().toISOString(), '[ERROR]', ...args);
  },
  warn: (...args: any[]): void => {
    console.warn(new Date().toISOString(), '[WARN]', ...args);
  },
  debug: (...args: any[]): void => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(new Date().toISOString(), '[DEBUG]', ...args);
    }
  }
};

export default logger;
