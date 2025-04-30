import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// Clean up after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock localStorage for tests
class LocalStorageMock implements Storage {
  [name: string]: unknown;
  length: number = 0;
  store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value;
    this.length = Object.keys(this.store).length;
  }

  removeItem(key: string): void {
    delete this.store[key];
    this.length = Object.keys(this.store).length;
  }

  clear(): void {
    this.store = {};
    this.length = 0;
  }

  key(index: number): string | null {
    const keys = Object.keys(this.store);
    return index < keys.length ? keys[index] : null;
  }
}

// Set up global mocks
Object.defineProperty(window, 'localStorage', {
  value: new LocalStorageMock()
});
