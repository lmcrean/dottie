import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { useEffect } from 'react';
import { useAssessmentContext } from '@/src/pages/assessment/steps/context/hooks/use-assessment-context';

// Import all assessment pages
import AgeVerificationPage from '../steps/1-age-verification/page';
import CycleLengthPage from '../steps/2-cycle-length/page';
import PeriodDurationPage from '../steps/3-period-duration/page';
import FlowPage from '../steps/4-flow/page';
import PainPage from '../steps/5-pain/page';
import SymptomsPage from '../steps/6-symptoms/page';
import ResultsPage from '../detail/page';
import { AuthProvider } from '@/src/pages/auth/context/AuthContextProvider';
import { AssessmentResultProvider } from '@/src/pages/assessment/steps/context/AssessmentResultProvider';

// Mock router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

// Helper to render with router at a specific starting route
export const renderWithRouter = (ui: React.ReactElement, { route = '/' } = {}) => {
  return render(
    <AuthProvider>
      <AssessmentResultProvider>
        <MemoryRouter initialEntries={[route]}>
          <Routes>
            <Route path="/assessment/age-verification" element={<AgeVerificationPage />} />
            <Route path="/assessment/cycle-length" element={<CycleLengthPage />} />
            <Route path="/assessment/period-duration" element={<PeriodDurationPage />} />
            <Route path="/assessment/flow" element={<FlowPage />} />
            <Route path="/assessment/pain" element={<PainPage />} />
            <Route path="/assessment/symptoms" element={<SymptomsPage />} />
            <Route path="/assessment/results" element={<ResultsPage />} />
          </Routes>
        </MemoryRouter>
      </AssessmentResultProvider>
    </AuthProvider>
  );
};

// Helper to find the enabled continue button
export const findEnabledContinueButton = () => {
  const buttons = screen.getAllByRole('button', { name: /continue/i });
  // Find the button that is not disabled
  return buttons.find((button) => !button.hasAttribute('disabled'));
};

// Helper to setup session storage for testing
export const setupSessionStorage = (data: Record<string, any>) => {
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'object') {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } else {
      window.sessionStorage.setItem(key, String(value));
    }
  });
};

// Helper to clear session storage
export const clearSessionStorage = () => {
  window.sessionStorage.clear();
};

// Helper for common navigation steps
export const navigateToAgeVerification = async (
  user: ReturnType<typeof userEvent.setup>,
  age: string
) => {
  renderWithRouter(<AgeVerificationPage />, { route: '/assessment/age-verification' });

  let ageOption;
  if (age === '13-17 years') {
    ageOption = screen.getByTestId('option-13-17');
  } else if (age === '18-24 years') {
    ageOption = screen.getByTestId('option-18-24');
  } else if (age === 'Under 13 years') {
    ageOption = screen.getByTestId('option-under-13');
  } else if (age === '25+ years') {
    ageOption = screen.getByTestId('option-25-plus');
  } else {
    // Fallback to looking for text content if no matching data-testid
    const ageOptions = screen.getAllByRole('button');
    for (const option of ageOptions) {
      if (option.textContent?.includes(age)) {
        ageOption = option;
        break;
      }
    }
  }

  if (!ageOption) {
    throw new Error(`Age option '${age}' not found`);
  }

  await user.click(ageOption);
  const continueButton = findEnabledContinueButton();
  await user.click(continueButton!);

  return age;
};

export const navigateToCycleLength = async (
  user: ReturnType<typeof userEvent.setup>,
  cycleLength: string
) => {
  renderWithRouter(<CycleLengthPage />, { route: '/assessment/cycle-length' });

  // Find button by text content instead of trying to use label
  const cycleButtons = screen.getAllByRole('button');
  let cycleLengthOption;
  
  for (const button of cycleButtons) {
    if (button.textContent?.includes(cycleLength)) {
      cycleLengthOption = button;
      break;
    }
  }

  if (!cycleLengthOption) {
    throw new Error(`Cycle length option '${cycleLength}' not found`);
  }

  await user.click(cycleLengthOption);
  const continueButton = findEnabledContinueButton();
  await user.click(continueButton!);

  return cycleLength;
};

