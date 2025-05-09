import { expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AssessmentResultProvider } from '@/src/context/assessment/AssessmentResultProvider';
import AgeVerificationPage from '@/src/pages/assessment/steps/age-verification/page';
import CycleLengthPage from '@/src/pages/assessment/steps/cycle-length/page';
import PeriodDurationPage from '@/src/pages/assessment/steps/period-duration/page';
import FlowPage from '@/src/pages/assessment/steps/flow/page';
import PainPage from '@/src/pages/assessment/steps/pain/page';
import SymptomsPage from '@/src/pages/assessment/steps/symptoms/page';
import ResultsPage from '@/src/pages/assessment/results/page';

describe('Assessment User Journey', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it('should complete the full assessment flow', async () => {
    // 1. Start at age verification
    render(
      <BrowserRouter>
        <AssessmentResultProvider>
          <AgeVerificationPage />
        </AssessmentResultProvider>
      </BrowserRouter>
    );

    // Select age range
    const ageOption = screen.getByRole('radio', { name: /18-24 years/i });
    fireEvent.click(ageOption);

    // Verify age is stored
    expect(sessionStorage.getItem('age')).toBe('18-24');

    // Click continue
    const ageContinueButton = screen.getByTestId('continue-button');
    fireEvent.click(ageContinueButton);

    // 2. Cycle length
    render(
      <BrowserRouter>
        <AssessmentResultProvider>
          <CycleLengthPage />
        </AssessmentResultProvider>
      </BrowserRouter>
    );

    // Select cycle length
    const cycleOption = screen.getByRole('radio', { name: /irregular/i });
    fireEvent.click(cycleOption);

    // Verify cycle length is stored
    expect(sessionStorage.getItem('cycleLength')).toBe('irregular');

    // Click continue
    const cycleContinueButton = screen.getByTestId('continue-button');
    fireEvent.click(cycleContinueButton);

    // 3. Period duration
    render(
      <BrowserRouter>
        <AssessmentResultProvider>
          <PeriodDurationPage />
        </AssessmentResultProvider>
      </BrowserRouter>
    );

    // Select period duration
    const durationOption = screen.getByRole('radio', { name: /4-5 days/i });
    fireEvent.click(durationOption);

    // Verify period duration is stored
    expect(sessionStorage.getItem('periodDuration')).toBe('4-5');

    // Click continue
    const durationContinueButton = screen.getByTestId('continue-button');
    fireEvent.click(durationContinueButton);

    // 4. Flow level
    render(
      <BrowserRouter>
        <AssessmentResultProvider>
          <FlowPage />
        </AssessmentResultProvider>
      </BrowserRouter>
    );

    // Select flow level
    const flowOption = screen.getByRole('radio', { name: /moderate/i });
    fireEvent.click(flowOption);

    // Verify flow level is stored
    expect(sessionStorage.getItem('flowLevel')).toBe('moderate');

    // Click continue
    const flowContinueButton = screen.getByTestId('continue-button');
    fireEvent.click(flowContinueButton);

    // 5. Pain level
    render(
      <BrowserRouter>
        <AssessmentResultProvider>
          <PainPage />
        </AssessmentResultProvider>
      </BrowserRouter>
    );

    // Select pain level
    const painOption = screen.getByRole('radio', { name: /moderate/i });
    fireEvent.click(painOption);

    // Verify pain level is stored
    expect(sessionStorage.getItem('painLevel')).toBe('moderate');

    // Click continue
    const painContinueButton = screen.getByTestId('continue-button');
    fireEvent.click(painContinueButton);

    // 6. Symptoms
    render(
      <BrowserRouter>
        <AssessmentResultProvider>
          <SymptomsPage />
        </AssessmentResultProvider>
      </BrowserRouter>
    );

    // Select some symptoms
    const symptoms = ['bloating', 'fatigue', 'mood-swings'];
    symptoms.forEach(symptom => {
      const symptomButton = screen.getByText(symptom);
      fireEvent.click(symptomButton);
    });

    // Add other symptoms
    const otherSymptomsInput = screen.getByPlaceholderText(/type any other symptoms here/i);
    fireEvent.change(otherSymptomsInput, { target: { value: 'insomnia' } });

    // Click continue
    const symptomsContinueButton = screen.getByTestId('continue-button');
    fireEvent.click(symptomsContinueButton);

    // Verify symptoms are stored
    const storedSymptoms = JSON.parse(sessionStorage.getItem('symptoms') || '[]');
    expect(storedSymptoms).toContain('Bloating');
    expect(storedSymptoms).toContain('Fatigue');
    expect(storedSymptoms).toContain('Mood swings');
    expect(storedSymptoms).toContain('insomnia');

    // 7. Results page
    render(
      <BrowserRouter>
        <AssessmentResultProvider>
          <ResultsPage />
        </AssessmentResultProvider>
      </BrowserRouter>
    );

    // Verify all data is displayed
    expect(screen.getByText(/18-24 years/i)).toBeInTheDocument();
    expect(screen.getByText(/irregular/i)).toBeInTheDocument();
    expect(screen.getByText(/4-5 days/i)).toBeInTheDocument();
    expect(screen.getByText(/moderate/i)).toBeInTheDocument();
    expect(screen.getByText(/Bloating/i)).toBeInTheDocument();
    expect(screen.getByText(/Fatigue/i)).toBeInTheDocument();
    expect(screen.getByText(/Mood swings/i)).toBeInTheDocument();
    expect(screen.getByText(/insomnia/i)).toBeInTheDocument();
  });
}); 