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
  const durationOption = screen.getByRole('radio', { name: /5-7 days/i });
  fireEvent.click(durationOption);
  
  // 3. Verify period duration is stored in session storage
  expect(sessionStorage.getItem('periodDuration')).toBe('5-7');
  
  // 4. Click continue
  const buttons = screen.getAllByRole('button');
  const continueButton = buttons.find(button => button.textContent?.includes('Continue'));
  if (!continueButton) throw new Error('Continue button not found');
  fireEvent.click(continueButton);
  
  return {
    periodDuration: '5-7',
    nextStep: '/assessment/flow-level'
  };
}; 