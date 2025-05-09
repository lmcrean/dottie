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
  const cycleOption = screen.getByRole('radio', { name: /irregular/i });
  fireEvent.click(cycleOption);
  
  // 3. Verify cycle length is stored in session storage
  expect(sessionStorage.getItem('cycleLength')).toBe('irregular');
  
  // 4. Click continue
  const buttons = screen.getAllByRole('button');
  const continueButton = buttons.find(button => button.textContent?.includes('Continue'));
  if (!continueButton) throw new Error('Continue button not found');
  fireEvent.click(continueButton);
  
  return {
    cycleLength: 'irregular',
    nextStep: '/assessment/period-duration'
  };
}; 