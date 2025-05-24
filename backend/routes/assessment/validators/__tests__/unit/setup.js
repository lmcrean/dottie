import { resolveFromRoot } from '../../../../test-utilities/paths.js';
import { vi } from 'vitest';

// Import models and controllers directly from their absolute paths
export const importModels = async () => {
  // These are examples, adjust based on your actual model structure
  try {
    const Assessment = await import(resolveFromRoot('models/Assessment.js')).then(m => m.default);
    return { Assessment };
  } catch (error) {
    console.error('Error importing models:', error);
    // Return mock models for testing if imports fail
    return {
      Assessment: {
        create: vi.fn(),
        findAll: vi.fn(),
        findOne: vi.fn(),
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