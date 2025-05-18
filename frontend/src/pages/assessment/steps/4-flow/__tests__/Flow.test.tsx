import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import FlowPage from '../page'
import { AssessmentResultProvider } from '../../../../../context/assessment/AssessmentResultProvider'
import * as FlowHook from '../hooks/use-flow-heaviness'

// Mock the hook
vi.mock('../../../../../hooks/assessment/steps/use-flow-heaviness', () => ({
  useFlowHeaviness: vi.fn()
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

describe('Flow page', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
    // Default mock implementation
    (FlowHook.useFlowHeaviness as any).mockReturnValue({
      flowHeaviness: undefined,
      setFlowHeaviness: vi.fn()
    });
  });
  
  it('renders the flow page correctly', () => {
    renderWithRouter(<FlowPage />)
    expect(screen.getByText('How would you describe your menstrual flow?')).toBeInTheDocument()
  })

  it('enables continue button when an option is selected', () => {
    // Mock the flowHeaviness state to be set
    (FlowHook.useFlowHeaviness as any).mockReturnValue({
      flowHeaviness: 'moderate',
      setFlowHeaviness: vi.fn()
    });
    
    renderWithRouter(<FlowPage />)
    const continueButton = screen.getByText('Continue').closest('button')
    expect(continueButton).not.toBeDisabled()
  })

  it('navigates to the previous page when back button is clicked', () => {
    renderWithRouter(<FlowPage />)
    const backButton = screen.getByText('Back').closest('a')
    expect(backButton).toHaveAttribute('href', '/assessment/period-duration')
  })

  it('displays the correct progress percentage', () => {
    renderWithRouter(<FlowPage />)
    expect(screen.getByText('67% Complete')).toBeInTheDocument()
  })
}) 