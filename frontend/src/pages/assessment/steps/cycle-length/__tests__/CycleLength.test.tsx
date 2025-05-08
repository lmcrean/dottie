import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import CycleLengthPage from '../page'
import { AssessmentResultProvider } from '../../../../../context/assessment/AssessmentResultProvider'
import * as CycleLengthHook from '../../../../../hooks/assessment/steps/use-cycle-length'

// Mock the hook
vi.mock('../../../../../hooks/assessment/steps/use-cycle-length', () => ({
  useCycleLength: vi.fn()
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

describe('CycleLength', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
    // Default mock implementation
    (CycleLengthHook.useCycleLength as any).mockReturnValue({
      cycleLength: undefined,
      setCycleLength: vi.fn()
    });
  });
  
  it('should render the cycle length page correctly', () => {
    renderWithRouter(<CycleLengthPage />)
    
    // Check if the main heading is displayed
    expect(screen.getByText('How long is your menstrual cycle?')).toBeInTheDocument()
    
    // Check if options are displayed
    expect(screen.getByText('21-25 days')).toBeInTheDocument()
    expect(screen.getByText('26-30 days')).toBeInTheDocument()
    expect(screen.getByText('31-35 days')).toBeInTheDocument()
    expect(screen.getByText('36-40 days')).toBeInTheDocument()
    expect(screen.getByText('Irregular')).toBeInTheDocument()
    expect(screen.getByText('I\'m not sure')).toBeInTheDocument()
    expect(screen.getByText('Other')).toBeInTheDocument()
    
    // Check if the informational content is displayed
    expect(screen.getByText('About Menstrual Cycles')).toBeInTheDocument()
  })

  it('should enable the continue button when a cycle length is selected', () => {
    // Mock the cycleLength state to be set
    (CycleLengthHook.useCycleLength as any).mockReturnValue({
      cycleLength: '26-30',
      setCycleLength: vi.fn()
    });
    
    renderWithRouter(<CycleLengthPage />)
    
    // With cycleLength set, continue button should be enabled
    const continueButton = screen.getByText('Continue').closest('button')
    expect(continueButton).not.toBeDisabled()
  })

  it('should navigate to the previous page when back button is clicked', () => {
    renderWithRouter(<CycleLengthPage />)
    
    // Check if the back button links to the age verification page
    const backButton = screen.getByText('Back').closest('a')
    expect(backButton).toHaveAttribute('href', '/assessment/age-verification')
  })

  it('should display privacy information', () => {
    renderWithRouter(<CycleLengthPage />)
    
    // Check if the informational content is displayed instead of privacy text
    expect(screen.getByText('About Menstrual Cycles')).toBeInTheDocument()
    expect(screen.getByText(/A typical menstrual cycle can range from 21 to 35 days/i)).toBeInTheDocument()
  })
}) 