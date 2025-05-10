import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AssessmentResultProvider } from '@/src/context/assessment/AssessmentResultProvider';
import PainLevelPage from '@/src/pages/assessment/steps/pain/page';

export const runPainLevelStep = async () => {
  // 1. Start at pain level page
  render(
    <BrowserRouter>
      <AssessmentResultProvider>
        <PainLevelPage></PainLevelPage>
      </AssessmentResultProvider>
    </BrowserRouter>
  );
  
  // 2. Select pain level
  const painOption = screen.getByRole('radio', { name: /moderate/i });
  fireEvent.click(painOption);
  
  // 3. Verify pain level is stored in session storage
  expect(sessionStorage.getItem('painLevel')).toBe('moderate');
  
  // 4. Click continue
  const buttons = screen.getAllByRole('button');
  const continueButton = buttons.find(button => button.textContent?.includes('Continue'));
  if (!continueButton) throw new Error('Continue button not found');
  fireEvent.click(continueButton);
  
  return {
    painLevel: 'moderate',
    nextStep: '/assessment/symptoms'
  };
}; 