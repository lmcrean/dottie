import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AssessmentResultProvider } from '@/src/context/assessment/AssessmentResultProvider';
import AgeVerificationPage from '@/src/pages/assessment/steps/age-verification/page';
import CycleLengthPage from '@/src/pages/assessment/steps/cycle-length/page';
import PeriodDurationPage from '@/src/pages/assessment/steps/period-duration/page';
import FlowLevelPage from '@/src/pages/assessment/steps/flow/page';
import PainLevelPage from '@/src/pages/assessment/steps/pain/page';
import SymptomsPage from '@/src/pages/assessment/steps/symptoms/page';

describe('Assessment User Journey', () => {
  beforeEach(() => {
    // Clear session storage before each test
    sessionStorage.clear();
  });

  it('should complete the full assessment journey', async () => {
    // 1. Age Verification
    render(
      <BrowserRouter>
        <AssessmentResultProvider>
          <AgeVerificationPage />
        </AssessmentResultProvider>
      </BrowserRouter>
    );
    const ageOption = screen.getByRole('radio', { name: /13-17 years/i });
    fireEvent.click(ageOption);
    const continueButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(continueButton);
    expect(sessionStorage.getItem('age')).toBe('13-17');

    // 2. Cycle Length
    render(
      <BrowserRouter>
        <AssessmentResultProvider>
          <CycleLengthPage />
        </AssessmentResultProvider>
      </BrowserRouter>
    );
    const cycleOption = screen.getByRole('radio', { name: /irregular/i });
    fireEvent.click(cycleOption);
    const cycleContinueButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(cycleContinueButton);
    expect(sessionStorage.getItem('cycleLength')).toBe('irregular');

    // 3. Period Duration
    render(
      <BrowserRouter>
        <AssessmentResultProvider>
          <PeriodDurationPage />
        </AssessmentResultProvider>
      </BrowserRouter>
    );
    const durationOption = screen.getByRole('radio', { name: /5-7 days/i });
    fireEvent.click(durationOption);
    const durationContinueButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(durationContinueButton);
    expect(sessionStorage.getItem('periodDuration')).toBe('5-7');

    // 4. Flow Level
    render(
      <BrowserRouter>
        <AssessmentResultProvider>
          <FlowLevelPage />
        </AssessmentResultProvider>
      </BrowserRouter>
    );
    const flowOption = screen.getByRole('radio', { name: /heavy/i });
    fireEvent.click(flowOption);
    const flowContinueButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(flowContinueButton);
    expect(sessionStorage.getItem('flowHeaviness')).toBe('heavy');

    // 5. Pain Level
    render(
      <BrowserRouter>
        <AssessmentResultProvider>
          <PainLevelPage />
        </AssessmentResultProvider>
      </BrowserRouter>
    );
    const painOption = screen.getByRole('radio', { name: /moderate/i });
    fireEvent.click(painOption);
    const painContinueButton = screen.getByRole('button', { name: /continue/i });
    fireEvent.click(painContinueButton);
    expect(sessionStorage.getItem('painLevel')).toBe('moderate');

    // 6. Symptoms
    render(
      <BrowserRouter>
        <AssessmentResultProvider>
          <SymptomsPage />
        </AssessmentResultProvider>
      </BrowserRouter>
    );
    const symptoms = ['cramps', 'headache', 'fatigue'];
    symptoms.forEach(symptom => {
      const symptomOption = screen.getByRole('checkbox', { name: new RegExp(symptom, 'i') });
      fireEvent.click(symptomOption);
    });
    const symptomsContinueButton = screen.getByRole('button', { name: /finish assessment/i });
    fireEvent.click(symptomsContinueButton);
    expect(JSON.parse(sessionStorage.getItem('symptoms') || '[]')).toEqual(symptoms);

    // Verify all data is stored in session storage
    expect(sessionStorage.getItem('age')).toBe('13-17');
    expect(sessionStorage.getItem('cycleLength')).toBe('irregular');
    expect(sessionStorage.getItem('periodDuration')).toBe('5-7');
    expect(sessionStorage.getItem('flowHeaviness')).toBe('heavy');
    expect(sessionStorage.getItem('painLevel')).toBe('moderate');
    expect(JSON.parse(sessionStorage.getItem('symptoms') || '[]')).toEqual(symptoms);
  });
}); 