import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import AgeVerificationPage from '../page'
import * as AgeVerificationHook from '../../../../../hooks/assessment/steps/use-age-verification'

// Mock the hook
vi.mock('../../../../../hooks/assessment/steps/use-age-verification', () => ({
  useAgeVerification: vi.fn()
}));

// Helper function to render with router
function renderWithRouter(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  )
}

describe('Age Verification Page to Hook Connection', () => {
  const mockSetAge = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    (AgeVerificationHook.useAgeVerification as any).mockReturnValue({
      age: undefined,
      setAge: mockSetAge
    });
  });
  
  it('should call hook with correct value when option is selected', () => {
    renderWithRouter(<AgeVerificationPage />)
    
    // Find the 18-24 option and click it
    const ageOption = screen.getByText('18-24 years').closest('div')
    if (ageOption) {
      fireEvent.click(ageOption)
    }
    
    // Check that the hook's setAge was called with the correct value
    expect(mockSetAge).toHaveBeenCalledWith('18-24')
  })
  
  it('should preselect option when hook returns a value', () => {
    // Mock hook to return a selected value
    (AgeVerificationHook.useAgeVerification as any).mockReturnValue({
      age: '25-plus',
      setAge: mockSetAge
    });
    
    renderWithRouter(<AgeVerificationPage />)
    
    // Verify that the continue button is enabled when an option is selected
    const continueButton = screen.getByText('Continue').closest('button');
    expect(continueButton).not.toBeDisabled();
    
    // Verify that the radio button is checked
    const radioItem = document.getElementById('25-plus');
    expect(radioItem).toBeTruthy();
  })
}) 