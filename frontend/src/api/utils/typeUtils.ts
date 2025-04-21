/**
 * Utility functions to help with TypeScript type assertions for API responses
 */

/**
 * Type assertion function for API responses
 * Safely casts unknown response data to the expected type
 */
export function assertType<T>(data: unknown): T {
  return data as T;
}

/**
 * Helper for safely accessing properties on unknown objects
 */
export function safeGet<T>(obj: unknown, key: string, defaultValue: T): T {
  if (obj && typeof obj === 'object' && key in obj) {
    return (obj as Record<string, any>)[key] as T;
  }
  return defaultValue;
} 