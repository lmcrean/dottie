import { describe, it, expect } from 'vitest';
import * as navigationIndex from '../index';

describe('conversation/hooks/navigation/index', () => {
  it('should export useConversationNavigation', () => {
    expect(navigationIndex.useConversationNavigation).toBeDefined();
    expect(typeof navigationIndex.useConversationNavigation).toBe('function');
  });

  it('should only export expected navigation hooks', () => {
    const exportKeys = Object.keys(navigationIndex);
    expect(exportKeys).toEqual(['useConversationNavigation']);
  });

  it('should not have undefined exports', () => {
    Object.values(navigationIndex).forEach(exportValue => {
      expect(exportValue).toBeDefined();
      expect(exportValue).not.toBeNull();
      expect(typeof exportValue).toBe('function');
    });
  });

  it('should export hook with correct interface', () => {
    expect(navigationIndex.useConversationNavigation).toBeDefined();
    expect(typeof navigationIndex.useConversationNavigation).toBe('function');
  });
}); 