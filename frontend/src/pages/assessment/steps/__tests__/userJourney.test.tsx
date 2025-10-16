import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AssessmentResultProvider } from '@/src/pages/assessment/steps/context/AssessmentResultProvider';
import AgeVerificationPage from '../1-age-verification/page';
import CycleLengthPage from '../2-cycle-length/page';
import PeriodDurationPage from '../3-period-duration/page';
import FlowPage from '../4-flow/page';
import PainPage from '../5-pain/page';
import SymptomsPage from '../6-symptoms/page';

describe('Assessment User Journey', () => {
  beforeEach(() => {
    cleanup();
  });

  it('should render all assessment steps without crashing', () => {
    // Simplified test - just verify each page renders without crashing
    // Full interaction testing would require extensive setup with custom form components

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
    expect(screen.getByText(/question 1 of 6/i)).toBeInTheDocument();
    expect(screen.getByText(/what is your age range/i)).toBeInTheDocument();
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
    expect(screen.getByText(/question 2 of 6/i)).toBeInTheDocument();
    expect(screen.getByText(/How long is your menstrual cycle/i)).toBeInTheDocument();
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
    expect(screen.getByText(/question 3 of 6/i)).toBeInTheDocument();
    expect(screen.getByText(/How many days does your period typically last/i)).toBeInTheDocument();
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
    expect(screen.getByText(/question 4 of 6/i)).toBeInTheDocument();
    expect(screen.getByText(/How would you describe your menstrual flow/i)).toBeInTheDocument();
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
    expect(screen.getByText(/question 5 of 6/i)).toBeInTheDocument();
    expect(screen.getByText(/How would you rate your menstrual pain/i)).toBeInTheDocument();
    unmountPain();

    // Step 6: Symptoms
    const { unmount: unmountSymptoms } = render(
      <MemoryRouter initialEntries={['/assessment/symptoms']}>
        <AssessmentResultProvider>
          <Routes>
            <Route path="/assessment/symptoms" element={<SymptomsPage />} />
          </Routes>
        </AssessmentResultProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/question 6 of 6/i)).toBeInTheDocument();
    expect(screen.getByText(/Do you experience any other symptoms with your period/i)).toBeInTheDocument();
    unmountSymptoms();
  });
});
