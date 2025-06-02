import { describe, it, expect } from 'vitest';
import * as apiIndex from '../index';

describe('conversation/api/index', () => {
  it('should export conversationApi', () => {
    expect(apiIndex.conversationApi).toBeDefined();
    expect(typeof apiIndex.conversationApi).toBe('object');
    expect(typeof apiIndex.conversationApi.fetchConversation).toBe('function');
  });

  it('should export conversationApi with correct structure', () => {
    expect(apiIndex.conversationApi).toHaveProperty('fetchConversation');
    expect(typeof apiIndex.conversationApi.fetchConversation).toBe('function');
  });

  it('should only export expected modules', () => {
    const exportKeys = Object.keys(apiIndex);
    expect(exportKeys).toEqual(['conversationApi']);
  });

  it('should not have undefined exports', () => {
    Object.values(apiIndex).forEach(exportValue => {
      expect(exportValue).toBeDefined();
      expect(exportValue).not.toBeNull();
    });
  });
}); 