import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import CycleLengthPage from '../page'

// Wrap component with BrowserRouter for React Router compatibility
const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('CycleLength', () => {
  it('should render the cycle length page correctly', () => {
    renderWithRouter(<CycleLengthPage />)
    
    // Check if the main heading is displayed
    expect(screen.getByText('How long is your menstrual cycle?')).toBeInTheDocument()
    
    // Check if all cycle length options are displayed
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
    renderWithRouter(<CycleLengthPage />)
    
    // Continue button should be disabled initially
    const continueButton = screen.getByText('Continue').closest('button')
    expect(continueButton).toBeDisabled()
    
    // Select a cycle length option
    const cycleOption = screen.getByRole('radio', { name: /26-30 days/i }) || 
                        screen.getByTestId('26-30') || 
                        document.getElementById('26-30')
    
    // If we can't find it by role, try to find it directly
    if (!cycleOption) {
      const optionContainer = screen.getByText('26-30 days').closest('div')
      const radioButton = optionContainer?.querySelector('button[role="radio"]')
      if (radioButton) {
        fireEvent.click(radioButton)
      }
    } else {
      fireEvent.click(cycleOption)
    }
    
    // Continue button should be enabled now
    expect(continueButton).not.toBeDisabled()
  })

  it('should navigate to the previous page when back button is clicked', () => {
    renderWithRouter(<CycleLengthPage />)
    
    // Check if the back button links to the age verification page
    const backButton = screen.getByText('Back').closest('a')
    expect(backButton).toHaveAttribute('href', '/assessment/age-verification')
  })
}) 