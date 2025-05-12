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

    // 4. Verify all data is displayed correctly
    expect(screen.getByText(ageResult.age)).toBeInTheDocument();
    expect(screen.getByText(cycleResult.cycleLength)).toBeInTheDocument();
    expect(screen.getByText(durationResult.periodDuration)).toBeInTheDocument();
    expect(screen.getByText(flowResult.flowLevel)).toBeInTheDocument();
    expect(screen.getByText(painResult.painLevel)).toBeInTheDocument();
    symptomsResult.symptoms.forEach(symptom => {
      expect(screen.getByText(symptom)).toBeInTheDocument();
    });

    // 5. Verify pattern is determined correctly
    const patternTitle = screen.getByText('Heavy or Prolonged Flow Pattern');
    expect(patternTitle).toBeInTheDocument();

    // 6. Test saving functionality
    const saveButton = screen.getByText('Save Results');
    fireEvent.click(saveButton);
    expect(screen.getByText('Saving...')).toBeInTheDocument();
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
  });

  it('should handle error cases', async () => {
    // 1. Mock API error
    const { postSend } = await import('@/src/api/assessment/requests/postSend/Request');
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
    
    // 4. Try to save
    const saveButton = screen.getByText('Save Results');
    fireEvent.click(saveButton);
    
    // 5. Verify error handling
    const toast = await import('sonner').then(module => module.toast);
    expect(toast.error).toHaveBeenCalled();
  });
});
