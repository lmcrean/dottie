import { expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AssessmentResultProvider } from '@/src/pages/assessment/steps/context/AssessmentResultProvider';
import CycleLengthPage from '@/src/pages/assessment/steps/2-cycle-length/page';

export const runCycleLengthStep = async () => {
  // 1. Start at cycle length page
  render(
    <BrowserRouter>
      <AssessmentResultProvider>
        <CycleLengthPage />
      </AssessmentResultProvider>
    </BrowserRouter>
  );
  
  // 2. Select cycle length
  const cycleOption = screen.getByRole('radio', { name: /irregular/i });
  fireEvent.click(cycleOption);
  
  // 3. Verify cycle length is stored in session storage
  expect(sessionStorage.getItem('cycleLength')).toBe('irregular');
  
  // 4. Click continue
  const continueButton = screen.getByTestId('continue-button');
  fireEvent.click(continueButton);
  
  return {
    cycleLength: 'irregular',
    nextStep: '/assessment/period-duration'
  };
}; 