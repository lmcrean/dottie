import { expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AssessmentResultProvider } from '@/src/pages/assessment/steps/context/AssessmentResultProvider';
import PainLevelPage from '@/src/pages/assessment/steps/pain/page';
import * as PainLevelHook from '@/src/pages/assessment/steps/pain/hooks/use-pain-level';

// Mock the hook to verify it's called correctly
vi.mock('@/src/pages/assessment/steps/pain/hooks/use-pain-level', () => ({
  usePainLevel: vi.fn()
}));

export const runPainLevelStep = async () => {
  // Setup mock
  const mockSetPainLevel = vi.fn();
  (PainLevelHook.usePainLevel as any).mockReturnValue({
    painLevel: undefined,
    setPainLevel: mockSetPainLevel
  });

  // 1. Start at pain level page
  render(
    <BrowserRouter>
      <AssessmentResultProvider>
        <PainLevelPage />
      </AssessmentResultProvider>
    </BrowserRouter>
  );
  
  // 2. Select pain level
  const painOption = screen.getByRole('radio', { name: /moderate/i });
  fireEvent.click(painOption);
  
  // 3. Verify pain level is updated in context via the hook
  expect(mockSetPainLevel).toHaveBeenCalledWith('moderate');
  
  // 4. Click continue
  const continueButton = screen.getByRole('button', { name: /continue/i });
  fireEvent.click(continueButton);
  
  return {
    painLevel: 'moderate',
    nextStep: '/assessment/symptoms'
  };
}; 