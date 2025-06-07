import { describe, it, expect } from 'vitest';
import * as dataIndex from '../index';

describe('conversation/hooks/data/index', () => {
  it('should export useConversationData', () => {
    expect(dataIndex.useConversationData).toBeDefined();
    expect(typeof dataIndex.useConversationData).toBe('function');
  });

  it('should export useConversationState', () => {
    expect(dataIndex.useConversationState).toBeDefined();
    expect(typeof dataIndex.useConversationState).toBe('function');
  });

  it('should export useConversationLoader', () => {
    expect(dataIndex.useConversationLoader).toBeDefined();
    expect(typeof dataIndex.useConversationLoader).toBe('function');
  });

  it('should export all required data hooks without missing exports', () => {
    const expectedExports = [
      'useConversationData',
      'useConversationState',
      'useConversationLoader'
    ];

    expectedExports.forEach(exportName => {
      expect(dataIndex).toHaveProperty(exportName);
      expect(dataIndex[exportName as keyof typeof dataIndex]).toBeDefined();
    });
  });

  it('should only export expected data hooks', () => {
    const exportKeys = Object.keys(dataIndex);
    const expectedExports = [
      'useConversationData',
      'useConversationState',
      'useConversationLoader'
    ];

    expect(exportKeys).toHaveLength(expectedExports.length);
    exportKeys.forEach(key => {
      expect(expectedExports).toContain(key);
    });
  });

  it('should not have undefined exports', () => {
    Object.values(dataIndex).forEach(exportValue => {
      expect(exportValue).toBeDefined();
      expect(exportValue).not.toBeNull();
      expect(typeof exportValue).toBe('function');
    });
  });
}); 