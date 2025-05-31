import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import FlowPage from '../page'
import * as FlowHeavinessHook from '../hooks/use-flow-heaviness'

// Mock the hook
vi.mock('../hooks/use-flow-heaviness');

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
    
    // Use vi.spyOn to mock the implementation
    vi.spyOn(FlowHeavinessHook, 'useFlowHeaviness').mockImplementation(() => ({
      flowHeaviness: undefined,
      setFlowHeaviness: mockSetFlowHeaviness
    }));
  });
  
  it('should call hook with correct value when option is selected', () => {
    renderWithRouter(<FlowPage />)
    
    // Find the Heavy option and click it
    const heavyOption = screen.getByText('Heavy').closest('div')
    if (heavyOption) {
      fireEvent.click(heavyOption)
    }
    
    // Check that the hook's setFlowHeaviness was called with the correct value
    expect(mockSetFlowHeaviness).toHaveBeenCalledWith('heavy')
  })
  
  it('should preselect option when hook returns a value', () => {
    // Mock hook to return a selected value
    vi.spyOn(FlowHeavinessHook, 'useFlowHeaviness').mockImplementation(() => ({
      flowHeaviness: 'very-heavy',
      setFlowHeaviness: mockSetFlowHeaviness
    }));
    
    renderWithRouter(<FlowPage />)
    
    // Check that the continue button is enabled
    const continueButton = screen.getByText('Continue').closest('button');
    expect(continueButton).not.toBeDisabled();
    
    // Look for selected option by class instead of ID
    const heavyOption = screen.getByText('Very Heavy').closest('div');
    expect(heavyOption).toHaveClass('bg-pink-50');
  })
}) 