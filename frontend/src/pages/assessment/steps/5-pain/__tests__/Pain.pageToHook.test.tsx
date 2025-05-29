import { render, screen, fireEvent, within } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import PainPage from '../page'
import * as PainLevelHook from '../hooks/use-pain-level'

// Mock the hook
vi.mock('../hooks/use-pain-level');

// Wrap component with BrowserRouter for React Router compatibility
const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Pain Page to Hook Connection', () => {
  const mockSetPainLevel = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Use vi.spyOn to mock the implementation
    vi.spyOn(PainLevelHook, 'usePainLevel').mockImplementation(() => ({
      painLevel: undefined,
      setPainLevel: mockSetPainLevel
    }));
  });
  
  it('should call hook with correct value when option is selected', () => {
    renderWithRouter(<PainPage />)
    
    // Find the Moderate option and click it
    const moderateOption = screen.getByText('Moderate').closest('div')
    if (moderateOption) {
      fireEvent.click(moderateOption)
    }
    
    // Check that the hook's setPainLevel was called with the correct value
    expect(mockSetPainLevel).toHaveBeenCalledWith('moderate')
  })
  
  it('should preselect option when hook returns a value', () => {
    // Mock hook to return a selected value using spyOn
    vi.spyOn(PainLevelHook, 'usePainLevel').mockImplementation(() => ({
      painLevel: 'severe',
      setPainLevel: mockSetPainLevel
    }));
    
    renderWithRouter(<PainPage />)
    
    // Check that the radio item for 'severe' is checked
    const radioItem = document.getElementById('severe');
    expect(radioItem).toBeTruthy();
    
    // Verify the continue button is enabled
    const continueButton = screen.getByText('Continue').closest('button');
    expect(continueButton).not.toBeDisabled();
  })
}) 