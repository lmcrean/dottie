import { expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AssessmentResultProvider } from '@/src/pages/assessment/steps/context/AssessmentResultProvider';
import SymptomsPage from '@/src/pages/assessment/steps/6-symptoms/page';

export const runSymptomsStep = async () => {
  // 1. Start at symptoms page
  render(
    <BrowserRouter>
      <AssessmentResultProvider>
        <SymptomsPage />
      </AssessmentResultProvider>
    </BrowserRouter>
  );
  
  // 2. Select symptoms
  const symptoms = ['cramps', 'headache', 'fatigue'];
  symptoms.forEach(symptom => {
    const symptomOption = screen.getByRole('checkbox', { name: new RegExp(symptom, 'i') });
    fireEvent.click(symptomOption);
  });
  
  // 3. Verify symptoms are stored in session storage
  expect(JSON.parse(sessionStorage.getItem('symptoms') || '[]')).toEqual(symptoms);
  
  // 4. Click continue
  const continueButton = screen.getByRole('button', { name: /finish assessment/i });
  fireEvent.click(continueButton);
  
  return {
    symptoms,
    nextStep: '/assessment/results'
  };
}; 