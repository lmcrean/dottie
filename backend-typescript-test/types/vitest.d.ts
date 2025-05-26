// Global types for Vitest
import 'vitest';

declare global {
  // Global Vi mocking namespace
  const vi: import('vitest').Vi;
  
  // Console mock types
  interface Console {
    log: import('vitest').MockedFunction<typeof console.log>;
    warn: import('vitest').MockedFunction<typeof console.warn>;
    error: import('vitest').MockedFunction<typeof console.error>;
    info: import('vitest').MockedFunction<typeof console.info>;
    debug: import('vitest').MockedFunction<typeof console.debug>;
  }
}

// Module augmentation for vi.mock functionality
declare module 'vitest' {
  interface MockedFunction<T extends (...args: any[]) => any> {
    mockResolvedValue(value: Awaited<ReturnType<T>>): this;
    mockRejectedValue(value: any): this;
    mockReturnValue(value: ReturnType<T>): this;
    mockImplementation(fn?: T): this;
    mockImplementationOnce(fn: T): this;
    mockReturnValueOnce(value: ReturnType<T>): this;
    mockResolvedValueOnce(value: Awaited<ReturnType<T>>): this;
    mockRejectedValueOnce(value: any): this;
  }
}

export {}; 