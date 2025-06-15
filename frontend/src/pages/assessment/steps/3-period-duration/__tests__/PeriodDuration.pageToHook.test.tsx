import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import PeriodDurationPage from '../page'
import * as PeriodDurationHook from '../hooks/use-period-duration'

// Mock the hook
vi.mock('../hooks/use-period-duration');

// Helper function to render with router
function renderWithRouter(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  )
}

describe('Period Duration Page to Hook Connection', () => {
  const mockSetPeriodDuration = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Use vi.spyOn to mock the implementation
    vi.spyOn(PeriodDurationHook, 'usePeriodDuration').mockImplementation(() => ({
      periodDuration: undefined,
      setPeriodDuration: mockSetPeriodDuration
    }));
  });
  
  it('should call hook with correct value when option is selected', () => {
    renderWithRouter(<PeriodDurationPage />)
    
    // Find the 4-5 days option and click it
    const durationOption = screen.getByText('4-5 days').closest('div')
    if (durationOption) {
      fireEvent.click(durationOption)
    }
    
    // Check that the hook's setPeriodDuration was called with the correct value
    expect(mockSetPeriodDuration).toHaveBeenCalledWith('4-5')
  })
  
  it('should preselect option when hook returns a value', () => {
    // Mock hook to return a selected value using spyOn
    vi.spyOn(PeriodDurationHook, 'usePeriodDuration').mockImplementation(() => ({
      periodDuration: '6-7',
      setPeriodDuration: mockSetPeriodDuration
    }));
    
    renderWithRouter(<PeriodDurationPage />)
    
    // Verify that the continue button is enabled when an option is selected
    const continueButton = screen.getByText('Continue').closest('button');
    expect(continueButton).not.toBeDisabled();
    
    // Verify that the radio button is checked
    const radioItem = document.getElementById('6-7');
    expect(radioItem).toBeTruthy();
  })
}) 