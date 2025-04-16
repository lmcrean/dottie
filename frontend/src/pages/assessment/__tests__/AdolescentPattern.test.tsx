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

describe('Adolescent Menstrual Pattern Assessment Path', () => {
  // Set up user event
  const user = userEvent.setup()
  
  // Clear session storage after each test
  beforeEach(() => {
    clearSessionStorage()
  })
  
  afterEach(() => {
    clearSessionStorage()
  })
  
  it('should show developing pattern results for 13-17 age group', async () => {
    // Navigate through essential steps
    await navigateToAgeVerification(user, '13-17 years')
    
    // Setup session storage for results page with regular cycle data
    const sessionData = {
      age: '13-17 years',
      cycleLength: '31-35 days',
      periodDuration: '4-5 days',
      flowLevel: 'Moderate',
      painLevel: 'Mild',
      symptoms: ['Fatigue']
    }
    
    // Render results page
    renderResults(sessionData)
    
    // Verify heading is present
    expect(screen.getByText(/Your Assessment Results/i)).toBeInTheDocument()
    
    // Check for the age group
    expect(screen.getAllByText('13-17 years')[0]).toBeInTheDocument()
    
    // Check that metrics display correctly
    expect(screen.getAllByText('31-35 days')[0]).toBeInTheDocument()
    
    // Check for pattern heading (should be "Developing Pattern" based on the log output)
    expect(screen.getByText(/Developing Pattern/i)).toBeInTheDocument()
  })
  
  it('should prioritize irregular pattern over adolescent age', async () => {
    // Setup session storage for results page with irregular cycle data
    const sessionData = {
      age: '13-17 years',
      cycleLength: 'Irregular',
      periodDuration: '6-7 days',
      flowLevel: 'Heavy',
      painLevel: 'Moderate',
      symptoms: ['Bloating', 'Headaches']
    }
    
    // Render results page
    renderResults(sessionData)
    
    // Verify heading is present
    expect(screen.getByText(/Your Assessment Results/i)).toBeInTheDocument()
    
    // Check that "Irregular Timing Pattern" is displayed (based on the log output)
    expect(screen.getByText(/Irregular Timing Pattern/i)).toBeInTheDocument()
    
    // Verify irregular cycle pattern description
    expect(screen.getByText(/Your cycle length is outside the typical range, which may indicate hormonal fluctuations/i)).toBeInTheDocument()
    
    // Check for cycle length in display
    expect(screen.getAllByText('Irregular')[0]).toBeInTheDocument()
    
    // Check for symptoms section heading
    expect(screen.getByText('Symptoms')).toBeInTheDocument()
  })
}) 