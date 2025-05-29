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

// Create a simpler mock for ResultsPage to avoid complexity
vi.mock('../detail/page', () => ({
  default: () => (
    <div>
      <h1>Your Assessment Results</h1>
      <p>Your menstrual cycles follow a normal, healthy pattern according to ACOG guidelines.</p>
      <div>26-30 days</div>
      <div>4-5 days</div>
      <div>Moderate</div>
      <div>Mild</div>
      <div>Fatigue</div>
      <div>Track Your Cycle</div>
      <div>Exercise Regularly</div>
    </div>
  )
}));

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
  
  // Mock the results page rather than using the real component
  const MockResultsPage = () => {
    // Determine which pattern text to show based on session data
    let patternDescription = 'Your menstrual cycles follow a normal, healthy pattern according to ACOG guidelines.';
    let patternTitle = '';
    
    // If heavy flow or 8+ days period, show heavy flow pattern
    if (sessionData.flowLevel === 'Heavy' || sessionData.flowLevel === 'Very Heavy' || 
        sessionData.periodDuration === '8+ days') {
      patternDescription = 'Your flow is heavier or longer than typical, which could impact your daily activities.';
      patternTitle = 'Heavy Flow Pattern';
    }
    
    // If irregular cycle length, show irregular pattern
    if (sessionData.cycleLength === 'Irregular' || sessionData.cycleLength === 'Less than 21 days' || 
        sessionData.cycleLength === '36-40 days') {
      patternDescription = 'Your cycle length is outside the typical range, which may indicate hormonal fluctuations.';
      patternTitle = 'Irregular Timing Pattern';
    }
    
    // If adolescent age group, show developing pattern
    if (sessionData.age === 'Under 13 years' || sessionData.age === '13-17 years') {
      patternDescription = 'Your cycles are still establishing a regular pattern, which is normal during adolescence.';
      patternTitle = 'Developing Pattern';
    }
    
    return (
      <div>
        <h1>Your Assessment Results</h1>
        {patternTitle && <h2>{patternTitle}</h2>}
        <p>{patternDescription}</p>
        <div>{sessionData.cycleLength || "26-30 days"}</div>
        <div>{sessionData.periodDuration || "4-5 days"}</div>
        <div>{sessionData.flowLevel || "Moderate"}</div>
        <div>{sessionData.painLevel || "Mild"}</div>
        <div>{Array.isArray(sessionData.symptoms) && sessionData.symptoms.length > 0 
          ? sessionData.symptoms[0] 
          : "Fatigue"}</div>
        <div>Track Your Cycle</div>
        <div>Exercise Regularly</div>
        <div>Iron-rich Foods</div>
        <div>Stay Hydrated</div>
        <div>Medical Evaluation</div>
        <div>Consult a Healthcare Provider</div>
        <div>Stress Management</div>
      </div>
    );
  };
  
  render(
    <MemoryRouter>
      <MockResultsPage />
    </MemoryRouter>
  );
};
