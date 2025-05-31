import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ResultsPage from '../../../page';
import { AssessmentResultProvider } from '@/src/pages/assessment/steps/context/AssessmentResultProvider';

// Mock sessionStorage
const mockSessionStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  key: vi.fn(),
  length: 0
};

// Mock useAssessmentResult hook
vi.mock('@/src/pages/assessment/context/hooks/use-assessment-result', () => {
  const mockResultData = {
    result: {
      age: '18-24',
      cycle_length: '26-30',
      period_duration: '4-5',
      flow_heaviness: 'moderate',
      pain_level: 'mild',
      physical_symptoms: ['headaches', 'bloating'],
      emotional_symptoms: ['anxiety'],
      pattern: 'regular',
      recommendations: []
    },
    isComplete: true,
    transformToFlattenedFormat: () => mockResultData.result
  };

  return {
    useAssessmentResult: vi.fn().mockReturnValue(mockResultData)
  };
});

// Mock useQuickNavigate hook
vi.mock('@/src/hooks/useQuickNavigate', () => ({
  useQuickNavigate: vi.fn().mockReturnValue({ isQuickResponse: false })
}));

// Mock ChatModal component used in the results page
vi.mock('@/src/pages/chat/page', () => ({
  ChatModal: () => <div data-testid="chat-modal">MockedChatModal</div>
}));

// Mock FullscreenChat component
vi.mock('@/src/pages/chat/FullScreenChat', () => ({
  FullscreenChat: () => <div data-testid="fullscreen-chat">MockedFullscreenChat</div>
}));

describe('Results Page Integration Test', () => {
  // Replace sessionStorage with our mock before tests
  const originalSessionStorage = window.sessionStorage;
  
  beforeEach(() => {
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true
    });
    
    vi.resetAllMocks();
    
    // Set up session storage mock to return values mimicking real usage
    mockSessionStorage.getItem.mockImplementation((key: string) => {
      const mockData: Record<string, string> = {
        'age': JSON.stringify('18-24'),
        'cycleLength': JSON.stringify('26-30'),
        'periodDuration': JSON.stringify('4-5'),
        'flowHeaviness': JSON.stringify('moderate'),
        'painLevel': JSON.stringify('mild'),
        'symptoms': JSON.stringify(['headaches', 'bloating', 'anxiety'])
      };
      return mockData[key] || null;
    });
  });
  
  afterEach(() => {
    // Restore original sessionStorage after tests
    Object.defineProperty(window, 'sessionStorage', {
      value: originalSessionStorage
    });
  });

  it('should properly display the age from assessment context', async () => {
    render(
      <BrowserRouter>
        <AssessmentResultProvider>
          <ResultsPage />
        </AssessmentResultProvider>
      </BrowserRouter>
    );

    // Verify the AgeRange component displays the correct formatted age
    const ageElement = screen.getByTestId('age-value');
    expect(ageElement).toBeInTheDocument();
    expect(ageElement.textContent).toBe('18-24 years');

    // Log debug information


  });

  it('should handle missing age data gracefully', async () => {
    // Update mock to return null for age
    mockSessionStorage.getItem.mockImplementation((key: string) => {
      if (key === 'age') return null;
      
      const mockData: Record<string, string> = {
        'cycleLength': JSON.stringify('26-30'),
        'periodDuration': JSON.stringify('4-5'),
        'flowHeaviness': JSON.stringify('moderate'),
        'painLevel': JSON.stringify('mild'),
        'symptoms': JSON.stringify(['headaches', 'bloating', 'anxiety'])
      };
      return mockData[key] || null;
    });
    
    // Mock the assessment result hook to return undefined age
    vi.mock('@/src/pages/assessment/context/hooks/use-assessment-result', () => {
      return {
        useAssessmentResult: vi.fn().mockReturnValue({
          result: {
            age: undefined,
            cycle_length: '26-30',
            period_duration: '4-5',
            flow_heaviness: 'moderate',
            pain_level: 'mild',
            physical_symptoms: ['headaches', 'bloating'],
            emotional_symptoms: ['anxiety'],
            pattern: 'regular',
            recommendations: []
          },
          isComplete: true,
          transformToFlattenedFormat: () => ({})
        })
      };
    });

    render(
      <BrowserRouter>
        <AssessmentResultProvider>
          <ResultsPage />
        </AssessmentResultProvider>
      </BrowserRouter>
    );

    // Verify the AgeRange component displays "Not specified"
    const ageElement = screen.getByTestId('age-value');
    expect(ageElement).toBeInTheDocument();
    expect(ageElement.textContent).toBe('Not specified');
  });
}); 