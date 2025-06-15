import { resolveFromRoot } from '../../../../test-utilities/paths.js';
import { vi } from 'vitest';

// Import models and controllers directly from their absolute paths
export const importModels = async () => {
  try {
    const User = await import(resolveFromRoot('models/user/User.js')).then(m => m.default);
    return { User };
  } catch (error) {
    console.error('Error importing models:', error);
    // Return mock models for testing if imports fail
    return {
      User: {
        create: vi.fn(),
        findByEmail: vi.fn(),
        findById: vi.fn(),
        update: vi.fn(),
      }
    };
  }
};

// Setup mocks for dependencies
export const setupMocks = () => {
  return {
    db: {
      // Add mock db functions as needed
      query: vi.fn(),
      select: vi.fn().mockReturnThis(),
      where: vi.fn().mockReturnThis(),
      from: vi.fn().mockReturnThis(),
      insert: vi.fn(),
      returning: vi.fn(),
    },
    // Add other mocks as needed
  };
}; 