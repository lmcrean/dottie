/**
 * Type declarations for logger service
 * Re-exports types from logger.ts for .js imports
 */

export interface Logger {
  info(...args: any[]): void;
  error(...args: any[]): void;
  warn(...args: any[]): void;
  debug(...args: any[]): void;
}

declare const logger: Logger;
export default logger;
