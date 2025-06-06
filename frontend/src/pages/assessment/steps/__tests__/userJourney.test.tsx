import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AssessmentResultProvider } from '@/src/pages/assessment/steps/context/AssessmentResultProvider';
import { AuthProvider } from '@/src/pages/auth/context/AuthContextProvider';
import AgeVerificationPage from '../1-age-verification/page';
import CycleLengthPage from '../2-cycle-length/page';
import PeriodDurationPage from '../3-period-duration/page';
import FlowPage from '../flow/page';
import PainPage from '../pain/page';
import SymptomsPage from '../6-symptoms/page';
import ResultsPage from '../../detail/page';

describe('Assessment User Journey', () => {
  beforeEach(() => {
    cleanup();
  });

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  it('should render and interact with all assessment steps', async () => {
    // Step 1: Age Verification
    const { unmount: unmountAge } = render(
      <MemoryRouter initialEntries={['/assessment/age-verification']}>
        <AssessmentResultProvider>
          <Routes>
            <Route path="/assessment/age-verification" element={<AgeVerificationPage />} />
          </Routes>
        </AssessmentResultProvider>
      </MemoryRouter>
    );

    // Verify age verification page renders
    expect(screen.getByRole('heading', { name: /question 1 of 6/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /what is your age range\?/i })).toBeInTheDocument();
    
    // Select age range
    await act(async () => {
      const ageOption = screen.getByRole('radio', { name: /18-24 years/i });
      fireEvent.click(ageOption);
      await wait(100);
    });

    // Click continue
    await act(async () => {
      const ageContinueButton = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(ageContinueButton);
      await wait(100);
    });
    unmountAge();

    // Step 2: Cycle Length
    const { unmount: unmountCycle } = render(
      <MemoryRouter initialEntries={['/assessment/cycle-length']}>
        <AssessmentResultProvider>
          <Routes>
            <Route path="/assessment/cycle-length" element={<CycleLengthPage />} />
          </Routes>
        </AssessmentResultProvider>
      </MemoryRouter>
    );

    // Verify cycle length page renders
    expect(screen.getByRole('heading', { name: /question 2 of 6/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /How long is your menstrual cycle\?/i })).toBeInTheDocument();

    // Select cycle length
    await act(async () => {
      const cycleOption = screen.getByRole('radio', { name: /26-30 days/i });
      fireEvent.click(cycleOption);
      await wait(100);
    });

    // Click continue
    await act(async () => {
      const cycleContinueButton = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(cycleContinueButton);
      await wait(100);
    });
    unmountCycle();

    // Step 3: Period Duration
    const { unmount: unmountDuration } = render(
      <MemoryRouter initialEntries={['/assessment/period-duration']}>
        <AssessmentResultProvider>
          <Routes>
            <Route path="/assessment/period-duration" element={<PeriodDurationPage />} />
          </Routes>
        </AssessmentResultProvider>
      </MemoryRouter>
    );

    // Verify period duration page renders
    expect(screen.getByRole('heading', { name: /question 3 of 6/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /How many days does your period typically last\?/i })).toBeInTheDocument();

    // Select period duration
    await act(async () => {
      const durationOption = screen.getByRole('radio', { name: /4-5 days/i });
      fireEvent.click(durationOption);
      await wait(100);
    });

    // Click continue
    await act(async () => {
      const durationContinueButton = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(durationContinueButton);
      await wait(100);
    });
    unmountDuration();

    // Step 4: Flow Level
    const { unmount: unmountFlow } = render(
      <MemoryRouter initialEntries={['/assessment/flow']}>
        <AssessmentResultProvider>
          <Routes>
            <Route path="/assessment/flow" element={<FlowPage />} />
          </Routes>
        </AssessmentResultProvider>
      </MemoryRouter>
    );

    // Verify flow level page renders
    expect(screen.getByRole('heading', { name: /question 4 of 6/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /How would you describe your menstrual flow\?/i })).toBeInTheDocument();

    // Select flow level
    await act(async () => {
      const flowOption = screen.getByRole('radio', { name: /Moderate Regular bleeding, requires normal protection/i });
      fireEvent.click(flowOption);
      await wait(100);
    });

    // Click continue
    await act(async () => {
      const flowContinueButton = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(flowContinueButton);
      await wait(100);
    });
    unmountFlow();

    // Step 5: Pain Level
    const { unmount: unmountPain } = render(
      <MemoryRouter initialEntries={['/assessment/pain']}>
        <AssessmentResultProvider>
          <Routes>
            <Route path="/assessment/pain" element={<PainPage />} />
          </Routes>
        </AssessmentResultProvider>
      </MemoryRouter>
    );

    // Verify pain level page renders
    expect(screen.getByRole('heading', { name: /question 5 of 6/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /How would you rate your menstrual pain\?/i })).toBeInTheDocument();

    // Select pain level
    await act(async () => {
      const painOption = screen.getByRole('radio', { name: /Mild Noticeable but doesn't interfere with daily activities/i });
      fireEvent.click(painOption);
      await wait(100);
    });

    // Click continue
    await act(async () => {
      const painContinueButton = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(painContinueButton);
      await wait(100);
    });
    unmountPain();

    // Step 6: Symptoms
    const { unmount: unmountSymptoms } = render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/assessment/symptoms']}>
          <AssessmentResultProvider>
            <Routes>
              <Route path="/assessment/symptoms" element={<SymptomsPage />} />
              <Route path="/assessment/results" element={<ResultsPage />} />
            </Routes>
          </AssessmentResultProvider>
        </MemoryRouter>
      </AuthProvider>
    );

    // Verify symptoms page renders
    expect(screen.getByRole('heading', { name: /question 6 of 6/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Do you experience any other symptoms with your period\?/i })).toBeInTheDocument();

    // Select symptoms
    await act(async () => {
      const symptomOption = screen.getByRole('button', { name: /🫃 Bloating/i });
      fireEvent.click(symptomOption);
      await wait(100);
    });

    // Enter additional symptoms
    await act(async () => {
      const additionalInput = screen.getByPlaceholderText(/Type any other symptoms here\.\.\./i);
      fireEvent.change(additionalInput, { target: { value: 'Headache' } });
      await wait(100);
    });

    // Click continue
    await act(async () => {
      const symptomsContinueButton = screen.getByRole('button', { name: /finish assessment/i });
      fireEvent.click(symptomsContinueButton);
      await wait(100);
    });
    
    // Verify that we've navigated to the results page
    expect(screen.getByText(/assessment results/i, { exact: false })).toBeInTheDocument();
    
    unmountSymptoms();
  });
}); 