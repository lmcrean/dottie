import { describe, it, expect } from 'vitest';
import { initialState } from '../types';

describe('Assessment Types', () => {
  it('should have correct initial state', () => {
    expect(initialState).toEqual({
      result: null,
      isComplete: false
    });
  });
}); 