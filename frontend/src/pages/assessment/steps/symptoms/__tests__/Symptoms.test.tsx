import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import SymptomsPage from '../page'
import { AssessmentResultProvider } from '../../../../../context/assessment/AssessmentResultProvider'
import * as SymptomsHook from '../../../../../hooks/assessment/steps/use-symptoms'

// Mock the hook
vi.mock('../../../../../hooks/assessment/steps/use-symptoms', () => ({
  useSymptoms: vi.fn()
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

describe('Symptoms', () => {
  const mockSetPhysicalSymptoms = vi.fn();
  const mockSetEmotionalSymptoms = vi.fn();
  const mockSetOtherSymptoms = vi.fn();
  
  // Reset mocks before each test
  beforeEach(() => {
    vi.resetAllMocks();
    // Default mock implementation
    (SymptomsHook.useSymptoms as any).mockReturnValue({
      physicalSymptoms: [],
      emotionalSymptoms: [],
      otherSymptoms: '',
      setPhysicalSymptoms: mockSetPhysicalSymptoms,
      setEmotionalSymptoms: mockSetEmotionalSymptoms,
      setOtherSymptoms: mockSetOtherSymptoms
    });
  });
  
  it('should render the symptoms page correctly', () => {
    renderWithRouter(<SymptomsPage />)
    
    // Check if the main heading is displayed
    expect(screen.getByText('What symptoms do you experience during your period?')).toBeInTheDocument()
    
    // Check if section headings are displayed
    expect(screen.getByText('Physical Symptoms')).toBeInTheDocument()
    expect(screen.getByText('Emotional Symptoms')).toBeInTheDocument()
  })

  it('should allow selecting physical symptoms', () => {
    // Mock physical symptoms already selected
    (SymptomsHook.useSymptoms as any).mockReturnValue({
      physicalSymptoms: ['cramps', 'bloating'],
      emotionalSymptoms: [],
      otherSymptoms: '',
      setPhysicalSymptoms: mockSetPhysicalSymptoms,
      setEmotionalSymptoms: mockSetEmotionalSymptoms,
      setOtherSymptoms: mockSetOtherSymptoms
    });
    
    renderWithRouter(<SymptomsPage />)
    
    // Ensure Continue button is not disabled
    const continueButton = screen.getByRole('button', { name: 'Continue' })
    expect(continueButton).not.toBeDisabled()
  })

  it('should allow selecting emotional symptoms', () => {
    // Mock emotional symptoms already selected
    (SymptomsHook.useSymptoms as any).mockReturnValue({
      physicalSymptoms: [],
      emotionalSymptoms: ['irritability', 'mood-swings'],
      otherSymptoms: '',
      setPhysicalSymptoms: mockSetPhysicalSymptoms,
      setEmotionalSymptoms: mockSetEmotionalSymptoms,
      setOtherSymptoms: mockSetOtherSymptoms
    });
    
    renderWithRouter(<SymptomsPage />)
    
    // Ensure Continue button is not disabled
    const continueButton = screen.getByRole('button', { name: 'Continue' })
    expect(continueButton).not.toBeDisabled()
  })

  it('should allow entering other symptoms', () => {
    // Mock other symptoms text
    (SymptomsHook.useSymptoms as any).mockReturnValue({
      physicalSymptoms: [],
      emotionalSymptoms: [],
      otherSymptoms: 'Dizziness',
      setPhysicalSymptoms: mockSetPhysicalSymptoms,
      setEmotionalSymptoms: mockSetEmotionalSymptoms,
      setOtherSymptoms: mockSetOtherSymptoms
    });
    
    renderWithRouter(<SymptomsPage />)
    
    // Check if the textarea has the correct value
    const textarea = screen.getByPlaceholderText('Type any other symptoms here...')
    expect(textarea).toHaveValue('Dizziness')
  })

  it('should navigate to the previous page when back button is clicked', () => {
    renderWithRouter(<SymptomsPage />)
    
    // Check if the back button links to the pain page
    const backButton = screen.getByText('Back').closest('a')
    expect(backButton).toHaveAttribute('href', '/assessment/pain')
  })
}) 