import { describe, beforeEach, afterEach, vi } from 'vitest';
import DbService from '@/services/dbService.js';
import Assessment from '../Assessment.js';

// Import test runners
import { runAssessmentCreationTests } from './runners/assessmentCreation.js';
import { runAssessmentRetrievalTests } from './runners/assessmentRetrieval.js';
import { runAssessmentListTests } from './runners/assessmentList.js';
import { runAssessmentDeletionTests } from './runners/assessmentDeletion.js';

// Mock all dependencies
vi.mock('@/services/dbService.js');

describe('Assessment Integration Tests - Full Workflow', () => {
  // Shared test data
  const mockData = {
    mockUserId: 'test-user-123',
    mockAssessmentId1: 'test-assessment-456',
    mockAssessmentId2: 'test-assessment-789',
    mockAssessmentId3: 'test-assessment-101',
    
    mockAssessmentData1: {
      id: 'test-assessment-456',
      user_id: 'test-user-123',
      created_at: '2024-01-15T10:00:00.000Z',
      age: '25-34',
      pattern: 'irregular',
      cycle_length: '28-30',
      period_duration: '4-5',
      flow_heaviness: 'medium',
      pain_level: 'moderate',
      physical_symptoms: ['bloating', 'fatigue', 'headaches'],
      emotional_symptoms: ['mood-swings', 'anxiety'],
      other_symptoms: 'cramping',
      recommendations: [
        { title: 'Exercise', description: 'Regular exercise can help' },
        { title: 'Diet', description: 'Balanced diet recommendations' }
      ]
    },

    mockAssessmentData2: {
      id: 'test-assessment-789',
      user_id: 'test-user-123',
      created_at: '2024-01-16T10:00:00.000Z',
      age: '25-34',
      pattern: 'regular',
      cycle_length: '28',
      period_duration: '5-6',
      flow_heaviness: 'heavy',
      pain_level: 'severe',
      physical_symptoms: ['cramps', 'bloating'],
      emotional_symptoms: ['irritability'],
      other_symptoms: 'nausea',
      recommendations: [
        { title: 'Pain Management', description: 'Consider pain relief options' }
      ]
    },

    mockAssessmentData3: {
      id: 'test-assessment-101',
      user_id: 'test-user-123',
      created_at: '2024-01-17T10:00:00.000Z',
      age: '25-34',
      pattern: 'short',
      cycle_length: '21',
      period_duration: '3-4',
      flow_heaviness: 'light',
      pain_level: 'mild',
      physical_symptoms: ['fatigue'],
      emotional_symptoms: ['mood-swings'],
      other_symptoms: 'none',
      recommendations: [
        { title: 'Monitoring', description: 'Continue tracking symptoms' }
      ]
    },

    newAssessmentInput: {
      age: '35-44',
      pattern: 'long',
      cycle_length: '35',
      period_duration: '6-7',
      flow_heaviness: 'heavy',
      pain_level: 'severe',
      physical_symptoms: ['severe-cramps', 'heavy-bleeding', 'fatigue'],
      emotional_symptoms: ['severe-mood-swings', 'depression'],
      other_symptoms: 'severe nausea and vomiting',
      recommendations: [
        { title: 'Medical Consultation', description: 'Consult with healthcare provider immediately' },
        { title: 'Pain Relief', description: 'Consider stronger pain management options' }
      ]
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mocks
    DbService.create = vi.fn();
    DbService.findById = vi.fn();
    DbService.findBy = vi.fn();
    DbService.delete = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Run all test suites in sequence - this tests the complete assessment workflow
  describe('Complete Assessment Workflow Tests', () => {
    runAssessmentCreationTests(mockData);
    runAssessmentRetrievalTests(mockData);
    runAssessmentListTests(mockData);
    runAssessmentDeletionTests(mockData);
  });
}); 