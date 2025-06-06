import { describe, it, expect } from 'vitest';

describe('messages hooks exports', () => {
  it('should export state management hooks', async () => {
    const module = await import('../state');
    
    expect(module).toHaveProperty('useMessageState');
    expect(module).toHaveProperty('useInputState');
    expect(typeof module.useMessageState).toBe('function');
    expect(typeof module.useInputState).toBe('function');
  });

  it('should export sending hooks', async () => {
    const module = await import('../sending');
    
    expect(module).toHaveProperty('useMessageSender');
    expect(typeof module.useMessageSender).toBe('function');
  });

  it('should export all hooks from main index', async () => {
    const module = await import('../index');
    
    // State management hooks
    expect(module).toHaveProperty('useMessageState');
    expect(module).toHaveProperty('useInputState');
    
    // Sending hooks
    expect(module).toHaveProperty('useMessageSender');
    
    // Verify all are functions
    expect(typeof module.useMessageState).toBe('function');
    expect(typeof module.useInputState).toBe('function');
    expect(typeof module.useMessageSender).toBe('function');
  });

  it('should have consistent exports across all index files', async () => {
    const mainModule = await import('../index');
    const stateModule = await import('../state');
    const sendingModule = await import('../sending');

    // State hooks should match
    expect(mainModule.useMessageState).toBe(stateModule.useMessageState);
    expect(mainModule.useInputState).toBe(stateModule.useInputState);

    // Sending hooks should match
    expect(mainModule.useMessageSender).toBe(sendingModule.useMessageSender);
  });
}); 