import { expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AssessmentResultProvider } from '@/src/pages/assessment/steps/context/AssessmentResultProvider';
import FlowLevelPage from '@/src/pages/assessment/steps/flow/page';
import * as FlowHeavinessHook from '@/src/pages/assessment/steps/flow/hooks/use-flow-heaviness';

// Mock the hook to verify it's called correctly
vi.mock('@/src/pages/assessment/steps/flow/hooks/use-flow-heaviness', () => ({
  useFlowHeaviness: vi.fn()
}));

export const runFlowLevelStep = async () => {
  // Setup mock
  const mockSetFlowHeaviness = vi.fn();
  (FlowHeavinessHook.useFlowHeaviness as any).mockReturnValue({
    flowHeaviness: undefined,
    setFlowHeaviness: mockSetFlowHeaviness
  });

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
  
  // 3. Verify flow level is updated in context via the hook
  expect(mockSetFlowHeaviness).toHaveBeenCalledWith('heavy');
  
  // 4. Click continue
  const continueButton = screen.getByRole('button', { name: /continue/i });
  fireEvent.click(continueButton);
  
  return {
    flowLevel: 'heavy',
    nextStep: '/assessment/pain'
  };
}; 