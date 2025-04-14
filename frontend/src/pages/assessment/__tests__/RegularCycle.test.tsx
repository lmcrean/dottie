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

describe('Regular Menstrual Cycle Assessment Path', () => {
  // Set up user event
  const user = userEvent.setup()
  
  // Clear session storage after each test
  beforeEach(() => {
    clearSessionStorage()
  })
  
  afterEach(() => {
    clearSessionStorage()
  })
  
  it('should navigate through assessment and show regular cycle results', async () => {
    // Navigate through all steps sequentially
    await navigateToAgeVerification(user, '18-24 years')
    await navigateToCycleLength(user, '26-30 days')
    await navigateToPeriodDuration(user, '4-5 days')
    await navigateToFlow(user, 'Moderate')
    await navigateToPain(user, 'Mild')
    await navigateToSymptoms(user, 'Fatigue')
    
    // Setup session storage for results page
    const sessionData = {
      age: '18-24 years',
      cycleLength: '26-30 days',
      periodDuration: '4-5 days',
      flowLevel: 'Moderate',
      painLevel: 'Mild',
      symptoms: ['Fatigue']
    }
    
    // Render results page
    renderResults(sessionData)
    
    // Verify heading is present
    expect(screen.getByText(/Your Assessment Results/i)).toBeInTheDocument()
    
    // Verify regular cycle pattern (O4 in LogicTree)
    expect(screen.getByText('Your menstrual cycles follow a normal, healthy pattern according to ACOG guidelines.')).toBeInTheDocument()
    
    // Check that metrics display correctly
    expect(screen.getAllByText('26-30 days')[0]).toBeInTheDocument()
    expect(screen.getAllByText('4-5 days')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Moderate')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Mild')[0]).toBeInTheDocument()
    expect(screen.getAllByText('Fatigue')[0]).toBeInTheDocument() // Check selected symptom
    
    // Check for regular cycle recommendations
    expect(screen.getByText('Track Your Cycle', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Exercise Regularly', { exact: false })).toBeInTheDocument()
  })
}) 