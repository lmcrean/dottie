import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import PainPage from '../page'

// Wrap component with BrowserRouter for React Router compatibility
const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Pain', () => {
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
    renderWithRouter(<PainPage />)
    
    // Continue button should be disabled initially
    const continueButton = screen.getByText('Continue').closest('button')
    expect(continueButton).toBeDisabled()
    
    // Select a pain level option
    const painOption = screen.getByRole('radio', { name: /moderate/i }) || 
                       screen.getByTestId('moderate') || 
                       document.getElementById('moderate')
    
    // If we can't find it by role, try to find it directly
    if (!painOption) {
      const optionContainer = screen.getByText('Moderate').closest('div')
      const radioButton = optionContainer?.querySelector('button[role="radio"]')
      if (radioButton) {
        fireEvent.click(radioButton)
      }
    } else {
      fireEvent.click(painOption)
    }
    
    // Continue button should be enabled now
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