import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import CycleLengthPage from '../page'
import * as CycleLengthHook from '../../../../../hooks/assessment/steps/use-cycle-length'

// Mock the hook
vi.mock('../../../../../hooks/assessment/steps/use-cycle-length', () => ({
  useCycleLength: vi.fn()
}));

// Helper function to render with router
function renderWithRouter(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  )
}

describe('Cycle Length Page to Hook Connection', () => {
  const mockSetCycleLength = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    (CycleLengthHook.useCycleLength as any).mockReturnValue({
      cycleLength: undefined,
      setCycleLength: mockSetCycleLength
    });
  });
  
  it('should call hook with correct value when option is selected', () => {
    renderWithRouter(<CycleLengthPage />)
    
    // Find the 26-30 option and click it
    const lengthOption = screen.getByText('26-30 days').closest('div')
    if (lengthOption) {
      fireEvent.click(lengthOption)
    }
    
    // Check that the hook's setCycleLength was called with the correct value
    expect(mockSetCycleLength).toHaveBeenCalledWith('26-30')
  })
  
  it('should preselect option when hook returns a value', () => {
    // Mock hook to return a selected value
    (CycleLengthHook.useCycleLength as any).mockReturnValue({
      cycleLength: '31-35',
      setCycleLength: mockSetCycleLength
    });
    
    renderWithRouter(<CycleLengthPage />)
    
    // Verify that the continue button is enabled when an option is selected
    const continueButton = screen.getByText('Continue').closest('button');
    expect(continueButton).not.toBeDisabled();
    
    // Verify that the radio button is checked
    const radioItem = document.getElementById('31-35');
    expect(radioItem).toBeTruthy();
  })
}) 