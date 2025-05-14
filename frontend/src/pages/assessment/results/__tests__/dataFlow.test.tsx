import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AssessmentResultProvider } from '@/src/pages/assessment/context/AssessmentResultProvider';
import ResultsPage from '@/src/pages/assessment/results/page';
import { useAssessmentResult } from '@/src/pages/assessment/context/hooks/use-assessment-result';
import { useAgeVerification } from '@/src/pages/assessment/steps/age-verification/hooks/use-age-verification';
import { AgeRange } from '@/src/pages/assessment/context/types';

// Import step runners
import { runAgeVerificationStep } from './runners/ageVerification';
import { runCycleLengthStep } from './runners/cycleLength';
import { runPeriodDurationStep } from './runners/periodDuration';
import { runFlowLevelStep } from './runners/flowLevel';
import { runPainLevelStep } from './runners/painLevel';
import { runSymptomsStep } from './runners/symptoms';

// Mock the auth context
vi.mock('@/src/context/auth/useAuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' }
  })
}));

// Mock the API call for assessments
vi.mock('@/src/api/assessment/requests/postSend/Request', () => ({
  postSend: vi.fn(() => Promise.resolve({ id: 'test-assessment-id' }))
}));

// Mock the toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Mock the chat components
vi.mock('@/src/pages/chat/page', () => ({
  ChatModal: () => <div data-testid="chat-modal">Chat Modal</div>
}));

vi.mock('@/src/pages/chat/FullScreenChat', () => ({
  FullscreenChat: () => <div data-testid="fullscreen-chat">Fullscreen Chat</div>
}));

// Mock the save results component to avoid API calls during tests
vi.mock('@/src/pages/assessment/results/components/SaveResults', () => ({
  SaveResults: () => <button data-testid="save-button">Save Results</button>
}));

// Mock pattern data
vi.mock('@/src/pages/assessment/context/types/recommendations', () => ({
  PATTERN_DATA: {
    regular: {
      title: 'Regular Pattern',
      description: 'Your period appears to follow a regular pattern',
      icon: '/resultAssets/regular-pattern.svg',
    },
    irregular: {
      title: 'Irregular Cycle Pattern',
      description: 'Your period appears to follow an irregular pattern',
      icon: '/resultAssets/irregular-pattern.svg',
    },
    heavy: {
      title: 'Heavy or Prolonged Flow Pattern',
      description: 'You\'re experiencing heavy menstrual flow',
      icon: '/resultAssets/heavy-pattern.svg',
    },
    pain: {
      title: 'Pain-Dominant Pattern',
      description: 'Your period is characterized by significant pain',
      icon: '/resultAssets/pain-pattern.svg',
    },
    developing: {
      title: 'Developing Pattern',
      description: 'Your menstrual patterns are still developing',
      icon: '/resultAssets/developing-pattern.svg',
    },
  }
}));

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      <AssessmentResultProvider>{component}</AssessmentResultProvider>
    </BrowserRouter>
  );
};

