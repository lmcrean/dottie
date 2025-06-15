// Global setup file for test database
import { getEnvironment } from './urls.js';

// Set test mode
process.env.TEST_MODE = 'true';

/**
 * Setup a mock database for testing
 */
export const setupMockDatabase = () => {
  // Mock database setup
  global.testDb = {
    users: [
      {
        id: 'test-user-1',
        email: 'test@example.com',
        username: 'testuser',
        password: '$2b$10$K4P7CZp7hvtDiEbulriP8OZn7Q9YhAGP8uxYwZHR0CJaW5F4LrDXe', // hashed 'password123'
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01')
      }
    ],
    tokens: {
      refreshTokens: new Map()
    },
    assessments: []
  };

  // DB utility methods
  global.testDbUtils = {
    clearData: () => {
      global.testDb.users = [];
      global.testDb.tokens.refreshTokens.clear();
      global.testDb.assessments = [];
    },
    
    findUserByEmail: (email) => {
      return global.testDb.users.find(u => u.email === email) || null;
    },
    
    findUserById: (id) => {
      return global.testDb.users.find(u => u.id === id) || null;
    },
    
    addUser: (user) => {
      global.testDb.users.push(user);
      return user;
    },
    
    storeRefreshToken: (userId, token) => {
      global.testDb.tokens.refreshTokens.set(token, {
        userId,
        createdAt: new Date()
      });
    },
    
    verifyRefreshToken: (token) => {
      return global.testDb.tokens.refreshTokens.get(token) || null;
    },
    
    addAssessment: (assessment) => {
      global.testDb.assessments.push(assessment);
      return assessment;
    },
    
    findAssessmentById: (id) => {
      return global.testDb.assessments.find(a => a.id === id) || null;
    },
    
    findAssessmentsByUserId: (userId) => {
      return global.testDb.assessments.filter(a => a.userId === userId);
    }
  };
  

};

/**
 * Main database setup function for Vitest
 */
export default async () => {

  
  // Different setup based on environment
  const env = getEnvironment();
  process.env.NODE_ENV = env === 'PROD' ? 'production' : 'development';
  
  setupMockDatabase();
  
  return () => {
    // Cleanup when tests are done

    delete global.testDb;
    delete global.testDbUtils;
  };
}; 