// Global setup for Vitest tests
import { vi } from 'vitest';

// Extend Vitest matchers
declare global {
  namespace Vi {
    interface JestAssertion<T = any> extends jest.Matchers<void, T> {}
  }
}

// Global mock helpers
global.vi = vi;

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
};

export {}; 
