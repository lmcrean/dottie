/**
 * Token Manager Types
 * Shared types for the token manager modules
 */

export interface MemoryStorage {
  [key: string]: string | null;
}

export type StorageKey = string;
export type StorageValue = string | null;
