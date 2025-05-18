import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import PeriodDurationPage from '../page'
import { AssessmentResultProvider } from '../../../../../context/assessment/AssessmentResultProvider'
import * as PeriodDurationHook from '../hooks/use-period-duration'

// Mock the hook
vi.mock('../../../../../hooks/assessment/steps/use-period-duration', () => ({
  usePeriodDuration: vi.fn()
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

describe('PeriodDuration', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
    // Default mock implementation
    (PeriodDurationHook.usePeriodDuration as any).mockReturnValue({
      periodDuration: undefined,
      setPeriodDuration: vi.fn()
    });
  });
  
  it('should render the period duration page correctly', () => {
    renderWithRouter(<PeriodDurationPage />)
    
    // Check if the main heading is displayed
    expect(screen.getByText('How many days does your period typically last?')).toBeInTheDocument()
    
    // Check if options are displayed
    expect(screen.getByText('1-3 days')).toBeInTheDocument()
    expect(screen.getByText('4-5 days')).toBeInTheDocument()
    expect(screen.getByText('6-7 days')).toBeInTheDocument()
    expect(screen.getByText('8+ days')).toBeInTheDocument()
    expect(screen.getByText('It varies')).toBeInTheDocument()
    expect(screen.getByText('I\'m not sure')).toBeInTheDocument()
    expect(screen.getByText('Other')).toBeInTheDocument()
    
    // Check if the informational content is displayed
    expect(screen.getByText('About Period Duration')).toBeInTheDocument()
  })

  it('should enable the continue button when a period duration is selected', () => {
    // Mock the periodDuration state to be set
    (PeriodDurationHook.usePeriodDuration as any).mockReturnValue({
      periodDuration: '4-5',
      setPeriodDuration: vi.fn()
    });
    
    renderWithRouter(<PeriodDurationPage />)
    
    // With periodDuration set, continue button should be enabled
    const continueButton = screen.getByText('Continue').closest('button')
    expect(continueButton).not.toBeDisabled()
  })

  it('should navigate to the previous page when back button is clicked', () => {
    renderWithRouter(<PeriodDurationPage />)
    
    // Check if the back button links to the cycle length page
    const backButton = screen.getByText('Back').closest('a')
    expect(backButton).toHaveAttribute('href', '/assessment/cycle-length')
  })

  it('should display privacy information', () => {
    renderWithRouter(<PeriodDurationPage />)
    
    // Check if privacy information is displayed
    expect(screen.getByText('Your data is private and secure. Dottie does not store your personal health information.')).toBeInTheDocument()
  })
}) 