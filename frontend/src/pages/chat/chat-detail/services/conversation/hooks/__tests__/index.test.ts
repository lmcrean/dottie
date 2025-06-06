import { describe, it, expect } from 'vitest';
import * as hooksIndex from '../index';

describe('conversation/hooks/index', () => {
  it('should export useConversationPageState', () => {
    expect(hooksIndex.useConversationPageState).toBeDefined();
    expect(typeof hooksIndex.useConversationPageState).toBe('function');
  });

  it('should export useConversationData', () => {
    expect(hooksIndex.useConversationData).toBeDefined();
    expect(typeof hooksIndex.useConversationData).toBe('function');
  });

  it('should export useConversationNavigation', () => {
    expect(hooksIndex.useConversationNavigation).toBeDefined();
    expect(typeof hooksIndex.useConversationNavigation).toBe('function');
  });

  it('should export all required hooks without missing exports', () => {
    const expectedExports = [
      'useConversationPageState',
      'useConversationData',
      'useConversationNavigation'
    ];

    expectedExports.forEach(exportName => {
      expect(hooksIndex).toHaveProperty(exportName);
      expect(hooksIndex[exportName as keyof typeof hooksIndex]).toBeDefined();
    });
  });

  it('should only export expected hooks', () => {
    const exportKeys = Object.keys(hooksIndex);
    const expectedExports = [
      'useConversationPageState',
      'useConversationData',
      'useConversationNavigation'
    ];

    expect(exportKeys).toHaveLength(expectedExports.length);
    exportKeys.forEach(key => {
      expect(expectedExports).toContain(key);
    });
  });

  it('should not have undefined exports', () => {
    Object.values(hooksIndex).forEach(exportValue => {
      expect(exportValue).toBeDefined();
      expect(exportValue).not.toBeNull();
      expect(typeof exportValue).toBe('function');
    });
  });

  it('should export hooks with correct function signatures', () => {
    // All exports should be functions (React hooks)
    expect(typeof hooksIndex.useConversationPageState).toBe('function');
    expect(typeof hooksIndex.useConversationData).toBe('function');
    expect(typeof hooksIndex.useConversationNavigation).toBe('function');
  });
}); 