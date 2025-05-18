import { expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AssessmentResultProvider } from '@/src/pages/assessment/steps/context/AssessmentResultProvider';
import PeriodDurationPage from '@/src/pages/assessment/steps/3-period-duration/page';

export const runPeriodDurationStep = async () => {
  // 1. Start at period duration page
  render(
    <BrowserRouter>
      <AssessmentResultProvider>
        <PeriodDurationPage />
      </AssessmentResultProvider>
    </BrowserRouter>
  );
  
  // 2. Select period duration
  const durationOption = screen.getByRole('radio', { name: /5-7 days/i });
  fireEvent.click(durationOption);
  
  // 3. Verify period duration is stored in session storage
  expect(sessionStorage.getItem('periodDuration')).toBe('5-7');
  
  // 4. Click continue
  const continueButton = screen.getByRole('button', { name: /continue/i });
  fireEvent.click(continueButton);
  
  return {
    periodDuration: '5-7',
    nextStep: '/assessment/flow'
  };
}; 