import { expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AssessmentResultProvider } from '@/src/context/assessment/AssessmentResultProvider';
import FlowLevelPage from '@/src/pages/assessment/steps/flow/page';

export const runFlowLevelStep = async () => {
  // 1. Start at flow level page
  render(
    <BrowserRouter>
      <AssessmentResultProvider>
        <FlowLevelPage />
      </AssessmentResultProvider>
    </BrowserRouter>
  );
  
  // 2. Select flow level
  const flowOption = screen.getByRole('radio', { name: /heavy/i });
  fireEvent.click(flowOption);
  
  // 3. Verify flow level is stored in session storage
  expect(sessionStorage.getItem('flowHeaviness')).toBe('heavy');
  
  // 4. Click continue
  const continueButton = screen.getByRole('button', { name: /continue/i });
  fireEvent.click(continueButton);
  
  return {
    flowLevel: 'heavy',
    nextStep: '/assessment/pain'
  };
}; 