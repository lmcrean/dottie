import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Import test utilities
import { 
  navigateToAgeVerification,
  navigateToCycleLength,
  navigateToPeriodDuration,
  navigateToFlow,
  navigateToPain,
  navigateToSymptoms,
  renderResults,
  clearSessionStorage
} from './test-utils'

describe('Pain-Predominant Menstrual Pattern Assessment Path', () => {
  // Set up user event
  const user = userEvent.setup()
  
  // Clear session storage after each test
  beforeEach(() => {
    clearSessionStorage()
  })
  
  afterEach(() => {
    clearSessionStorage()
  })
  
  it('should show pain-predominant results when pain is higher than typical', async () => {
    // Navigate through all steps sequentially
    await navigateToAgeVerification(user, '18-24 years')
    await navigateToCycleLength(user, '26-30 days')
    await navigateToPeriodDuration(user, '4-5 days')
    await navigateToFlow(user, 'Moderate')
    await navigateToPain(user, 'Severe')
    await navigateToSymptoms(user, 'Headaches')
    
    // Setup session storage for results page with correct keys
    const sessionData = {
      age: '18-24 years',
      cycleLength: '26-30 days',
      periodDuration: '4-5 days',
      flowHeaviness: 'moderate', // Use correct key "flowHeaviness" rather than "flowLevel"
      painLevel: 'severe', // Use lowercase to match app expectations
      symptoms: {  // Format as object with physical and emotional arrays
        physical: ['headaches'],
        emotional: []
      }
    }
    
    // Render results page
    renderResults(sessionData)
    
    // Verify heading is present
    expect(screen.getByText(/Your Assessment Results/i)).toBeInTheDocument()
    
    // Verify pain-predominant pattern (O3 in LogicTree)
    expect(screen.getByText(/your menstrual pain is higher than typical/i, { exact: false })).toBeInTheDocument()
    
    // Check that metrics display correctly
    expect(screen.getAllByText(/severe/i)[0]).toBeInTheDocument()
    expect(screen.getAllByText(/headaches/i)[0]).toBeInTheDocument()
    
    // Check for pain-related recommendations
    expect(screen.getByText(/Heat Therapy/i, { exact: false })).toBeInTheDocument()
    expect(screen.getByText(/Pain Management/i, { exact: false })).toBeInTheDocument()
    expect(screen.getByText(/Gentle Exercise/i, { exact: false })).toBeInTheDocument()
    expect(screen.getByText(/Medical Support/i, { exact: false })).toBeInTheDocument()
  })
  
  it('should show pain pattern even with additional symptoms', async () => {
    // Setup session storage for results page with multiple symptoms
    const sessionData = {
      age: '18-24 years',
      cycleLength: '26-30 days',
      periodDuration: '4-5 days',
      flowHeaviness: 'moderate', // Use correct key "flowHeaviness" rather than "flowLevel"
      painLevel: 'severe', // Use lowercase to match app expectations
      symptoms: {  // Format as object with physical and emotional arrays
        physical: ['headaches', 'bloating', 'fatigue'],
        emotional: []
      }
    }
    
    // Render results page
    renderResults(sessionData)
    
    // Verify heading is present
    expect(screen.getByText(/Your Assessment Results/i)).toBeInTheDocument()
    
    // Verify pain pattern text is shown
    expect(screen.getByText(/Pain-Predominant Pattern/i, { exact: false })).toBeInTheDocument()
    
    // Verify pain level is shown
    expect(screen.getAllByText(/severe/i)[0]).toBeInTheDocument()
    
    // Check for symptoms section heading
    expect(screen.getByText('Symptoms')).toBeInTheDocument()
  })
}) 