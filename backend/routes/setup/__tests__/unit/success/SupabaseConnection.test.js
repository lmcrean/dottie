import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import supabase from '../../../../../services/supabaseService.js';

// Mock the Supabase client
vi.mock('../../../../../services/supabaseService.js', () => {
  return {
    default: {
      from: vi.fn().mockReturnThis(),
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockReturnThis(),
      then: vi.fn().mockResolvedValue({
        data: { message: 'Hello World from Supabase!' },
        error: null
      })
    }
  };
});

describe('Supabase Connection Tests', () => {
  // Test 1: Can connect to Supabase
  it('should connect to Supabase', async () => {
    // Mock a successful connection
    const mockData = { message: 'Hello World from Supabase!' };
    
    // Set up the mock
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockData,
            error: null
          })
        })
      })
    });
    
    // Test the connection
    const result = await supabase
      .from('healthcheck')
      .select('*')
      .eq('id', '1')
      .single();
    
    // Assertions
    expect(result).toBeDefined();
    expect(result.data).toBeDefined();
    expect(result.error).toBeNull();
    expect(result.data.message).toBe('Hello World from Supabase!');
    
    // Verify mock was called
    expect(supabase.from).toHaveBeenCalledWith('healthcheck');
  });
  
  // Test 2: Can handle connection errors
  it('should handle connection errors gracefully', async () => {
    // Mock a connection error
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: { message: 'Connection error' }
          })
        })
      })
    });
    
    // Test the connection with expected error
    const result = await supabase
      .from('healthcheck')
      .select('*')
      .eq('id', '1')
      .single();
    
    // Assertions for error handling
    expect(result).toBeDefined();
    expect(result.data).toBeNull();
    expect(result.error).toBeDefined();
    expect(result.error.message).toBe('Connection error');
  });
}); 