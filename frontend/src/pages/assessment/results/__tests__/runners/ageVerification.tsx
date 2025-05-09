import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AssessmentResultProvider } from '@/src/context/assessment/AssessmentResultProvider';
import AgeVerificationPage from '@/src/pages/assessment/steps/age-verification/page';

export const runAgeVerificationStep = async () => {
  // 1. Start at age verification page
  render(
    <BrowserRouter>
      <AssessmentResultProvider>
        <AgeVerificationPage></AgeVerificationPage>
      </AssessmentResultProvider>
    </BrowserRouter>
  );
  
  // 2. Select an age range
  const ageOption = screen.getByRole('radio', { name: /13-17 years/i });
  fireEvent.click(ageOption);
  
  // 3. Verify age is stored in session storage
  expect(sessionStorage.getItem('age')).toBe('13-17');
  
  // 4. Click continue
  const buttons = screen.getAllByRole('button');
  const continueButton = buttons.find(button => button.textContent?.includes('Continue'));
  if (!continueButton) throw new Error('Continue button not found');
  fireEvent.click(continueButton);
  
  return {
    age: '13-17',
    nextStep: '/assessment/cycle-length'
  };
}; 