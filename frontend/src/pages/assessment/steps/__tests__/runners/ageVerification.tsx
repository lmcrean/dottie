import { expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AssessmentResultProvider } from '@/src/pages/assessment/steps/context/AssessmentResultProvider';
import AgeVerificationPage from '@/src/pages/assessment/steps/1-age-verification/page';

export const runAgeVerificationStep = async () => {
  // 1. Start at age verification page
  render(
    <BrowserRouter>
      <AssessmentResultProvider>
        <AgeVerificationPage />
      </AssessmentResultProvider>
    </BrowserRouter>
  );
  
  // 2. Select an age range
  const ageOption = screen.getByRole('radio', { name: /13-17 years/i });
  fireEvent.click(ageOption);
  
  // 3. Verify age is stored in session storage
  expect(sessionStorage.getItem('age')).toBe('13-17');
  
  // 4. Click continue
  const continueButton = screen.getByRole('button', { name: /continue/i });
  fireEvent.click(continueButton);
  
  return {
    age: '13-17',
    nextStep: '/assessment/cycle-length'
  };
}; 