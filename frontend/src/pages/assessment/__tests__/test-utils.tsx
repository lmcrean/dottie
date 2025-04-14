import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import userEvent from '@testing-library/user-event'
import { AuthProvider } from '@/src/context/AuthContext'

// Import all assessment pages
import AgeVerificationPage from '../age-verification/page'
import CycleLengthPage from '../cycle-length/page'
import PeriodDurationPage from '../period-duration/page'
import FlowPage from '../flow/page'
import PainPage from '../pain/page'
import SymptomsPage from '../symptoms/page'
import ResultsPage from '../results/page'

// Mock router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  }
})

// Helper to render with router at a specific starting route
export const renderWithRouter = (
  ui: React.ReactElement,
  { route = '/' } = {}
) => {
  return render(
    <AuthProvider>
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
    </AuthProvider>
  )
}

// Helper to find the enabled continue button
export const findEnabledContinueButton = () => {
  const buttons = screen.getAllByRole('button', { name: /continue/i });
  // Find the button that is not disabled
  return buttons.find(button => !button.hasAttribute('disabled'));
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
export const navigateToAgeVerification = async (user: ReturnType<typeof userEvent.setup>, age: string) => {
  renderWithRouter(<AgeVerificationPage />, { route: '/assessment/age-verification' });
  
  let ageOption;
  if (age === '13-17 years') {
    // For 13-17 age range, find it by searching text in the parent element
    const ageOptions = screen.getAllByRole('radio');
    for (const option of ageOptions) {
      const nearbyText = option.closest('div')?.textContent || '';
      if (nearbyText.includes('13-17')) {
        ageOption = option;
        break;
      }
    }
  } else {
    // For other ages, use the label
    ageOption = screen.getByLabelText(age, { exact: false });
  }
  
  await user.click(ageOption!);
  const continueButton = findEnabledContinueButton();
  await user.click(continueButton!);
  
  return age;
};

export const navigateToCycleLength = async (user: ReturnType<typeof userEvent.setup>, cycleLength: string) => {
  renderWithRouter(<CycleLengthPage />, { route: '/assessment/cycle-length' });
  
  let cycleLengthOption;
  if (cycleLength === 'Variable' || cycleLength === 'I\'m not sure') {
    // For variable or unsure options, find by searching nearby text
    const cycleOptions = screen.getAllByRole('radio');
    for (const option of cycleOptions) {
      const nearbyText = option.closest('div')?.textContent || '';
      if (nearbyText.includes('not sure') || nearbyText.includes('Irregular')) {
        cycleLengthOption = option;
        break;
      }
    }
  } else {
    // For specific lengths, use the label
    cycleLengthOption = screen.getByLabelText(cycleLength, { exact: false });
  }
  
  await user.click(cycleLengthOption!);
  const continueButton = findEnabledContinueButton();
  await user.click(continueButton!);
  
  return cycleLength;
};

export const navigateToPeriodDuration = async (user: ReturnType<typeof userEvent.setup>, duration: string) => {
  renderWithRouter(<PeriodDurationPage />, { route: '/assessment/period-duration' });
  
  let durationOption;
  if (duration === '8+ days' || duration === 'More than 7 days') {
    // For longer durations, get the last radio button
    const radioButtons = screen.getAllByRole('radio');
    durationOption = radioButtons[radioButtons.length - 1];
  } else {
    // For specific durations, use the label
    durationOption = screen.getByLabelText(duration, { exact: false });
  }
  
  await user.click(durationOption!);
  const continueButton = findEnabledContinueButton();
  await user.click(continueButton!);
  
  return duration;
};

export const navigateToFlow = async (user: ReturnType<typeof userEvent.setup>, flow: string) => {
  renderWithRouter(<FlowPage />, { route: '/assessment/flow' });
  
  const flowOption = screen.getByLabelText(flow, { exact: false });
  await user.click(flowOption);
  const continueButton = findEnabledContinueButton();
  await user.click(continueButton!);
  
  return flow;
};

export const navigateToPain = async (user: ReturnType<typeof userEvent.setup>, pain: string) => {
  renderWithRouter(<PainPage />, { route: '/assessment/pain' });
  
  let painOption;
  if (pain === 'Severe') {
    // For severe pain, get the last radio button
    const radioButtons = screen.getAllByRole('radio');
    painOption = radioButtons[radioButtons.length - 1];
  } else {
    // For specific pain levels, use the label
    painOption = screen.getByLabelText(pain, { exact: false });
  }
  
  await user.click(painOption!);
  const continueButton = findEnabledContinueButton();
  await user.click(continueButton!);
  
  return pain;
};

export const navigateToSymptoms = async (user: ReturnType<typeof userEvent.setup>, symptom: string) => {
  renderWithRouter(<SymptomsPage />, { route: '/assessment/symptoms' });
  
  // Find the symptom text and click its container
  const symptomElements = screen.getAllByText(symptom);
  await user.click(symptomElements[0].closest('div')!);
  
  const continueButton = findEnabledContinueButton();
  await user.click(continueButton!);
  
  return [symptom];
};

export const renderResults = (sessionData: Record<string, any>) => {
  setupSessionStorage(sessionData);
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/assessment/results']}>
        <Routes>
          <Route path="/assessment/results" element={<ResultsPage />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}; 