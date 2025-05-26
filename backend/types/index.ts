// Re-export all common types for easy importing
export * from './common';

// Additional utility types
export type Partial<T> = {
    [P in keyof T]?: T[P];
};

export type Required<T> = {
    [P in keyof T]-?: T[P];
};

export type AnyObject = Record<string, any>;
export type AnyFunction = (...args: any[]) => any;
