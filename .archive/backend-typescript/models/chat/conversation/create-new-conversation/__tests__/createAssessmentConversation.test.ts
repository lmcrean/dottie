import logger from '/logger'
import DbService from '../../../../../../db/index.js'
import { TestRequestBody, TestOptions, MockResponse, TestUserOverrides, TestCycleOverrides, TestSymptomOverrides, TestAssessmentOverrides } from '../../../../../types/common.ts';
import { describe, beforeEach, afterEach, vi } from 'vitest';

// Import test runners
import { runSuccessfulCreationTests } from './runners/successfulCreation.ts';
import { runErrorHandlingTests } from './runners/errorHandling.ts';
import { runDatabaseSequenceTests } from './runners/databaseSequence.ts';
import { runAssessmentIntegrationTests } from './runners/assessmentIntegration.ts';

// Mock all dependencies
vi.mock('@/services/dbService.ts');
vi.mock('@/services/logger.ts');
vi.mock('../database/conversationCreate.js', () => ({
  createConversation: vi.fn()
}));
vi.mock('../../../message/user-message/add-message/create-initial-message/createInitialMessage.js', () => ({
  createInitialMessage: vi.fn()
}));

describe('createAssessmentConversation Integration Tests', () => {
  // Shared test data
  const mockData = {
    mockUserId: 'test-user-123',
    mockAssessmentId: 'test-assessment-456',
    mockConversationId: 'test-conversation-789',
    mockAssessmentPattern: 'irregular',
    
    mockAssessmentObject: {
      id: 'test-assessment-456',
      user_id: 'test-user-123',
      age: '25-34',
      pattern: 'irregular',
      cycle_length: 'irregular',
      period_duration: '4-5',
      flow_heaviness: 'medium',
      pain_level: 'moderate',
      physical_symptoms: ['bloating', 'fatigue', 'headaches'],
      emotional_symptoms: ['mood-swings', 'anxiety'],
      other_symptoms: 'cramping',
      recommendations: [
        { title: 'Exercise', description: 'Regular exercise can help' },
        { title: 'Diet', description: 'Balanced diet recommendations' }
      ],
      created_at: '2024-01-15T10:00:00.000Z',
      updated_at: '2024-01-15T10:00:00.000Z'
    },

    mockInitialMessage: {
      id: 'msg-123',
      role: 'user',
      content: 'Hi, could you look at my assessment results and provide some guidance?',
      created_at: '2024-01-15T10:05:00.000Z'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    logger.info = vi.fn();
    logger.error = vi.fn();
    
    // Mock DbService operations
    DbService.create = vi.fn();
    DbService.findById = vi.fn().mockResolvedValue(mockData.mockAssessmentObject);
    
    // Mock UUID generation
    vi.mock('uuid', () => ({
      v4: () => mockData.mockConversationId
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Run all test suites in sequence
  describe('Sequential Test Execution', () => {
    runSuccessfulCreationTests(mockData);
    runErrorHandlingTests(mockData);
    runDatabaseSequenceTests(mockData);
    runAssessmentIntegrationTests(mockData);
  });
}); 

