import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

// Import test utilities
import { 
  navigateToAgeVerification,
  navigateToCycleLength,
  renderResults,
  clearSessionStorage
} from './test-utils'

describe('Irregular Menstrual Cycle Assessment Path', () => {
  // Set up user event
  const user = userEvent.setup()
  
  // Clear session storage after each test
  beforeEach(() => {
    clearSessionStorage()
  })
  
  afterEach(() => {
    clearSessionStorage()
  })
  
  it('should show irregular timing results when cycle length is outside typical range', async () => {
    // Navigate through essential steps (only need to get to cycle length)
    await navigateToAgeVerification(user, '25+ years')
    await navigateToCycleLength(user, 'Irregular')
    
    // Setup session storage for results page
    const sessionData = {
      age: '25+ years',
      cycleLength: 'Irregular'
    }
    
    // Render results page
    renderResults(sessionData)
    
    // Verify heading is present
    expect(screen.getByText(/Your Assessment Results/i)).toBeInTheDocument()
    
    // Verify irregular cycle pattern (O1 in LogicTree)
    expect(screen.getByText('Your cycle length is outside the typical range, which may indicate hormonal fluctuations.')).toBeInTheDocument()
    
    // Check that metrics display correctly
    expect(screen.getAllByText('Irregular')[0]).toBeInTheDocument()
    
    // Check for irregular cycle recommendations
    expect(screen.getByText('Consult a Healthcare Provider', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Track Your Cycle', { exact: false })).toBeInTheDocument()
    expect(screen.getByText('Stress Management', { exact: false })).toBeInTheDocument()
  })
  
  it('should show irregular results for very short cycles', async () => {
    // Navigate through essential steps with a different cycle length
    await navigateToAgeVerification(user, '25+ years')
    
    // Since we can't directly select "Less than 21 days" through the helper (it uses labels),
    // we'll simulate it by setting the session storage directly
    
    // Setup session storage for results page
    const sessionData = {
      age: '25+ years',
      cycleLength: 'Less than 21 days'
    }
    
    // Render results page
    renderResults(sessionData)
    
    // Verify heading is present
    expect(screen.getByText(/Your Assessment Results/i)).toBeInTheDocument()
    
    // Verify irregular cycle pattern (O1 in LogicTree)
    expect(screen.getByText('Your cycle length is outside the typical range, which may indicate hormonal fluctuations.')).toBeInTheDocument()
    
    // Check for irregular cycle recommendations
    expect(screen.getByText('Consult a Healthcare Provider', { exact: false })).toBeInTheDocument()
  })
}) 