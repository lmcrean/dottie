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
  const ageOption = screen.getByTestId('option-13-17');
  fireEvent.click(ageOption);
  
  // 3. Verify age is stored in session storage
  expect(sessionStorage.getItem('age')).toBe('13-17');
  
  // 4. Click continue
  const continueButton = screen.getByTestId('continue-button');
  fireEvent.click(continueButton);
  
  return {
    age: '13-17',
    nextStep: '/assessment/cycle-length'
  };
}; 