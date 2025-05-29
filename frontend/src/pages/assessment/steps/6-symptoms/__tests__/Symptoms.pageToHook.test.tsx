import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import SymptomsPage from '../page'
import * as SymptomsHook from '../hooks/use-symptoms'
import { AssessmentResultProvider } from '../../context/AssessmentResultProvider'

// Mock the hook
vi.mock('../hooks/use-symptoms');

// Wrap component with BrowserRouter and AssessmentResultProvider for React Router compatibility
const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <AssessmentResultProvider>
      <BrowserRouter>
        {component}
      </BrowserRouter>
    </AssessmentResultProvider>
  )
}

describe('Symptoms Page to Hook Connection', () => {
  const mockSetPhysicalSymptoms = vi.fn();
  const mockSetEmotionalSymptoms = vi.fn();
  const mockSetOtherSymptoms = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    
    // Use vi.spyOn to mock the implementation
    vi.spyOn(SymptomsHook, 'useSymptoms').mockImplementation(() => ({
      physicalSymptoms: [],
      emotionalSymptoms: [],
      otherSymptoms: '',
      setPhysicalSymptoms: mockSetPhysicalSymptoms,
      setEmotionalSymptoms: mockSetEmotionalSymptoms,
      setOtherSymptoms: mockSetOtherSymptoms
    }));
  });
  
  it('should call hook with correct value when physical symptom is selected', () => {
    renderWithProviders(<SymptomsPage />)
    
    // Find the Bloating option and click it
    const symptomOption = screen.getByText('Bloating').closest('div')
    if (symptomOption) {
      fireEvent.click(symptomOption)
    }
    
    // Check that the hook's setPhysicalSymptoms was called with the correct value
    expect(mockSetPhysicalSymptoms).toHaveBeenCalledWith(['bloating'])
  })
  
  it('should call hook with correct value when emotional symptom is selected', () => {
    renderWithProviders(<SymptomsPage />)
    
    // Find the Anxiety option and click it
    const symptomOption = screen.getByText('Anxiety').closest('div')
    if (symptomOption) {
      fireEvent.click(symptomOption)
    }
    
    // Check that the hook's setEmotionalSymptoms was called with the correct value
    expect(mockSetEmotionalSymptoms).toHaveBeenCalledWith(['anxiety'])
  })
  
  it('should preselect symptoms when hook returns values', () => {
    // Mock hook to return selected values
    vi.spyOn(SymptomsHook, 'useSymptoms').mockImplementation(() => ({
      physicalSymptoms: ['bloating', 'headaches'],
      emotionalSymptoms: ['anxiety', 'mood-swings'],
      otherSymptoms: '',
      setPhysicalSymptoms: mockSetPhysicalSymptoms,
      setEmotionalSymptoms: mockSetEmotionalSymptoms,
      setOtherSymptoms: mockSetOtherSymptoms
    }));
    
    renderWithProviders(<SymptomsPage />)
    
    // Check that physical symptoms are selected
    const bloatingOption = screen.getByText('Bloating').closest('div')
    const headachesOption = screen.getByText('Headaches').closest('div')
    expect(bloatingOption).toHaveClass('bg-pink-50')
    expect(headachesOption).toHaveClass('bg-pink-50')
    
    // Check that emotional symptoms are selected
    const anxietyOption = screen.getByText('Anxiety').closest('div')
    const moodSwingsOption = screen.getByText('Mood swings').closest('div')
    expect(anxietyOption).toHaveClass('bg-pink-50')
    expect(moodSwingsOption).toHaveClass('bg-pink-50')
  })
}) 