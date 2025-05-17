import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import SymptomsPage from '../page'
import * as SymptomsHook from '../hooks/use-symptoms'

// Mock the hook
vi.mock('../../../../../hooks/assessment/steps/use-symptoms', () => ({
  useSymptoms: vi.fn()
}));

// Wrap component with BrowserRouter for React Router compatibility
const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Symptoms Page to Hook Connection', () => {
  const mockSetPhysicalSymptoms = vi.fn();
  const mockSetEmotionalSymptoms = vi.fn();
  
  beforeEach(() => {
    vi.resetAllMocks();
    (SymptomsHook.useSymptoms as any).mockReturnValue({
      physicalSymptoms: [],
      emotionalSymptoms: [],
      setPhysicalSymptoms: mockSetPhysicalSymptoms,
      setEmotionalSymptoms: mockSetEmotionalSymptoms
    });
  });
  
  it('should call hook with correct value when physical symptom is selected', () => {
    renderWithRouter(<SymptomsPage />)
    
    // Find the Bloating option and click it
    const symptomOption = screen.getByText('Bloating').closest('div')
    if (symptomOption) {
      fireEvent.click(symptomOption)
    }
    
    // Check that the hook's setPhysicalSymptoms was called with the correct value
    expect(mockSetPhysicalSymptoms).toHaveBeenCalledWith(['bloating'])
  })
  
  it('should call hook with correct value when emotional symptom is selected', () => {
    renderWithRouter(<SymptomsPage />)
    
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
    (SymptomsHook.useSymptoms as any).mockReturnValue({
      physicalSymptoms: ['bloating', 'headaches'],
      emotionalSymptoms: ['anxiety', 'mood-swings'],
      setPhysicalSymptoms: mockSetPhysicalSymptoms,
      setEmotionalSymptoms: mockSetEmotionalSymptoms
    });
    
    renderWithRouter(<SymptomsPage />)
    
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