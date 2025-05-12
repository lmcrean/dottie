import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AssessmentResultProvider } from '@/src/pages/assessment/context/AssessmentResultProvider';
import SymptomsPage from '@/src/pages/assessment/steps/symptoms/page';

export const runSymptomsStep = async () => {
  // 1. Start at symptoms page
  render(
    <BrowserRouter>
      <AssessmentResultProvider>
        <SymptomsPage></SymptomsPage>
      </AssessmentResultProvider>
    </BrowserRouter>
  );
  
  // 2. Select symptoms
  const symptoms = ['cramps', 'headache', 'fatigue'];
  symptoms.forEach(symptom => {
    const symptomOption = screen.getByTestId(`option-${symptom}`);
    fireEvent.click(symptomOption);
  });
  
  // 3. Verify symptoms are stored in session storage
  expect(JSON.parse(sessionStorage.getItem('symptoms') || '[]')).toEqual(symptoms);
  
  // 4. Click continue
  const continueButton = screen.getByTestId('continue-button');
  fireEvent.click(continueButton);
  
  return {
    symptoms,
    nextStep: '/assessment/results'
  };
}; 