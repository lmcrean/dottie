import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import AgeVerificationPage from '../page'

// Wrap component with BrowserRouter for React Router compatibility
const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('AgeVerification', () => {
  it('should render the age verification page correctly', () => {
    renderWithRouter(<AgeVerificationPage />)
    
    // Check if the heading is displayed
    expect(screen.getByText('What is your age range?')).toBeInTheDocument()
    
    // Check if all age options are displayed
    expect(screen.getByText('Under 13 years')).toBeInTheDocument()
    expect(screen.getByText('13-17 years')).toBeInTheDocument()
    expect(screen.getByText('18-24 years')).toBeInTheDocument()
    expect(screen.getByText('25+ years')).toBeInTheDocument()
  })

  it('should enable the continue button when an age is selected', () => {
    renderWithRouter(<AgeVerificationPage />)
    
    // Continue button should be disabled initially
    const continueButton = screen.getByText('Continue').closest('button')
    expect(continueButton).toBeDisabled()
    
    // Find the radio button by its ID instead of label text
    const ageOption = screen.getByRole('radio', { name: /18-24 years/i }) || 
                      screen.getByTestId('18-24') || 
                      document.getElementById('18-24')
    
    // If we can't find it by role, try to find it directly
    if (!ageOption) {
      const optionContainer = screen.getByText('18-24 years').closest('div')
      const radioButton = optionContainer?.querySelector('button[role="radio"]')
      if (radioButton) {
        fireEvent.click(radioButton)
      }
    } else {
      fireEvent.click(ageOption)
    }
    
    // Continue button should be enabled now
    expect(continueButton).not.toBeDisabled()
  })
}) 