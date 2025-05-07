import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import FlowPage from '../page'

// Helper function to render with router
function renderWithRouter(ui: React.ReactElement) {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  )
}

describe('Flow page', () => {
  it('renders the flow page correctly', () => {
    renderWithRouter(<FlowPage />)
    
    // Check title
    expect(screen.getByText('How would you describe your menstrual flow?')).toBeInTheDocument()
    
    // Check options
    expect(screen.getByText('Light')).toBeInTheDocument()
    expect(screen.getByText('Moderate')).toBeInTheDocument()
    expect(screen.getByText('Heavy')).toBeInTheDocument()
    expect(screen.getByText('Very Heavy')).toBeInTheDocument()
    expect(screen.getByText('It varies')).toBeInTheDocument()
    expect(screen.getByText('I\'m not sure')).toBeInTheDocument()
    
    // Check info card
    expect(screen.getByText('About Flow Heaviness')).toBeInTheDocument()
  })

  it('enables continue button when an option is selected', () => {
    renderWithRouter(<FlowPage />)
    
    // Continue button should be disabled initially
    const continueButton = screen.getByText('Continue').closest('button')
    expect(continueButton).toBeDisabled()
    
    // Click directly on the option's parent div
    const optionDiv = screen.getByText('Moderate').closest('div')
    if (optionDiv) {
      fireEvent.click(optionDiv)
    }
    
    // Continue button should be enabled now
    expect(continueButton).not.toBeDisabled()
  })

  it('navigates to the previous page when back button is clicked', () => {
    renderWithRouter(<FlowPage />)
    
    // Check if the back button links to the period duration page
    const backButton = screen.getByText('Back').closest('a')
    expect(backButton).toHaveAttribute('href', '/assessment/period-duration')
  })

  it('displays the correct progress percentage', () => {
    renderWithRouter(<FlowPage />)
    
    // Check progress indicator
    expect(screen.getByText('67% Complete')).toBeInTheDocument()
  })
}) 