import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import PainPage from '../page'
import { AssessmentResultProvider } from '../../../../../context/assessment/AssessmentResultProvider'
import * as PainLevelHook from '../hooks/use-pain-level'

// Mock the hook
vi.mock('../../../../../hooks/assessment/steps/use-pain-level', () => ({
  usePainLevel: vi.fn()
}));

// Wrap component with BrowserRouter and AssessmentResultProvider for testing
const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <AssessmentResultProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </AssessmentResultProvider>
  )
}

describe('Pain', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
    // Default mock implementation
    (PainLevelHook.usePainLevel as any).mockReturnValue({
      painLevel: undefined,
      setPainLevel: vi.fn()
    });
  });
  
  it('should render the pain page correctly', () => {
    renderWithRouter(<PainPage />)
    
    // Check if the main heading is displayed
    expect(screen.getByText('How would you rate your menstrual pain?')).toBeInTheDocument()
    
    // Check if all pain level options are displayed
    expect(screen.getByText('No Pain')).toBeInTheDocument()
    expect(screen.getByText('Mild')).toBeInTheDocument()
    expect(screen.getByText('Moderate')).toBeInTheDocument()
    expect(screen.getByText('Severe')).toBeInTheDocument()
    expect(screen.getByText('Debilitating')).toBeInTheDocument()
    expect(screen.getByText('It varies')).toBeInTheDocument()
    
    // Check if the informational content is displayed
    expect(screen.getByText('About Menstrual Pain')).toBeInTheDocument()
  })

  it('should enable the continue button when a pain level is selected', () => {
    // Mock the painLevel state to be set
    (PainLevelHook.usePainLevel as any).mockReturnValue({
      painLevel: 'moderate',
      setPainLevel: vi.fn()
    });
    
    renderWithRouter(<PainPage />)
    
    // With painLevel set to 'moderate', continue button should be enabled
    const continueButton = screen.getByText('Continue').closest('button')
    expect(continueButton).not.toBeDisabled()
  })

  it('should navigate to the previous page when back button is clicked', () => {
    renderWithRouter(<PainPage />)
    
    // Check if the back button links to the flow page
    const backButton = screen.getByText('Back').closest('a')
    expect(backButton).toHaveAttribute('href', '/assessment/flow')
  })

  it('should display privacy information', () => {
    renderWithRouter(<PainPage />)
    
    // Check if privacy information is displayed
    expect(screen.getByText('Your data is private and secure. Dottie does not store your personal health information.')).toBeInTheDocument()
  })
}) 