import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import PeriodDurationPage from '../page'

// Wrap component with BrowserRouter for React Router compatibility
const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('PeriodDuration', () => {
  it('should render the period duration page correctly', () => {
    renderWithRouter(<PeriodDurationPage />)
    
    // Check if the main heading is displayed
    expect(screen.getByText('How many days does your period typically last?')).toBeInTheDocument()
    
    // Check if all duration options are displayed
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
    renderWithRouter(<PeriodDurationPage />)
    
    // Continue button should be disabled initially
    const continueButton = screen.getByText('Continue').closest('button')
    expect(continueButton).toBeDisabled()
    
    // Select a duration option
    const durationOption = screen.getByRole('radio', { name: /4-5 days/i }) || 
                           screen.getByTestId('4-5') || 
                           document.getElementById('4-5')
    
    // If we can't find it by role, try to find it directly
    if (!durationOption) {
      const optionContainer = screen.getByText('4-5 days').closest('div')
      const radioButton = optionContainer?.querySelector('button[role="radio"]')
      if (radioButton) {
        fireEvent.click(radioButton)
      }
    } else {
      fireEvent.click(durationOption)
    }
    
    // Continue button should be enabled now
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