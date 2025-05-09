import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AssessmentResultProvider } from '@/src/context/assessment/AssessmentResultProvider';
import AgeVerificationPage from '../age-verification/page';
import CycleLengthPage from '../cycle-length/page';
import PeriodDurationPage from '../period-duration/page';
import FlowPage from '../flow/page';
import PainPage from '../pain/page';
import SymptomsPage from '../symptoms/page';

describe('Assessment User Journey', () => {
  beforeEach(() => {
    // Clear session storage and cleanup between tests
    window.sessionStorage.clear();
    cleanup();
  });

  const safeJSONParse = (value: string | null, defaultValue: any) => {
    if (!value) return defaultValue;
    try {
      return JSON.parse(value);
    } catch {
      return defaultValue;
    }
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  it('should complete the full assessment flow', async () => {
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

    // Verify age is stored
    expect(safeJSONParse(window.sessionStorage.getItem('ageRange'), null)).toBe('18-24');
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

    // Select cycle length
    await act(async () => {
      const cycleOption = screen.getByRole('radio', { name: /28 days/i });
      fireEvent.click(cycleOption);
      await wait(100);
    });

    // Click continue
    await act(async () => {
      const cycleContinueButton = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(cycleContinueButton);
      await wait(100);
    });

    // Verify cycle length is stored
    expect(safeJSONParse(window.sessionStorage.getItem('cycleLength'), null)).toBe('28');
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

    // Select period duration
    await act(async () => {
      const durationOption = screen.getByRole('radio', { name: /5 days/i });
      fireEvent.click(durationOption);
      await wait(100);
    });

    // Click continue
    await act(async () => {
      const durationContinueButton = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(durationContinueButton);
      await wait(100);
    });

    // Verify period duration is stored
    expect(safeJSONParse(window.sessionStorage.getItem('periodDuration'), null)).toBe('5');
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

    // Select flow level
    await act(async () => {
      const flowOption = screen.getByRole('radio', { name: /moderate/i });
      fireEvent.click(flowOption);
      await wait(100);
    });

    // Click continue
    await act(async () => {
      const flowContinueButton = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(flowContinueButton);
      await wait(100);
    });

    // Verify flow level is stored
    expect(safeJSONParse(window.sessionStorage.getItem('flowLevel'), null)).toBe('moderate');
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

    // Select pain level
    await act(async () => {
      const painOption = screen.getByRole('radio', { name: /mild/i });
      fireEvent.click(painOption);
      await wait(100);
    });

    // Click continue
    await act(async () => {
      const painContinueButton = screen.getByRole('button', { name: /continue/i });
      fireEvent.click(painContinueButton);
      await wait(100);
    });

    // Verify pain level is stored
    expect(safeJSONParse(window.sessionStorage.getItem('painLevel'), null)).toBe('mild');
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

    // Select symptoms
    await act(async () => {
      const symptomOption = screen.getByRole('checkbox', { name: /cramps/i });
      fireEvent.click(symptomOption);
      await wait(100);
    });

    // Enter additional symptoms
    await act(async () => {
      const additionalInput = screen.getByPlaceholderText(/type any other symptoms here/i);
      fireEvent.change(additionalInput, { target: { value: 'Headache' } });
      await wait(100);
    });

    // Click continue
    await act(async () => {
      const symptomsContinueButton = screen.getByRole('button', { name: /finish assessment/i });
      fireEvent.click(symptomsContinueButton);
      await wait(100);
    });

    // Verify symptoms are stored
    const storedSymptoms = safeJSONParse(window.sessionStorage.getItem('symptoms'), []);
    expect(storedSymptoms).toContain('Cramps');
    expect(storedSymptoms).toContain('Headache');
    unmountSymptoms();
  });
}); 