import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AssessmentResultProvider } from '@/src/context/assessment/AssessmentResultProvider';
import PeriodDurationPage from '@/src/pages/assessment/steps/period-duration/page';

export const runPeriodDurationStep = async () => {
  // 1. Start at period duration page
  render(
    <BrowserRouter>
      <AssessmentResultProvider>
        <PeriodDurationPage></PeriodDurationPage>
      </AssessmentResultProvider>
    </BrowserRouter>
  );
  
  // 2. Select period duration
  const durationOption = screen.getByTestId('option-5-7');
  fireEvent.click(durationOption);
  
  // 3. Verify period duration is stored in session storage
  expect(sessionStorage.getItem('periodDuration')).toBe('5-7');
  
  // 4. Click continue
  const continueButton = screen.getByTestId('continue-button');
  fireEvent.click(continueButton);
  
  return {
    periodDuration: '5-7',
    nextStep: '/assessment/flow-level'
  };
}; 