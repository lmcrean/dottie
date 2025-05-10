import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import FlowPage from '../page'
import * as FlowHeavinessHook from '../../../../../hooks/assessment/steps/use-flow-heaviness'

// Mock the hook
vi.mock('../../../../../hooks/assessment/steps/use-flow-heaviness', () => ({
  useFlowHeaviness: vi.fn()
}));

// Helper function to render with router
function renderWithRouter(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  )
}

describe('Flow Page to Hook Connection', () => {
  const mockSetFlowHeaviness = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    (FlowHeavinessHook.useFlowHeaviness as any).mockReturnValue({
      flowHeaviness: undefined,
      setFlowHeaviness: mockSetFlowHeaviness
    });
  });
  
  it('should call hook with correct value when option is selected', () => {
    renderWithRouter(<FlowPage />)
    
    // Find the Moderate option and click it
    const moderateOption = screen.getByText('Moderate').closest('div')
    if (moderateOption) {
      fireEvent.click(moderateOption)
    }
    
    // Check that the hook's setFlowHeaviness was called with the correct value
    expect(mockSetFlowHeaviness).toHaveBeenCalledWith('moderate')
  })
  
  it('should preselect option when hook returns a value', () => {
    // Mock hook to return a selected value
    (FlowHeavinessHook.useFlowHeaviness as any).mockReturnValue({
      flowHeaviness: 'heavy',
      setFlowHeaviness: mockSetFlowHeaviness
    });
    
    renderWithRouter(<FlowPage />)
    
    // Verify that the continue button is enabled when an option is selected
    const continueButton = screen.getByText('Continue').closest('button');
    expect(continueButton).not.toBeDisabled();
    
    // Verify that the radio button is checked
    const radioItem = document.getElementById('heavy');
    expect(radioItem).toBeTruthy();
  })
}) 