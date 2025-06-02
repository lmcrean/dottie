import { describe, it, expect } from 'vitest';
import * as conversationIndex from '../index';

describe('conversation/index', () => {
  it('should export conversationApi', () => {
    expect(conversationIndex.conversationApi).toBeDefined();
    expect(typeof conversationIndex.conversationApi).toBe('object');
    expect(typeof conversationIndex.conversationApi.fetchConversation).toBe('function');
  });

  it('should export useConversationPageState', () => {
    expect(conversationIndex.useConversationPageState).toBeDefined();
    expect(typeof conversationIndex.useConversationPageState).toBe('function');
  });

  it('should export useConversationData', () => {
    expect(conversationIndex.useConversationData).toBeDefined();
    expect(typeof conversationIndex.useConversationData).toBe('function');
  });

  it('should export useConversationNavigation', () => {
    expect(conversationIndex.useConversationNavigation).toBeDefined();
    expect(typeof conversationIndex.useConversationNavigation).toBe('function');
  });

  it('should export all required modules without missing exports', () => {
    const expectedExports = [
      'conversationApi', 
      'useConversationPageState',
      'useConversationData',
      'useConversationNavigation'
    ];

    expectedExports.forEach(exportName => {
      expect(conversationIndex).toHaveProperty(exportName);
      expect(conversationIndex[exportName as keyof typeof conversationIndex]).toBeDefined();
    });
  });

  it('should not export unexpected modules', () => {
    const exportKeys = Object.keys(conversationIndex);
    const expectedExports = [
      'conversationApi',
      'useConversationPageState', 
      'useConversationData',
      'useConversationNavigation'
    ];

    exportKeys.forEach(key => {
      expect(expectedExports).toContain(key);
    });
  });
}); 