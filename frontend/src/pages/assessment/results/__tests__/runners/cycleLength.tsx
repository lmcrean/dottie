import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AssessmentResultProvider } from '@/src/context/assessment/AssessmentResultProvider';
import CycleLengthPage from '@/src/pages/assessment/steps/cycle-length/page';

export const runCycleLengthStep = async () => {
  // 1. Start at cycle length page
  render(
    <BrowserRouter>
      <AssessmentResultProvider>
        <CycleLengthPage></CycleLengthPage>
      </AssessmentResultProvider>
    </BrowserRouter>
  );
  
  // 2. Select cycle length
  const cycleOption = screen.getByTestId('option-irregular');
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