describe('Assessment Data Flow', () => {
  beforeEach(() => {
    // Clear session storage before each test
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('should complete the full assessment flow', async () => {
    // 1. Run through all assessment steps
    const ageResult = await runAgeVerificationStep();
    const cycleResult = await runCycleLengthStep();
    const durationResult = await runPeriodDurationStep();
    const flowResult = await runFlowLevelStep();
    const painResult = await runPainLevelStep();
    const symptomsResult = await runSymptomsStep();

    // 2. Verify all data is stored in session storage
    expect(sessionStorage.getItem('age')).toBe(ageResult.age);
    expect(sessionStorage.getItem('cycleLength')).toBe(cycleResult.cycleLength);
    expect(sessionStorage.getItem('periodDuration')).toBe(durationResult.periodDuration);
    expect(sessionStorage.getItem('flowHeaviness')).toBe(flowResult.flowLevel);
    expect(sessionStorage.getItem('painLevel')).toBe(painResult.painLevel);
    expect(JSON.parse(sessionStorage.getItem('symptoms') || '[]')).toEqual(symptomsResult.symptoms);

    // 3. Render results page
    renderWithRouter(<ResultsPage />);

    // 4. Verify all data is displayed correctly using test IDs
    const ageElement = screen.getByTestId('age-value');
    expect(ageElement).toBeInTheDocument();
    expect(ageElement).toHaveTextContent(ageResult.age);
    
    const cycleLengthElement = screen.getByTestId('cycle-length-value');
    expect(cycleLengthElement).toBeInTheDocument();
    expect(cycleLengthElement).toHaveTextContent(cycleResult.cycleLength);
    
    const periodDurationElement = screen.getByTestId('period-duration-value');
    expect(periodDurationElement).toBeInTheDocument();
    expect(periodDurationElement).toHaveTextContent(durationResult.periodDuration);
    
    const flowLevelElement = screen.getByTestId('flow-level-value');
    expect(flowLevelElement).toBeInTheDocument();
    expect(flowLevelElement).toHaveTextContent(flowResult.flowLevel);
    
    const painLevelElement = screen.getByTestId('pain-level-value');
    expect(painLevelElement).toBeInTheDocument();
    expect(painLevelElement).toHaveTextContent(painResult.painLevel);
    
    const symptomsElement = screen.getByTestId('symptoms-content');
    expect(symptomsElement).toBeInTheDocument();
    symptomsResult.symptoms.forEach(symptom => {
      expect(symptomsElement).toHaveTextContent(symptom);
    });
    
    // 5. Verify pattern is determined correctly based on the flowLevel (heavy)
    expect(screen.getByText('Heavy or Prolonged Flow Pattern')).toBeInTheDocument();
    
    // 6. Test saving functionality
    const saveButton = screen.getByTestId('save-button');
    expect(saveButton).toBeInTheDocument();
  });

  it('should handle quick response mode', async () => {
    // 1. Set up quick response mode
    const location = { search: '?mode=quickresponse' };
    vi.spyOn(window, 'location', 'get').mockReturnValue(location as any);
    
    // 2. Run through all steps in quick response mode
    await runAgeVerificationStep();
    await runCycleLengthStep();
    await runPeriodDurationStep();
    await runFlowLevelStep();
    await runPainLevelStep();
    await runSymptomsStep();
    
    // 3. Verify all data was collected
    expect(sessionStorage.getItem('age')).toBeTruthy();
    expect(sessionStorage.getItem('cycleLength')).toBeTruthy();
    expect(sessionStorage.getItem('periodDuration')).toBeTruthy();
    expect(sessionStorage.getItem('flowHeaviness')).toBeTruthy();
    expect(sessionStorage.getItem('painLevel')).toBeTruthy();
    expect(sessionStorage.getItem('symptoms')).toBeTruthy();
    
    // 4. Render results page and verify it loads correctly
    renderWithRouter(<ResultsPage />);
    expect(screen.getByTestId('age-value')).toBeInTheDocument();
  });

  it('should handle error cases', async () => {
    // 1. Mock API error
    const { postSend } = await import('@/src/pages/assessment/api/requests/postSend/Request');
    if (typeof postSend === 'function' && typeof vi.mocked === 'function') {
      vi.mocked(postSend).mockRejectedValueOnce(new Error('API Error'));
    }
    
    // 2. Run through all steps
    await runAgeVerificationStep();
    await runCycleLengthStep();
    await runPeriodDurationStep();
    await runFlowLevelStep();
    await runPainLevelStep();
    await runSymptomsStep();
    
    // 3. Render results page
    renderWithRouter(<ResultsPage />);
    
    // 4. Verify the page loaded correctly
    expect(screen.getByTestId('age-value')).toBeInTheDocument();
  });
});

describe('Assessment Results Display', () => {
  beforeEach(() => {
    // Clear session storage before each test
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  it('should display assessment results correctly', () => {
    // 1. Setup session storage with assessment data
    const testData = {
      age: '13-17',
      cycleLength: '21-25',
      periodDuration: '4-5',
      flowLevel: 'heavy',
      painLevel: 'moderate',
      symptoms: ['headaches', 'bloating', 'mood-swings']
    };
    
    // Store test data in session storage
    sessionStorage.setItem('age', testData.age);
    sessionStorage.setItem('cycleLength', testData.cycleLength);
    sessionStorage.setItem('periodDuration', testData.periodDuration);
    sessionStorage.setItem('flowHeaviness', testData.flowLevel);
    sessionStorage.setItem('painLevel', testData.painLevel);
    sessionStorage.setItem('symptoms', JSON.stringify(testData.symptoms));
    
    // 2. Render results page
    renderWithRouter(<ResultsPage />);
    
    // 3. Verify all data is displayed correctly using test IDs
    const ageElement = screen.getByTestId('age-value');
    expect(ageElement).toBeInTheDocument();
    expect(ageElement.textContent).toMatch(/13-17/);
    
    const cycleLengthElement = screen.getByTestId('cycle-length-value');
    expect(cycleLengthElement).toBeInTheDocument();
    expect(cycleLengthElement.textContent).toBe(testData.cycleLength);
    
    const periodDurationElement = screen.getByTestId('period-duration-value');
    expect(periodDurationElement).toBeInTheDocument();
    expect(periodDurationElement.textContent).toBe(testData.periodDuration);
    
    const flowLevelElement = screen.getByTestId('flow-level-value');
    expect(flowLevelElement).toBeInTheDocument();
    expect(flowLevelElement.textContent).toBe(testData.flowLevel);
    
    const painLevelElement = screen.getByTestId('pain-level-value');
    expect(painLevelElement).toBeInTheDocument();
    expect(painLevelElement.textContent).toBe(testData.painLevel);
    
    const symptomsElement = screen.getByTestId('symptoms-content');
    expect(symptomsElement).toBeInTheDocument();
    testData.symptoms.forEach(symptom => {
      expect(symptomsElement.textContent).toContain(symptom);
    });
    
    // 4. Verify pattern is determined correctly based on the flowLevel (heavy)
    expect(screen.getByText('Heavy or Prolonged Flow Pattern')).toBeInTheDocument();
  });

  it('should handle empty data', () => {
    // Don't set any session storage data
    
    // Render results page
    renderWithRouter(<ResultsPage />);
    
    // Verify the page still loads
    expect(screen.getByTestId('age-value')).toBeInTheDocument();
    expect(screen.getByTestId('age-value').textContent).toBe('Not specified');
    
    // Check for pattern default (in this case it should be 'regular')
    expect(screen.getByText('Regular Pattern')).toBeInTheDocument();
  });
});
