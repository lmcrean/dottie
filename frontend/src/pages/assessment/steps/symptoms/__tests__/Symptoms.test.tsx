import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import SymptomsPage from '../page'

// Wrap component with BrowserRouter for React Router compatibility
const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Symptoms', () => {
  it('should render the symptoms page correctly', () => {
    renderWithRouter(<SymptomsPage />)
    
    // Check if the main heading is displayed
    expect(screen.getByText('Do you experience any other symptoms with your period?')).toBeInTheDocument()
    
    // Check if symptom categories are displayed
    expect(screen.getByText('Physical symptoms')).toBeInTheDocument()
    expect(screen.getByText('Emotional/Mood symptoms')).toBeInTheDocument()
    
    // Check if some physical symptoms are displayed
    expect(screen.getByText('Bloating')).toBeInTheDocument()
    expect(screen.getByText('Headaches')).toBeInTheDocument()
    expect(screen.getByText('Fatigue')).toBeInTheDocument()
    
    // Check if some emotional symptoms are displayed
    expect(screen.getByText('Mood swings')).toBeInTheDocument()
    expect(screen.getByText('Anxiety')).toBeInTheDocument()
    expect(screen.getByText('Depression')).toBeInTheDocument()
    
    // Check if the informational content is displayed
    expect(screen.getByText('About Period Symptoms')).toBeInTheDocument()
  })

  it('should allow selecting physical symptoms', () => {
    renderWithRouter(<SymptomsPage />)
    
    // Find a symptom to click on
    const bloatingSymptom = screen.getByText('Bloating').closest('div')
    
    // Click to select the symptom
    if (bloatingSymptom) {
      fireEvent.click(bloatingSymptom)
      
      // Check that the symptom is now selected (has the background color class)
      expect(bloatingSymptom).toHaveClass('bg-pink-50')
      
      // Click again to deselect
      fireEvent.click(bloatingSymptom)
      
      // Check that the symptom is now deselected
      expect(bloatingSymptom).not.toHaveClass('bg-pink-50')
    }
  })

  it('should allow selecting emotional symptoms', () => {
    renderWithRouter(<SymptomsPage />)
    
    // Find a symptom to click on
    const anxietySymptom = screen.getByText('Anxiety').closest('div')
    
    // Click to select the symptom
    if (anxietySymptom) {
      fireEvent.click(anxietySymptom)
      
      // Check that the symptom is now selected (has the background color class)
      expect(anxietySymptom).toHaveClass('bg-pink-50')
      
      // Click again to deselect
      fireEvent.click(anxietySymptom)
      
      // Check that the symptom is now deselected
      expect(anxietySymptom).not.toHaveClass('bg-pink-50')
    }
  })

  it('should allow entering other symptoms', () => {
    renderWithRouter(<SymptomsPage />)
    
    // Find the input field
    const inputField = screen.getByPlaceholderText('Type any other symptoms here...')
    
    // Enter some text
    fireEvent.change(inputField, { target: { value: 'Test symptom' } })
    
    // Check that the input value was updated
    expect(inputField).toHaveValue('Test symptom')
  })

  it('should navigate to the previous page when back button is clicked', () => {
    renderWithRouter(<SymptomsPage />)
    
    // Check if the back button links to the pain page
    const backButton = screen.getByText('Back').closest('a')
    expect(backButton).toHaveAttribute('href', '/assessment/pain')
  })
}) 