export const navigateToPeriodDuration = async (
  user: ReturnType<typeof userEvent.setup>,
  duration: string
) => {
  renderWithRouter(<PeriodDurationPage />, { route: '/assessment/period-duration' });

  // Find button by text content instead of using label
  const durationButtons = screen.getAllByRole('button');
  let durationOption;
  
  for (const button of durationButtons) {
    if (button.textContent?.includes(duration)) {
      durationOption = button;
      break;
    }
  }

  if (!durationOption) {
    throw new Error(`Period duration option '${duration}' not found`);
  }

  await user.click(durationOption);
  const continueButton = findEnabledContinueButton();
  await user.click(continueButton!);

  return duration;
};

export const navigateToFlow = async (user: ReturnType<typeof userEvent.setup>, flow: string) => {
  renderWithRouter(<FlowPage />, { route: '/assessment/flow' });

  // Find button by text content instead of using label
  const flowButtons = screen.getAllByRole('button');
  let flowOption;
  
  for (const button of flowButtons) {
    if (button.textContent?.includes(flow)) {
      flowOption = button;
      break;
    }
  }

  if (!flowOption) {
    throw new Error(`Flow option '${flow}' not found`);
  }

  await user.click(flowOption);
  const continueButton = findEnabledContinueButton();
  await user.click(continueButton!);

  return flow;
};

export const navigateToPain = async (user: ReturnType<typeof userEvent.setup>, pain: string) => {
  renderWithRouter(<PainPage />, { route: '/assessment/pain' });

  // Find button by text content instead of using label
  const painButtons = screen.getAllByRole('button');
  let painOption;
  
  for (const button of painButtons) {
    if (button.textContent?.includes(pain)) {
      painOption = button;
      break;
    }
  }

  if (!painOption) {
    throw new Error(`Pain option '${pain}' not found`);
  }

  await user.click(painOption);
  const continueButton = findEnabledContinueButton();
  await user.click(continueButton!);

  return pain;
};

export const navigateToSymptoms = async (
  user: ReturnType<typeof userEvent.setup>,
  symptom: string
) => {
  renderWithRouter(<SymptomsPage />, { route: '/assessment/symptoms' });

  // Find all symptom buttons and click the one that contains the symptom text
  const buttons = screen.getAllByRole('button');
  let symptomButton;
  
  for (const button of buttons) {
    if (button.textContent?.includes(symptom)) {
      symptomButton = button;
      break;
    }
  }
  
  if (!symptomButton) {
    throw new Error(`Symptom option '${symptom}' not found`);
  }

  await user.click(symptomButton);
  const continueButton = findEnabledContinueButton();
  await user.click(continueButton!);

  return [symptom];
};

export const renderResults = (sessionData: Record<string, any>) => {
  setupSessionStorage(sessionData);
  const TestComponent = () => {
    const { setResult } = useAssessmentContext();
    
    // Set the result directly in the context  
    useEffect(() => {
      // Map session data to context result format
      const result = {
        age: sessionData.age,
        cycle_length: sessionData.cycle_length,
        period_duration: sessionData.period_duration,
        flow_heaviness: sessionData.flow_heaviness,
        pain_level: sessionData.pain_level,
        physical_symptoms: sessionData.physical_symptoms || [],
        emotional_symptoms: sessionData.emotional_symptoms || [],
        other_symptoms: sessionData.other_symptoms || '',
        pattern: sessionData.pattern || 'regular'
      };
      console.log('Setting assessment result in context:', result);
      setResult(result);
    }, [setResult]);
    
    return <ResultsPage />;
  };
  
  render(
    <AuthProvider>
      <AssessmentResultProvider>
        <MemoryRouter initialEntries={['/assessment/results']}>
          <Routes>
            <Route path="/assessment/results" element={<TestComponent />} />
          </Routes>
        </MemoryRouter>
      </AssessmentResultProvider>
    </AuthProvider>
  );
};
